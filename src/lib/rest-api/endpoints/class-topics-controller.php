<?php
/**
 * REST Controller for Topics
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

use WP_Post;

use function ALIEMU\Database\Queries\get_post_quiz_ids;
use function ALIEMU\Utils\get_nearest_parent;

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
			$this->namespace,
			'/' . $this->rest_base,
			[
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
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>[\d]+)',
			[
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
		$links = array_merge( $links, $this->prepare_quiz_links( $topic ) );
		return $links;
	}

	/**
	 * Prepares "up" link for the request, which resolves to the parent quiz.
	 *
	 * @param  int $id The topic ID.
	 */
	private function prepare_up_link( $id ) : array {
		$parent = get_nearest_parent( $id );
		if ( $parent ) {
			$parent_id = intval( $parent->ID );
			$endpoint  = post_type_normalized( $parent->post_type, true );
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
	 * @param WP_Post $topic The topic post object.
	 */
	private function prepare_quiz_links( WP_Post $topic ) : array {
		$quiz_ids = get_post_quiz_ids( $topic );
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
