<?php
/**
 * Localizer for dashboard page
 *
 * @package ALiEMU
 */

namespace ALIEMU;

use ALIEMU\Localizers\Dashboard as DB;

defined( 'ABSPATH' ) || exit;

/**
 * Main localizer for dashboard entrypoint.
 */
function localize() {
	$profile_id = um_profile_id();

	return [
		'user'            => DB\get_user( $profile_id ),
		'recent_comments' => get_comments(
			[
				'author__in' => [ $profile_id ],
				'status'     => 'approve',
				'fields'     => 'ids',
				'number'     => 25,
			]
		),
	];
}

namespace ALIEMU\Localizers\Dashboard;

/**
 * Performs a GET request to /wp/v2/users/$id and returns response
 *
 * @param int $id User id of user to retrieve.
 */
function get_user( int $id ) {
	global $wp_rest_server;

	$req = new \WP_Rest_Request( 'GET', '/wp/v2/users/' . intval( $id ) );
	if ( get_current_user_id() === $id ) {
		$req->set_param( 'context', 'edit' );
	}
	$res = rest_do_request( $req );

	if ( $res->is_error() ) {
		wp_die(
			printf( '<p>An unanticipated error occurred: %s</p>', $res->as_error()->get_error_message() ) // phpcs:ignore
		);
	}

	return $wp_rest_server->response_to_data( $res, true );
}

