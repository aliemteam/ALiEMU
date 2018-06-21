<?php
/**
 * REST Controller for User groups
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

use function ALIEMU\Database\Queries\{
	add_coach_for_user,
	add_learner_tag_for_user,
	get_learner_tags,
	get_user_coaches,
	get_user_learners,
	remove_coach_for_user,
	remove_learner_tag_for_user,
	current_user_has_access,
};

use WP_Error;
use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Request;
use WP_REST_Server;
use WP_REST_Users_Controller;

/**
 * Main controller class
 */
class User_Groups_Controller extends WP_REST_Controller {

	/**
	 * The base of the parent controller's route.
	 *
	 * @var string
	 */
	private $parent_base;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->namespace   = 'wp/v2';
		$this->rest_base   = 'groups';
		$this->parent_base = 'users';
	}

	/**
	 * Register the routes for the objects of the controller.
	 */
	public function register_routes() {
		$this->register_shared_rest_routes(
			[
				'/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base . '/coaches',
				'/' . $this->parent_base . '/me/' . $this->rest_base . '/coaches',
			],
			[
				'args'   => [
					'parent' => [
						'description' => 'The user ID of the user of interest.',
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_coaches' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'add_coach' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => [
						'email' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The email address of the coach to be added.',
						],
					],
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);

		$this->register_shared_rest_routes(
			[
				'/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base . '/coaches/(?P<id>[\d]+)',
				'/' . $this->parent_base . '/me/' . $this->rest_base . '/coaches/(?P<id>[\d]+)',
			],
			[
				'args' => [
					'parent' => [
						'description' => 'The user ID of the user of interest.',
						'type'        => 'integer',
						'required'    => true,
					],
					'id'     => [
						'description' => 'The user ID of the coach to be deleted.',
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'remove_coach' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				],
			]
		);

		$this->register_shared_rest_routes(
			[
				'/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base . '/learners',
				'/' . $this->parent_base . '/me/' . $this->rest_base . '/learners',
			],
			[
				'args'   => [
					'parent' => [
						'description' => 'The user ID of the user of interest.',
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_learners' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);

		$this->register_shared_rest_routes(
			[
				'/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base . '/learners/(?P<id>[\d]+)',
				'/' . $this->parent_base . '/me/' . $this->rest_base . '/learners/(?P<id>[\d]+)',
			],
			[
				'args' => [
					'parent' => [
						'description' => 'The user ID of the user of interest.',
						'type'        => 'integer',
						'required'    => true,
					],
					'id'     => [
						'description' => 'The user ID of the learner to be deleted.',
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'remove_learner' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				],
			]
		);

		$this->register_shared_rest_routes(
			[
				'/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base . '/learners/(?P<id>[\d]+)/tags',
				'/' . $this->parent_base . '/me/' . $this->rest_base . '/learners/(?P<id>[\d]+)/tags',
			],
			[
				'args'   => [
					'parent' => [
						'description' => 'The user ID of the user of interest.',
						'type'        => 'integer',
						'required'    => true,
					],
					'id'     => [
						'description' => 'The learner\'s user ID.',
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_learner_tags' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'add_learner_tag' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => [
						'tag' => [
							'type'              => 'string',
							'required'          => true,
							'description'       => 'The tag to be added to the learner.',
							'validate_callback' => function ( $param, $request, $key ) {
								$len = strlen( $param );
								return is_string( $param ) && 0 < $len && $len < 51;
							},
						],
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'remove_learner_tag' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => [
						'tag' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The tag to be deleted from the learner.',
						],
					],
				],
				'schema' => function() {
					return [
						'$schema' => 'http://json-schema.org/draft-04/schema#',
						'title'   => 'learner-tags',
						'type'    => 'array',
						'items'   => [
							'type' => 'string',
						],
					];
				},
			]
		);

	}

	/**
	 * PERMISSIONS CHECKS =====================================================
	 */

	/**
	 * Checks if a given request has access to get groups of a given user.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_has_access( $parent_user->ID ) ) {
			return new WP_Error(
				'rest_cannot_read',
				'Sorry, you are not allowed to view groups for this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Checks if a given request has permission to update a user's groups.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_has_access( $parent_user->ID ) ) {
			return new WP_Error(
				'rest_cannot_edit',
				'Sorry, you are not allowed to edit this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Checks if a given request has access to delete a user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_has_access( $parent_user->ID ) ) {
			return new WP_Error(
				'rest_user_cannot_delete',
				'Sorry, you are not allowed to delete resources for this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * REQUEST HANDLERS =======================================================
	 */

	/**
	 * Get a given user's coaches.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_coaches( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$groups      = new Groups( $parent_user->ID );
		$sub_request = new WP_Rest_Request( 'GET', '/wp/v2/users' );
		$sub_request->set_query_params(
			array_merge(
				$request->get_query_params(),
				[
					'include' => $groups->coaches,
				]
			)
		);
		$response = rest_do_request( $sub_request );

		return rest_ensure_response( $response );
	}

	/**
	 * Get a given user's learners.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_learners( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$groups      = new Groups( $parent_user->ID );
		$sub_request = new WP_Rest_Request( 'GET', '/wp/v2/users' );
		$sub_request->set_query_params(
			array_merge(
				$request->get_query_params(),
				[
					'include' => $groups->learners,
				]
			)
		);
		$response = rest_do_request( $sub_request );

		return rest_ensure_response( $response );
	}

	/**
	 * Gets a given user's tags for a given learner.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_learner_tags( $request ) {
		$parent_user = $this->get_parent_user( $request );
		$learner_id  = (int) $request['id'];

		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		return rest_ensure_response( get_learner_tags( $parent_user->ID, $learner_id ) );
	}

	/**
	 * Adds a user as a coach for a given user.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function add_coach( $request ) {
		$parent_user = $this->get_parent_user( $request );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$coach_id = email_exists( $request['email'] );
		if ( ! $coach_id ) {
			return new WP_Error(
				'rest_user_invalid_email',
				'Invalid email address.',
				[ 'status' => 400 ]
			);
		}

		if ( $coach_id === $parent_user->ID ) {
			return new WP_Error(
				'rest_user_invalid_email',
				'Adding yourself as a coach is not allowed.',
				[ 'status' => 403 ]
			);
		}

		$error = add_coach_for_user( $parent_user->ID, $coach_id );
		if ( is_wp_error( $error ) ) {
			return $error;
		}

		$sub_request = new WP_Rest_Request( 'GET', '/wp/v2/users/' . $coach_id );
		$response    = rest_do_request( $sub_request );

		$response->remove_link( 'collection' );
		$response->add_link(
			'collection',
			rest_url(
				sprintf(
					'%s/%s/%d/%s/coaches',
					$this->namespace,
					$this->parent_base,
					$parent_user->ID,
					$this->rest_base
				)
			),
			[
				'embeddable' => true,
			]
		);

		$response->set_status( 201 );
		$response->header(
			'Location', rest_url(
				sprintf(
					'%s/%s/%d',
					$this->namespace,
					$this->parent_base,
					$coach_id
				)
			)
		);

		return $response;
	}

	/**
	 * Creates a new learner tag for a given learner.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function add_learner_tag( $request ) {
		$parent_user = $this->get_parent_user( $request );
		$learner_id  = (int) $request['id'];
		$tag         = $request['tag'];

		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$result = add_learner_tag_for_user( $parent_user->ID, $learner_id, $tag );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$response = rest_ensure_response( $result );

		$response->set_status( 201 );
		$response->header(
			'Location', rest_url(
				sprintf(
					'%s/%s/%d/%s/learners/%d/tags',
					$this->namespace,
					$this->parent_base,
					$parent_user->ID,
					$this->rest_base,
					$learner_id
				)
			)
		);

		return $response;
	}

	/**
	 * Removes a coach from a given user.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function remove_coach( $request ) {
		$parent_user = $this->get_parent_user( $request );
		$coach_id    = (int) $request['id'];

		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$error = remove_coach_for_user( $parent_user->ID, $coach_id );
		if ( is_wp_error( $error ) ) {
			return $error;
		}

		return new WP_Rest_Response( null, 204 );
	}

	/**
	 * Removes a learner from a given user.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function remove_learner( $request ) {
		$parent_user = $this->get_parent_user( $request );
		$learner_id  = (int) $request['id'];

		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$error = remove_coach_for_user( $learner_id, $parent_user->ID );
		if ( is_wp_error( $error ) ) {
			return $error;
		}

		return new WP_Rest_Response( null, 204 );
	}

	/**
	 * Deletes a single tag from a learner for a given user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function remove_learner_tag( $request ) {
		$parent_user = $this->get_parent_user( $request );
		$learner_id  = (int) $request['id'];
		$tag         = $request['tag'];

		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$result = remove_learner_tag_for_user( $parent_user->ID, $learner_id, $tag );
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return new WP_REST_Response( $result );
	}

	/**
	 * PUBLIC HELPER METHODS ==================================================
	 */

	/**
	 * Retrieves the query params for collections.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() : array {
		$query_params                       = parent::get_collection_params();
		$query_params['context']['default'] = 'view';
		unset( $query_params['search'] );
		return $query_params;
	}

	/**
	 * Retrieves the group schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_public_item_schema(): array {
		$users_controller = new WP_REST_Users_Controller();
		$schema           = $users_controller->get_public_item_schema();
		return $schema;
	}

	/**
	 * PRIVATE HELPER METHODS =================================================
	 */

	/**
	 * Get the parent user, if the ID is valid.
	 *
	 * @param WP_Rest_Request $request The current request.
	 * @return WP_User|WP_Error User if parent exists, WP_Error otherwise.
	 */
	private function get_parent_user( WP_Rest_Request $request ) {
		if ( array_key_exists( 'parent', $request ) ) {
			$parent_user = get_user_by( 'id', $request['parent'] );
			if ( ! $parent_user ) {
				return new WP_Error(
					'rest_user_invalid_parent',
					'Invalid parent user ID.',
					[ 'status' => 404 ]
				);
			}
		} else {
			$parent_user = wp_get_current_user();
			if ( ! $parent_user->exists() ) {
				return new WP_Error(
					'rest_not_logged_in',
					'You are not currently logged in.',
					[ 'status' => 401 ]
				);
			}
		}
		return $parent_user;
	}

	/**
	 * Small helper that allows multiple routes to be registered using shared
	 * handlers.
	 *
	 * @param string[] $routes Array of routes to be registered.
	 * @param mixed[]  $args   Endpoint handlers.
	 */
	private function register_shared_rest_routes( array $routes, array $args ) : bool {
		$success = true;
		foreach ( $routes as $route ) {
			$this_args = $args;
			if ( array_key_exists( 'args', $this_args ) ) {
				preg_match_all( '/<(\w+)>/', $route, $route_args );
				foreach ( $this_args['args'] as $key => $val ) {
					if ( ! in_array( $key, $route_args[1], true ) ) {
						unset( $this_args['args'][ $key ] );
					}
				}
			}
			$success &= register_rest_route(
				$this->namespace,
				$route,
				$this_args
			);
		}
		return $success;
	}
}

/**
 * "Groups" object for REST response.
 */
class Groups { // phpcs:ignore
	/**
	 * Array of user IDs of the given user's coaches.
	 *
	 * @var int[]
	 */
	private $coaches;

	/**
	 * Array of user IDs in which the given user is coaching.
	 *
	 * @var int[]
	 */
	private $learners;

	/**
	 * Constructor.
	 *
	 * @param int $user_id The user id for which groups are to be assembled.
	 */
	public function __construct( int $user_id ) {
		$this->coaches  = get_user_coaches( $user_id );
		$this->learners = get_user_learners( $user_id );
	}

	/**
	 * Getter overload used to return an array containing just the number 0 in
	 * cases where coaches or learners is empty. This is necessary because it
	 * causes the users endpoint to return an empty set of users.
	 *
	 * @param string $property One of 'coaches' or 'learners'.
	 *
	 * @throws \Exception If property is not defined.
	 */
	public function __get( string $property ) : array {
		switch ( $property ) {
			case 'coaches':
				return count( $this->coaches ) === 0 ? [ 0 ] : $this->coaches;
			case 'learners':
				return count( $this->learners ) === 0 ? [ 0 ] : $this->learners;
			default:
				throw new \Exception( "Invalid property $property" );
		}
	}
}

