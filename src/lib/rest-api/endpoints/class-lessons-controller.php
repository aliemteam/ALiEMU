<?php
/**
 * REST Controller for Lessons
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

/**
 * Main controller class
 */
class Lessons_Controller extends \WP_REST_Posts_Controller {
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( ALIEMU_POST_TYPES['lesson'] );
		$this->namespace = 'aliemu/v1';
		$this->rest_base = 'lessons';
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
	 * @param WP_Post $lesson Lesson object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $lesson ) : array {
		$links = parent::prepare_links( $lesson );
		$links = array_merge( $links, $this->prepare_up_link( $lesson->ID ) );
		$links = array_merge( $links, $this->prepare_topic_links( $lesson->ID ) );
		$links = array_merge( $links, $this->prepare_quiz_links( $lesson->ID ) );
		return $links;
	}

	/**
	 * Prepares "up" link for the request, which resolves to the parent course.
	 *
	 * @param  int $id The lesson ID.
	 */
	private function prepare_up_link( $id ) : array {
		$course_id = intval( get_post_meta( $id, 'course_id', true ) );
		return $course_id
			? [
				'up' => [
					'href'       => rest_url( $this->namespace . '/courses/' . $course_id ),
					'embeddable' => true,
				],
			]
			: [];
	}

	/**
	 * Prepares "topics" link for the request.
	 *
	 * @param  int $id The lesson ID.
	 */
	private function prepare_topic_links( int $id ) : array {
		global $wpdb;

		$topic_ids = get_transient( 'aliemu_lesson_topics_' . $id );
		if ( ! $topic_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'lesson_id'
						AND meta_value = %d
					)
					AND post_type = %s
				",
				$id,
				ALIEMU_POST_TYPES['topic']
			);

			// Ignoring this because we're manually caching the result in a transient.
			// @codingStandardsIgnoreLine
			$topic_ids = $wpdb->get_col( $query );

			// Put the results in a transient. Expire after 24 hours.
			set_transient( 'aliemu_lesson_topics_' . $id, $topic_ids, DAY_IN_SECONDS );
		}

		return [
			'topics' => [
				'href'       => add_query_arg(
					[
						'include' => count( $topic_ids ) > 0 ? join( ',', $topic_ids ) : '-1',
						'order'   => 'asc',
					],
					rest_url( $this->namespace . '/topics' )
				),
				'embeddable' => true,
			],
		];
	}


	/**
	 * Prepares "quizzes" link for the request.
	 *
	 * @param  int $id The lesson ID.
	 */
	private function prepare_quiz_links( int $id ) : array {
		global $wpdb;

		$quiz_ids = get_transient( 'aliemu_lesson_quizzes_' . $id );
		if ( ! $quiz_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'lesson_id'
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
			set_transient( 'aliemu_lesson_quizzes_' . $id, $quiz_ids, DAY_IN_SECONDS );
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
