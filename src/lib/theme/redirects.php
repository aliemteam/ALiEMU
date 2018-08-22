<?php
/**
 * Responsible for all redirects used throughout the site.
 *
 * @package ALiEMU
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'template_redirect', function () {
		$user_is_logged_in = is_user_logged_in();

		if ( is_page( 'login' ) && $user_is_logged_in ) {
			wp_safe_redirect( '/user' );
			exit;
		}

		if ( is_front_page() && $user_is_logged_in ) {
			wp_safe_redirect( '/user' );
			exit;
		}

	}
);
