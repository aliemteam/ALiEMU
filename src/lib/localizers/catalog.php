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

	if ( $response->is_error() ) {
		wp_die(
			printf( '<p>An unanticipated error occurred: %s</p>', $response->as_error()->get_error_message() ) // phpcs:ignore
		);
	}

	$headers = $response->get_headers();
	$data    = $wp_rest_server->response_to_data( $response, true );

	$categories = wp_cache_get( 'aliemu_catalog_categories' );
	if ( ! $categories ) {
		$query = new \WP_Query(
			[
				'post_type'   => 'sfwd-courses',
				'post_status' => 'publish',
				'fields'      => 'ids',
				'nopaging'    => true, // @codingStandardsIgnoreLine
			]
		);

		$visible_course_ids = $query->posts;

		$categories = get_categories(
			[
				'fields'     => 'id=>name',
				'object_ids' => $visible_course_ids,
			]
		);
		wp_cache_set( 'aliemu_catalog_categories', $categories, '', DAY_IN_SECONDS );
	}

	return [
		'headers'    => [
			'courses' => $headers,
		],
		'courses'    => $data,
		'categories' => $categories,
	];
}
