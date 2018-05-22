<?php
/**
 * REST Controller for Courses
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

/**
 * Main controller class
 */
class Courses_Controller extends \WP_REST_Posts_Controller {
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( ALIEMU_POST_TYPES['course'] );
		$this->namespace = 'aliemu/v1';
		$this->rest_base = 'courses';
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

		$fields = [
			'Courses\Description_Field' => ALIEMU_ROOT_PATH . '/lib/rest-api/fields/course/class-description-field.php',
			'Courses\Hours_Field'       => ALIEMU_ROOT_PATH . '/lib/rest-api/fields/course/class-hours-field.php',
		];

		foreach ( $fields as $classname => $path ) {
			require_once $path;
			$class = __NAMESPACE__ . '\\' . $classname;
			$field = new $class();
			$field->register();
		}
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param WP_Post $course Course object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $course ) : array {
		global $wpdb;

		$links = parent::prepare_links( $course );
		$links = array_merge( $links, $this->prepare_lesson_links( $course->ID ) );
		$links = array_merge( $links, $this->prepare_topic_links( $course->ID ) );
		$links = array_merge( $links, $this->prepare_quiz_links( $course->ID ) );
		$links = array_merge( $links, $this->prepare_certificate_links( $course->ID ) );

		return $links;
	}

	/**
	 * Prepares "lessons" link for the request.
	 *
	 * @param  int $id The course ID.
	 */
	private function prepare_lesson_links( int $id ) : array {
		global $wpdb;

		$lesson_ids = get_transient( 'aliemu_course_lessons_' . $id );
		if ( ! $lesson_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'course_id'
						AND meta_value = %d
					)
					AND post_type = %s
				",
				$id,
				ALIEMU_POST_TYPES['lesson']
			);

			// Ignoring this because we're manually caching the result in a transient.
			// @codingStandardsIgnoreLine
			$lesson_ids = $wpdb->get_col( $query );

			// Put the results in a transient. Expire after 24 hours.
			set_transient( 'aliemu_course_lessons_' . $id, $lesson_ids, DAY_IN_SECONDS );
		}

		return [
			'lessons' => [
				'href'       => add_query_arg(
					[
						'include' => count( $lesson_ids ) > 0 ? join( ',', $lesson_ids ) : '-1',
						'order'   => 'asc',
					],
					rest_url( $this->namespace . '/lessons' )
				),
				'embeddable' => true,
			],
		];
	}

	/**
	 * Prepares "topics" link for the request.
	 *
	 * @param  int $id The course ID.
	 */
	private function prepare_topic_links( int $id ) : array {
		global $wpdb;

		$topic_ids = get_transient( 'aliemu_course_topics_' . $id );
		if ( ! $topic_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'course_id'
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
			set_transient( 'aliemu_course_topics_' . $id, $topic_ids, DAY_IN_SECONDS );
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
	 * @param  int $id The course ID.
	 */
	private function prepare_quiz_links( int $id ) : array {
		global $wpdb;

		$quiz_ids = get_transient( 'aliemu_course_quizzes_' . $id );
		if ( ! $quiz_ids ) {
			$query = $wpdb->prepare(
				"
					SELECT ID
					FROM $wpdb->posts
					WHERE ID IN (
						SELECT post_id
						FROM $wpdb->postmeta
						WHERE meta_key = 'course_id'
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
			set_transient( 'aliemu_course_quizzes_' . $id, $quiz_ids, DAY_IN_SECONDS );
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

	/**
	 * Prepares "certificate" link for the request.
	 *
	 * If the requesting user does not have a certificate for the course, this
	 * returns an empty array.
	 *
	 * @param  int $id The course ID.
	 */
	private function prepare_certificate_links( int $id ) : array {
		$certificate_url = learndash_get_course_certificate_link( $id, get_current_user_id() );
		return [
			'certificate' => [
				'href' => $certificate_url,
			],
		];
	}
}
