<?php
/**
 * Utility helper functions for use across the theme.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Utils;

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

// FIXME: Should this be removed in favor of `rest_ensure_response`?
/**
 * Checks if a given WP_Rest_Response is an error. If so, calls wp_die and dumps an error message.
 *
 * @param \WP_Rest_Response $response WordPress response instance.
 * @param bool              $die True if an error should be fatal.
 */
function check_rest_response( \WP_Rest_Response $response, $die = false ) {
	if ( $response->is_error() ) {
		$error      = $response->as_error();
		$msg        = $error->get_error_message();
		$error_data = $error->get_error_data();
		if ( $die ) {
			wp_die( printf( '<p>An error occurred: %s (%d)</p>', $msg, $error_data ) ); // @codingStandardsIgnoreLine
		}
		return array_merge( $error_data, [ 'message' => $msg ] );
	}
	return false;
}
