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
		'profile_user'    => DB\get_user( $profile_id ),
		'current_user'    => DB\get_me(),
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

use function ALIEMU\Utils\check_rest_response;

/**
 * Performs a GET request to /wp/v2/users/$id and returns response
 *
 * @param int $id User id of user to retrieve.
 */
function get_user( int $id ) {
	global $wp_rest_server;

	$req = new \WP_Rest_Request( 'GET', '/wp/v2/users/' . intval( $id ) );
	$res = rest_do_request( $req );

	check_rest_response( $res, true );

	return $wp_rest_server->response_to_data( $res, true );
}

/**
 * Performs a GET request to /wp/v2/users/me and returns response
 */
function get_me() {
	global $wp_rest_server;

	$req = new \WP_Rest_Request( 'GET', '/wp/v2/users/me' );
	$req->set_param( 'context', 'edit' );
	$res = rest_do_request( $req );

	$err = check_rest_response( $res );
	if ( $err ) {
		return null;
	}

	return $wp_rest_server->response_to_data( $res, true );
}

