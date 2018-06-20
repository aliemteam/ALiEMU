<?php
/**
 * REST Controller for Quizzes
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

use function ALIEMU\Database\Queries\get_nearest_parent;
use function ALIEMU\Utils\post_type_normalized;

/**
 * Main controller class
 */
class Quizzes_Controller extends \WP_REST_Posts_Controller {
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct( ALIEMU_POST_TYPES['quiz'] );
		$this->namespace = 'aliemu/v1';
		$this->rest_base = 'quizzes';
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
	 * @param WP_Post $quiz Quiz object.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $quiz ) : array {
		$links = parent::prepare_links( $quiz );
		$links = array_merge( $links, $this->prepare_up_link( $quiz->ID ) );
		return $links;
	}

	/**
	 * Prepares "up" link for the request, which resolves to the parent quiz.
	 *
	 * @param  int $id The quiz ID.
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

}
