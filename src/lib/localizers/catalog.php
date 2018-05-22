<?php
/**
 * Localizer for Catalog
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

use function ALIEMU\Utils\check_rest_response;

/**
 * Main localizer function for catalog entrypoint.
 */
function localize() {
	global $wp_rest_server;

	$courses_req = new \WP_Rest_Request( 'GET', '/aliemu/v1/courses' );
	$courses_req->set_param(
		'_fields', join(
			',', [
				'_links',
				'categories',
				'course_short_description',
				'date_gmt',
				'featured_media',
				'id',
				'link',
				'recommendedHours',
				'title',
			]
		)
	);
	$response = rest_do_request( $courses_req );

	check_rest_response( $response, true );

	$headers = $response->get_headers();
	$data    = $wp_rest_server->response_to_data( $response, true );

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
		'nonce'      => wp_create_nonce( 'wp_rest' ),
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
