<?php
/**
 * REST Controller for Topics
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

/**
 * Main controller class
 */
class Topics_Controller extends \WP_REST_Posts_Controller {
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( ALIEMU_POST_TYPES['topic'] );
		$this->namespace = 'aliemu/v1';
		$this->rest_base = 'topics';
	}

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace, '/' . $this->rest_base, [
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
				'args'   => [
					'id' => [
						'description' => __( 'Unique identifier for the object.' ),
						'type'        => 'integer',
					],
				],
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [
						'context'  => $this->get_context_param( [ 'default' => 'view' ] ),
						'password' => [
							'description' => __( 'The password for the post if it is password protected.' ),
							'type'        => 'string',
						],
					],
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);
	}

	/**
	 * Prepares links for the request.
	 *
	 * @since 4.7.0
	 *
	 * @param WP_Post $topic Topic object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $topic ) : array {
		$links = parent::prepare_links( $topic );
		$links = array_merge( $links, $this->prepare_up_link( $topic->ID ) );
		$links = array_merge( $links, $this->prepare_quiz_links( $topic->ID ) );
		return $links;
	}

	/**
	 * Prepares "up" link for the request, which resolves to the parent quiz.
	 *
	 * @param  int $id The quiz ID.
	 */
	private function prepare_up_link( $id ) : array {
		global $wpdb;

		$result = get_transient( 'aliemu_topic_parent_' . $id );
		if ( ! $result ) {
			$query = $wpdb->prepare(
				"
					SELECT meta_key, meta_value
					FROM $wpdb->postmeta
					WHERE post_id = %d
					AND meta_key IN (
						'course_id',
						'lesson_id'
					)
					AND meta_value != 0
					ORDER BY CASE
								WHEN meta_key = 'lesson_id' THEN 1
								WHEN meta_key = 'course_id' THEN 2
							 END
				",
				$id
			);

			// Ignoring this because we're manually caching the result in a transient.
			// @codingStandardsIgnoreLine
			$result = $wpdb->get_row( $query );

			// put the results in a transient. expire after 24 hours.
			set_transient( 'aliemu_topic_parent_' . $id, $result, DAY_IN_SECONDS );
		}

		if ( $result ) {
			$endpoint  = substr( $result->meta_key, 0, strlen( $result->meta_key ) - 3 ) . 's';
			$parent_id = intval( $result->meta_value );
			return [
				'up' => [
					'href'       => rest_url( $this->namespace . '/' . $endpoint . '/' . $parent_id ),
					'embeddable' => true,
				],
			];

		}

		return [];
	}

	/**
	 * Prepares "quizzes" link for the request.
	 *
	 * @param  int $id The topic ID.
	 */
	private function prepare_quiz_links( int $id ) : array {
		global $wpdb;

		$quiz_ids = get_transient( 'aliemu_topic_quizzes_' . $id );
		if ( ! $quiz_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'topic_id'
						AND meta_value = %d
					)
					AND post_type = %s
				",
				$id,
				ALIEMU_POST_TYPES['quiz']
			);

			// Ignoring this because we're manually caching the result in a transient.
			// @codingStandardsIgnoreLine
			$quiz_ids = $wpdb->get_col( $query );

			// Put the results in a transient. Expire after 24 hours.
			set_transient( 'aliemu_topic_quizzes_' . $id, $quiz_ids, DAY_IN_SECONDS );
		}

		return [
			'quizzes' => [
				'href'       => add_query_arg(
					[
						'include' => count( $quiz_ids ) > 0 ? join( ',', $quiz_ids ) : '-1',
						'order'   => 'asc',
					],
					rest_url( $this->namespace . '/quizzes' )
				),
				'embeddable' => true,
			],
		];
	}

}
