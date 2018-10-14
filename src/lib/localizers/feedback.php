<?php
/**
 * Localizer for feedback page.
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Main localizer for feedback page.
 */
function localize() {
	$user = wp_get_current_user();
	return [
		'user' => $user->ID > 0 ? [
			'name'  => $user->data->display_name,
			'email' => $user->data->user_email,
		] : null,
	];
}
