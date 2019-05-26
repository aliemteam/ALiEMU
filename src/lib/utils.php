<?php
/**
 * Utility helper functions for use across the theme.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Utils;

use WP_Error;

/**
 * Turns an associative array CSS keys and values into an inline CSS string.
 *
 * @param string[] $input CSS key value pairs.
 */
function array_css( array $input ) : string {
	$css = '';
	foreach ( $input as $k => $v ) {
		$css .= "$k: $v; ";
	}
	return $css;
}

/**
 * Enhances `shortcode_unautop` by also removing empty `<p>` tags and delimiting
 * `<br>` elements.
 *
 * @param string $content The content to be transformed.
 */
function unautop( string $content ) : string {
	$content = shortcode_unautop( $content );
	$content = preg_replace( '/<p>\s*<\/p>/', '', $content );
	preg_match( '/^(?<br><br(?: \/)?>)\s*(?<content>.+?)(\k<br>)$/s', $content, $matches );
	return $matches['content'] ?? $content;
}

/**
 * Given a custom post type as input, output a the regular name for it.
 *
 * @param string $post_type Post type.
 * @param bool   $plural True if returned string be pluralized.
 * @throws Error If string is not a valid post type.
 */
function post_type_normalized( string $post_type, $plural = false ) : string {
	$value = array_search( $post_type, ALIEMU_POST_TYPES, true );
	if ( ! $value ) {
		throw new Error( "Invalid post type: $post_type" );
	} elseif ( 'quiz' === $value ) {
		return $plural ? 'quizzes' : 'quiz';
	} else {
		return $plural ? $value . 's' : $value;
	}
}

/**
 * Unwraps a WP_Error and returns the first error code and message that exists on it.
 *
 * @param WP_Error $error A WP_Error instance.
 */
function get_first_error( WP_Error $error ) : array {
	return [
		'code'    => $error->get_error_code(),
		'message' => $error->get_error_message(),
	];
}

/**
 * Master handler for posting messages to Slack.
 *
 * Tries a total of five times to send the message to slack. If the message is
 *  posted successfully (eg, if the HTTP response is 200), then functoin exits.
 *
 * @param  string $channel  Name of the channel to post the message to, including leading #.
 * @param  array  $message {
 *     Optional. A single Slack "attachment" object to post.
 *     @see https://api.slack.com/docs/message-attachments#attachment_parameters
 * }
 * @return WP_Error|array {
 *     @type int    $code    Response code.
 *     @type string $message Response message.
 * }
 */
function slack_message( string $channel, array $message ) {
	$message = array_merge(
		[
			'color'     => '#01579b',
			'footer'    => 'ALiEMU',
			'ts'        => time(),
			'mrkdwn_in' => [ 'pretext' ],
		],
		$message
	);
	if ( defined( 'WP_LOCAL_DEV' ) && WP_LOCAL_DEV ) {
		$response = [
			'response' => [
				'code'    => 200,
				'message' => wp_json_encode(
					[
						'channel' => $channel,
						'message' => $message,
					]
				),
			],
		];
	} else {
		$response = wp_remote_post(
			'https://us-central1-aliem-1136.cloudfunctions.net/slack_msg',
			[
				'headers' => [
					'Content-Type' => 'application/json',
				],
				'body'    => wp_json_encode(
					[
						'token'   => ALIEM_API_KEY,
						'channel' => $channel,
						'message' => $message,
					]
				),
			]
		);
	}

	return is_wp_error( $response ) ? $response : $response['response'];
}

/**
 * Fetch profile data from gravatar for a given email address.
 *
 * @param string $email The email address of the user.
 */
function gravatar_profile_data( string $email ) : object {
	$hash = md5( strtolower( trim( $email ) ) );
	$data = wp_cache_get( 'gravatar_json', $hash );
	if ( ! $data ) {
		$response = wp_remote_get( 'https://www.gravatar.com/' . $hash . '.json' );
		if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
			$data = json_decode( $response['body'] );
			$data = $data->entry[0];
		} else {
			$data = (object) [
				'thumbnailUrl' => 'https://secure.gravatar.com/avatar/' . $hash,
			];
		}
		wp_cache_set( 'gravatar_json', $data, $hash, DAY_IN_SECONDS );
	}
	return $data;
}

/**
 * Helper function to register a script, its dependencies, and its associated
 * stylesheet if it exists.
 *
 * @param string $name      The filename of the script (without the extension).
 * @param bool   $in_footer If the script should be loaded in the footer.
 */
function register_script( string $name, bool $in_footer = true ) {
	$handle      = "aliemu-$name";
	$script_path = ALIEMU_ROOT_PATH . "/bundle/$name.js";
	$style_path  = ALIEMU_ROOT_PATH . "/bundle/$name.css";
	$deps_path   = ALIEMU_ROOT_PATH . "/bundle/$name.deps.json";
	$script_uri  = ALIEMU_ROOT_URI . "/bundle/$name.js";
	$style_uri   = ALIEMU_ROOT_URI . "/bundle/$name.css";

	if ( ! file_exists( $script_path ) ) {
		wp_die( esc_html( "Script file '$script_path' does not exist" ) );
	}

	wp_register_script(
		$handle,
		$script_uri,
		file_exists( $deps_path )
			? json_decode( file_get_contents( $deps_path ) ) // phpcs:ignore
			: [],
		filemtime( $script_path ),
		$in_footer,
	);

	if ( file_exists( $style_path ) ) {
		wp_register_style(
			$handle,
			$style_uri,
			[],
			filemtime( $style_path ),
		);
	}
}
