<?php
/**
 * Misc AJAX handlers used throughout the site.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Ajax;

use function ALIEMU\Slack\slack_message;

defined( 'ABSPATH' ) || exit;

/**
 * AJAX Handler that sends messages from the feedback form into slack if recaptcha validates.
 */
function send_slack_message(): void {
	if (
		isset( $_POST['recaptcha_token'], $_POST['email'], $_POST['name'], $_POST['message'], $_POST['nonce'] ) // Input var okay.
		&& wp_verify_nonce( sanitize_key( $_POST['nonce'] ), 'wp_ajax' )  // Input var okay.
	) {
		if ( recaptcha_token_is_valid( $_POST['recaptcha_token'] ) ) { // phpcs:ignore
			slack_message(
				'aliemu/messages/contact-form', [
					'name'    => sanitize_text_field( wp_unslash( $_POST['name'] ) ), // Input var okay.
					'email'   => sanitize_text_field( wp_unslash( $_POST['email'] ) ), // Input var okay.
					'message' => stripslashes( wp_strip_all_tags( sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) ) ), // Input var okay.
				]
			);
			wp_send_json_success();
		}
	}
	wp_send_json_error();
}
add_action( 'wp_ajax_send_slack_message', __NAMESPACE__ . '\send_slack_message' );
add_action( 'wp_ajax_nopriv_send_slack_message', __NAMESPACE__ . '\send_slack_message' );

/**
 * Helper function that validates recaptcha-generated tokens with Google and
 * returns whether or not the token was valid.
 *
 * @param string $token  The token to check.
 * @return bool Validation status.
 */
function recaptcha_token_is_valid( string $token ) : bool {
	$response = wp_remote_post(
		'https://www.google.com/recaptcha/api/siteverify', [
			'body' => [
				'secret'   => RECAPTCHA_KEY,
				'response' => $token,
			],
		]
	);
	if ( is_wp_error( $response ) ) {
		return false;
	} else {
		$body = json_decode( $response['body'], true );
		return true === $body['success'];
	}
}

