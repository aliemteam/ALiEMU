<?php
/**
 * Misc AJAX handlers used throughout the site.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Ajax;

defined( 'ABSPATH' ) || exit;

use function ALIEMU\Utils\{
	get_first_error,
	slack_message,
};

/**
 * AJAX Handler that sends messages from the feedback form into slack if recaptcha validates.
 */
function send_slack_message(): void {
	check_ajax_referer( 'wp_ajax' );

	if ( isset( $_POST['recaptcha_token'], $_POST['email'], $_POST['name'], $_POST['message'] )
		&& recaptcha_token_is_valid( $_POST['recaptcha_token'] ) ) { // phpcs:ignore
			slack_message(
				'aliemu/messages/contact-form', [
					'name'    => sanitize_text_field( wp_unslash( $_POST['name'] ) ),
					'email'   => sanitize_text_field( wp_unslash( $_POST['email'] ) ),
					'message' => stripslashes( wp_strip_all_tags( sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) ) ),
				]
			);
			wp_send_json_success();
	}

	wp_send_json_error();
}
add_action( 'wp_ajax_send_slack_message', __NAMESPACE__ . '\send_slack_message' );
add_action( 'wp_ajax_nopriv_send_slack_message', __NAMESPACE__ . '\send_slack_message' );

/**
 * AJAX Handler that initiates a password reset operation for users.
 */
function reset_password(): void {
	check_ajax_referer( 'wp_ajax' );

	if ( isset( $_POST['user_login'] ) ) {
		ob_start();
		require_once ABSPATH . 'wp-login.php';
		$error = retrieve_password();
		ob_end_clean();

		if ( is_wp_error( $error ) && 'invalid_email' !== $error->get_error_code() ) {
			wp_send_json_error( get_first_error( $error ) );
		}

		wp_send_json_success();
	}

	wp_send_json_error();
}
add_action( 'wp_ajax_nopriv_reset_password', __NAMESPACE__ . '\reset_password' );

/**
 * AJAX Handler responsible for user authentication.
 */
function user_login(): void {
	check_ajax_referer( 'wp_ajax' );

	if ( isset( $_POST['user_login'], $_POST['user_password'], $_POST['remember'] ) ) {
		$remember    = sanitize_text_field( wp_unslash( $_POST['user_password'] ) );
		$credentials = [
			'user_login'    => sanitize_text_field( wp_unslash( $_POST['user_login'] ) ),
			'user_password' => sanitize_text_field( wp_unslash( $_POST['user_password'] ) ),
		];
		if ( 'true' === $remember ) {
			$credentials['remember'] = $remember;
		}

		$error = wp_signon( $credentials );
		if ( is_wp_error( $error ) ) {
			wp_send_json_error( get_first_error( $error ) );
		}

		wp_send_json_success();
	}

	wp_send_json_error();
}
add_action( 'wp_ajax_nopriv_user_login', __NAMESPACE__ . '\user_login' );

/**
 * AJAX Handler responsible for new user registration.
 */
function user_register(): void {
	check_ajax_referer( 'wp_ajax' );

	if ( isset( $_POST['recaptcha_token'], $_POST['user_login'], $_POST['user_email'], $_POST['user_pass'], $_POST['user_first_name'], $_POST['user_last_name'] )
		 && recaptcha_token_is_valid( $_POST['recaptcha_token'] ) ) { // phpcs:ignore

		$userdata = [
			'user_login'           => sanitize_user( wp_unslash( $_POST['user_login'] ), true ),
			'user_email'           => sanitize_email( wp_unslash( $_POST['user_email'] ) ),
			'user_pass'            => sanitize_text_field( wp_unslash( $_POST['user_pass'] ) ),
			'first_name'           => sanitize_text_field( wp_unslash( $_POST['user_first_name'] ) ),
			'last_name'            => sanitize_text_field( wp_unslash( $_POST['user_last_name'] ) ),
			'show_admin_bar_front' => false,
		];

		$user_id = wp_insert_user( $userdata );
		if ( is_wp_error( $user_id ) ) {
			wp_send_json_error( get_first_error( $user_id ) );
		}

		$meta_fields = [
			'city',
			'country',
			'institution',
			'practice_level',
			'region',
			'specialty',
			'title',
		];
		foreach ( $meta_fields as $meta_key ) {
			$meta_value = sanitize_text_field( wp_unslash( $_POST[ 'user_' . $meta_key ] ?? '' ) ); // phpcs:ignore
			update_user_meta( $user_id, $meta_key, $meta_value ); // phpcs:ignore
		}

		wp_send_json_success( $user_id );
	}

	wp_send_json_error();
}
add_action( 'wp_ajax_nopriv_user_register', __NAMESPACE__ . '\user_register' );

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

