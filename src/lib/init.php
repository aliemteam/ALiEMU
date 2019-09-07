<?php
/**
 * Misc functionality to handle actions early in the init process.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Init;

defined( 'ABSPATH' ) || exit;

use WP_Rest_Request;
use function ALIEMU\Database\Queries\get_user_learners;
use function ALIEMU\Utils\fetch_all_api_items;

add_action(
	'init',
	function() {
		if (
			isset( $_GET['action'], $_GET['nonce'] ) &&
			wp_verify_nonce( sanitize_key( $_GET['nonce'] ), 'aliemu' )
		) {
			switch ( sanitize_key( $_GET['action'] ) ) {
				case 'export_learner_data':
					return export_learner_data();
			}
		}
	}
);

/**
 * Generates and responds with a CSV file containing the current user's learner data.
 */
function export_learner_data() {
	if (
		! is_user_logged_in() ||
		! is_null( filter_input( INPUT_SERVER, 'HTTP_CACHE_CONTROL' ) ) // page was refreshed.
	) {
		return;
	}

	global $wp_rest_server;

	$response = fetch_all_api_items( new WP_Rest_Request( 'GET', '/wp/v2/users/me/groups/learners' ) );
	if ( $response->is_error() ) {
		status_header( 500 );
		die;
	}

	$args = filter_input_array(
		INPUT_GET,
		[
			'start_date' => FILTER_SANITIZE_STRING,
			'end_date'   => FILTER_SANITIZE_STRING,
		]
	);

	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="aliemu_learners_' . substr( gmdate( 'c' ), 0, -6 ) . '.csv"' );

	$output = fopen( 'php://output', 'w' );

	fputcsv(
		$output,
		[
			'Last Name',
			'First Name',
			'Tags',
			'Course Name',
			'Date of Completion',
			'Hours Awarded',
		]
	);

	foreach ( $wp_rest_server->response_to_data( $response, true ) as $learner ) {
		$last_name  = $learner['last_name'];
		$first_name = $learner['first_name'];
		$tags       = $learner['learner_tags'];

		$completed = array_filter(
			$learner['course_progress'],
			function( $meta ) use ( $args ) {
				if ( $meta['status'] !== 'COMPLETED' ) {
					return false;
				}
				if ( $args['start_date'] && date_create( $args['start_date'] ) > date_create( $meta['activity_completed'] ) ) {
					return false;
				}
				if ( $args['end_date'] && date_create( $args['end_date'] ) < date_create( $meta['activity_completed'] ) ) {
					return false;
				}
				return true;
			}
		);

		foreach ( $completed as $meta ) {
			$course = get_post( $meta['id'] );
			fputcsv(
				$output,
				[
					$last_name,
					$first_name,
					join( ', ', $tags ),
					$course->post_title,
					gmdate(
						'Y-m-d H:i:s',
						strtotime( $meta['activity_completed'] )
					),
					$meta['hours_awarded'],
				]
			);
		}
	}

	die;
}
