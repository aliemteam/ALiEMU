<?php
/**
 * Localizer for Catalog
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Main localizer function for catalog entrypoint.
 */
function localize() {

	$courses_req = new \WP_Rest_Request( 'GET', '/ldlms/v1/courses' );
	$response    = rest_do_request( $courses_req );

	if ( $response->is_error() ) {
		$error      = $response->as_error();
		$msg        = $response->get_error_message();
		$error_data = $response->get_error_data();
		$status     = isset( $error_data['status'] ) ? $error_data['status'] : 500;
		wp_die( printf( '<p>An error occurred: %s (%d)</p>', $message, $error_data ) ); // @codingStandardsIgnoreLine
	}

	$data    = $response->get_data();
	$headers = $response->get_headers();

	$visible_course_ids = get_transient( 'aliemu_catalog_categories' );
	if ( ! $visible_course_ids ) {

		$query = new \WP_Query(
			[
				'post_type'   => 'sfwd-courses',
				'post_status' => 'publish',
				'fields'      => 'ids',
				'nopaging'    => true, // @codingStandardsIgnoreLine
			]
		);

		$visible_course_ids = $query->posts;

		// Put the results in a transient. Expire after 24 hours.
		set_transient( 'aliemu_catalog_categories', $visible_course_ids, DAY_IN_SECONDS );
	}

	return [
		'headers'    => [
			'courses' => $headers,
		],
		'courses'    => $data,
		'categories' => get_categories(
			[
				'fields'     => 'id=>name',
				'object_ids' => $visible_course_ids,
			]
		),
	];
}
