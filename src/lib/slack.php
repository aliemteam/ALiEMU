<?php
/**
 * Functions related to sending events/messages to Slack.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Slack;

defined( 'ABSPATH' ) || exit;

/**
 * Sends message to slack when dashboard access is requested.
 *
 * @param int $id User ID.
 */
function requested_dashboard_access( $id ) : void {
	// Ignoring this block of text because it wants me to put "// Input var okay."
	// literally at the end of every line. Not happening.
	// @codingStandardsIgnoreStart
	if (
		isset(
			$_POST['au_requested_educator_access'],
			$_POST['form_id'],
			$_POST['_wpnonce']
		)
		&& wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'um_register_form' )
		&& 'Yes' === $_POST['au_requested_educator_access'][0] ) {
			$form_id      = intval( $_POST['form_id'] );
			$first_name   = sanitize_text_field( $_POST[ "first_name-$form_id" ] );
			$last_name    = sanitize_text_field( $_POST[ "last_name-$form_id" ] );
			$message_data = [
				'id'       => $id,
				'name'     => "$first_name $last_name",
				'username' => sanitize_text_field( $_POST[ "user_login-$form_id" ] ),
				'email'    => sanitize_email( $_POST[ "user_email-$form_id" ] ),
				'program'  => sanitize_text_field( $_POST['residency_us_em'] ),
				'role'     => sanitize_text_field( $_POST['role'] ),
				'bio'      => sanitize_textarea_field( $_POST['description'] ),
			];
			slack_message( 'aliemu/messages/dashboard-access', $message_data );
	}
	// @codingStandardsIgnoreEnd
}
add_action( 'user_register', __NAMESPACE__ . '\requested_dashboard_access' );

/**
 * Routes all comments to Slack.
 *
 * @param  string $comment_id The comment ID.
 */
function slack_comment( $comment_id ) {
	$comment  = get_comment( $comment_id );
	$post     = get_post( $comment->comment_post_ID );
	$category = get_the_category( $post->ID )[0]->slug;

	if ( ! in_array( $category, [ 'capsules', 'air', 'air-pro', 'in-training-exam-prep' ], true ) ) {
		$category = 'aliemu';
	}

	slack_message(
		"$category/messages/comments", [
			'name'     => $comment->comment_author,
			'email'    => $comment->comment_author_email,
			'content'  => $comment->comment_content,
			'postUrl'  => $post->guid,
			'postName' => $post->post_title,
		]
	);
}
add_action( 'comment_post', __NAMESPACE__ . '\slack_comment' );

/**
 * Master handler for posting messages to Slack.
 *
 * Tries a total of five times to send the message to slack. If the message is
 *  posted successfully (eg, if the HTTP response is 200), then functoin exits.
 *
 * @param  string  $route Enpoint to hit.
 * @param  mixed[] $data  Associative array of data to send.
 */
function slack_message( $route, $data ) : void {
	// Don't message slack when developing / testing.
	if ( WP_DEBUG ) {
		// Debug code is not used in production here. So warning is incorrect.
		// @codingStandardsIgnoreStart
		trigger_error(
			wp_json_encode(
				[
					'route' => $route,
					'data'  => $data,
				]
			)
		);
		// @codingStandardsIgnoreEnd
		return;
	}
	for ( $i = 0; $i < 5; $i++ ) {
		$response = wp_remote_post(
			"https://aliem-slackbot.now.sh/$route", [
				'headers' => [
					'ALIEM_API_KEY' => get_option( 'ALIEM_API_KEY' ),
				],
				'body'    => [
					'data' => wp_json_encode( $data ),
				],
			]
		);
		if ( ! is_wp_error( $response ) ) {
			break;
		}
	}
}
