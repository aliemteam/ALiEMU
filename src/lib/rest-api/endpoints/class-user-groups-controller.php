<?php
/**
 * REST Controller for User groups
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

use WP_Error;
use WP_REST_Controller;
use WP_REST_Response;
use WP_REST_Server;

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
		register_rest_route(
			$this->namespace, '/' . $this->parent_base . '/(?P<parent>[\d]+)/' . $this->rest_base, [
				'args' => [
					'parent' => [
						'description' => 'The ID for the parent of the object.',
						'type'        => 'integer',
					],
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => [
						'email' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The email address of the coach to be added.',
						],
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => [
						'kind'  => [
							'type'              => 'string',
							'required'          => true,
							'description'       => 'The kind of member being deleted. (one of: coach, learner)',
							'validate_callback' => function ( $param, $request, $key ) {
								return in_array( $param, [ 'coach', 'learner' ], true );
							},
						],
						'email' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The email address of the coach to be deleted.',
						],
					],
				],
			]
		);

		register_rest_route(
			$this->namespace, '/' . $this->parent_base . '/me/' . $this->rest_base, [
				[
					'methods'  => WP_REST_Server::READABLE,
					'callback' => [ $this, 'get_current_item' ],
					'args'     => $this->get_collection_params(),
				],
				[
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_current_item' ],
					'permission_callback' => [ $this, 'update_current_item_permissions_check' ],
					'args'                => [
						'email' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The email address of the coach to be added.',
						],
					],
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_current_item' ],
					'permission_callback' => [ $this, 'delete_current_item_permissions_check' ],
					'args'                => [
						'kind'  => [
							'type'              => 'string',
							'required'          => true,
							'description'       => 'The kind of member being deleted. (one of: coach, learner)',
							'validate_callback' => function ( $param, $request, $key ) {
								return in_array( $param, [ 'coach', 'learner' ], true );
							},
						],
						'email' => [
							'type'        => 'string',
							'required'    => true,
							'description' => 'The email address of the coach to be deleted.',
						],
					],
				],
			]
		);
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * @since 4.7.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() : array {
		$query_params = parent::get_collection_params();

		$query_params['context']['default'] = 'view';

		unset( $query_params['search'] );

		return $query_params;
	}

	/**
	 * Retrieves the group schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema(): array {
		return [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'user-groups',
			'type'       => 'object',
			'properties' => [
				'coaches'  => [
					'description' => 'An array of user IDs of all of the given user\'s coaches',
					'type'        => 'array',
					'items'       => [
						'type' => 'integer',
					],
					'context'     => [ 'view', 'edit' ],
				],
				'learners' => [
					'description' => 'An array of user IDs for all users that the given user is coaching.',
					'type'        => 'array',
					'items'       => [
						'type' => 'integer',
					],
					'context'     => [ 'view', 'edit' ],
				],
			],
		];
	}

	/**
	 * Gets a given user's groups.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$parent_user = $this->get_parent_user( (int) $request['parent'] );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$groups = new Groups( $parent_user->ID );

		$page        = $request['page'] ?? 1;
		$per_page    = $request['per_page'] ?? 10;
		$start_index = ( $page - 1 ) * $per_page;

		$total       = max( count( $groups->coaches ), count( $groups->learners ) );
		$total_pages = ceil( $total / $per_page );

		$groups->coaches  = array_slice( $groups->coaches, $start_index, $per_page );
		$groups->learners = array_slice( $groups->learners, $start_index, $per_page );

		$response = $this->prepare_item_for_response( $groups, $request );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $total_pages );

		if ( $page < $total_pages ) {
			$response->add_link(
				'next', add_query_arg(
					[
						'page'     => $page + 1,
						'per_page' => $per_page,
						'_embed'   => '',
					],
					// Ignoring below since this is the best way to ensure
					// proxied requests receive the correct hostname/port.
					// @codingStandardsIgnoreLine
					parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH )
				)
			);
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Checks if a given request has access to get groups of a given user.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( (int) $request['parent'] );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_can( 'edit_users', $parent_user->ID ) ) {
			return new WP_Error(
				'rest_cannot_read',
				'Sorry, you are not allowed to view groups for this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Retrieves the current user's groups.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_current_item( $request ) {
		$user_id = get_current_user_id();

		if ( ! $user_id ) {
			return new WP_Error(
				'rest_not_logged_in',
				'You are not currently logged in.',
				[ 'status' => 401 ]
			);
		}

		$request['parent'] = $user_id;

		return $this->get_items( $request );
	}

	/**
	 * Adds a coach for a single user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		global $wp_rest_server;

		$parent_user = $this->get_parent_user( (int) $request['parent'] );
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
				[ 'status' => 400 ]
			);
		}

		if ( ! $this->add_coach( $parent_user->ID, $coach_id ) ) {
			return new WP_Error(
				'rest_user_update',
				'Error updating user groups',
				[ 'status' => 500 ]
			);
		}

		$groups = new Groups( $parent_user->ID );

		$request->set_param( 'context', 'edit' );

		$response = $this->prepare_item_for_response( $groups, $request );
		$response = $wp_rest_server->response_to_data( $response, true );

		$response = rest_ensure_response( $response );

		$response->set_status( 201 );
		$response->header(
			'Location', rest_url(
				sprintf(
					'%s/%s/%d/%s',
					$this->namespace,
					$this->parent_base,
					$parent_user->ID,
					$this->rest_base
				)
			)
		);

		return $response;
	}

	/**
	 * Checks if a given request has permission to update a user's groups.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_item_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( (int) $request['parent'] );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_can( 'edit_user', $parent_user->ID ) ) {
			return new WP_Error(
				'rest_cannot_edit',
				'Sorry, you are not allowed to edit this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Adds a coach for the current user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_current_item( $request ) {
		$request['parent'] = get_current_user_id();

		return $this->update_item( $request );
	}

	/**
	 * Checks if a given request has access to update the current user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to update the item, WP_Error object otherwise.
	 */
	public function update_current_item_permissions_check( $request ) {
		$request['parent'] = get_current_user_id();

		return $this->update_item_permissions_check( $request );
	}

	/**
	 * Deletes a single member from a group.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$parent_user = $this->get_parent_user( (int) $request['parent'] );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		$member_id = email_exists( $request['email'] );
		if ( ! $member_id ) {
			return new WP_Error(
				'rest_user_invalid_email',
				'Invalid email address.',
				[ 'status' => 400 ]
			);
		}

		$groups = new Groups( $parent_user->ID );

		$request->set_param( 'context', 'edit' );

		$previous = $this->prepare_item_for_response( $groups, $request );

		switch ( $request['kind'] ) {
			case 'coach':
				$result = $this->delete_member( $parent_user->ID, $member_id );
				break;
			case 'learner':
				$result = $this->delete_member( $member_id, $parent_user->ID );
				break;
			default:
				return new WP_Error(
					'rest_user_group_invalid_kind',
					'Invalid member kind (must be "coach" or "learner").',
					[ 'status' => 400 ]
				);
		}

		if ( ! $result ) {
			return new WP_Error(
				'rest_cannot_delete',
				'The group member cannot be deleted.',
				[ 'status' => 500 ]
			);
		}

		$response = new WP_REST_Response();
		$response->set_data(
			[
				'deleted'  => true,
				'previous' => $previous->get_data(),
			]
		);

		return $response;
	}

	/**
	 * Checks if a given request has access to delete a user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		$parent_user = $this->get_parent_user( (int) $request['parent'] );
		if ( is_wp_error( $parent_user ) ) {
			return $parent_user;
		}

		if ( ! current_user_can( 'edit_users', $parent_user->ID ) && get_current_user_id() !== $parent_user->ID ) {
			return new WP_Error(
				'rest_user_cannot_delete',
				'Sorry, you are not allowed to delete this user.',
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Deletes a single member from the current user's groups.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_current_item( $request ) {
		$request['parent'] = get_current_user_id();

		return $this->delete_item( $request );
	}

	/**
	 * Checks if a given request has access to delete a group member from the current user.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object otherwise.
	 */
	public function delete_current_item_permissions_check( $request ) {
		$request['parent'] = get_current_user_id();

		return $this->delete_item_permissions_check( $request );
	}

	/**
	 * Prepares the groups item for the REST response.
	 *
	 * @param Groups          $groups Groups object for the given user.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $groups, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$data   = [];

		if ( in_array( 'coaches', $fields, true ) ) {
			$data['coaches'] = $groups->coaches;
		}

		if ( in_array( 'learners', $fields, true ) ) {
			$data['learners'] = $groups->learners;
		}

		$context = $request['context'] ?? 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		$response = rest_ensure_response( $data );

		$response->add_links( $this->prepare_links( $groups ) );

		return $response;
	}

	/**
	 * Get the parent user, if the ID is valid.
	 *
	 * @param int $id Supplied ID.
	 * @return WP_User|WP_Error True if ID is valid, WP_Error otherwise.
	 */
	protected function get_parent_user( int $id ) {
		$parent_user = get_user_by( 'id', $id );
		if ( ! $parent_user ) {
			return new WP_Error(
				'rest_user_invalid_parent',
				'Invalid parent user ID.',
				[ 'status' => 404 ]
			);
		}
		return $parent_user;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param  Groups $groups Groups object for a given user.
	 * @return array Links for the given post.
	 */
	protected function prepare_links( Groups $groups ) : array {
		$users_endpoint = rest_url( $this->namespace . '/' . $this->parent_base );
		$links          = [
			'coaches'  => [
				'href'       => add_query_arg(
					[
						'include' => join( ',', $groups->coaches ) ?: '0',
					],
					$users_endpoint
				),
				'embeddable' => true,
			],
			'learners' => [
				'href'       => add_query_arg(
					[
						'include' => join( ',', $groups->learners ) ?: '0',
					],
					$users_endpoint
				),
				'embeddable' => true,
			],
		];
		return $links;
	}

	/**
	 * Adds a coach for a given user.
	 *
	 * @param int $user_id The user ID for which a coach is to be added.
	 * @param int $coach_id The user ID of the coach.
	 */
	private function add_coach( int $user_id, int $coach_id ) : bool {
		global $wpdb;

		// Suppressing here because attempting to insert a duplicate should
		// fail silently, not produce a fatal error.
		$wpdb->suppress_errors( true );

		// Ignoring because this is only applicable for WordPress VIP.
		// @codingStandardsIgnoreLine
		$success = (bool) $wpdb->insert(
			$wpdb->prefix . 'user_groups',
			[
				'owner_id'  => $coach_id,
				'member_id' => $user_id,
			],
			[ '%d', '%d' ]
		);

		return $success;
	}

	/**
	 * Deletes a member from a given owner's group.
	 *
	 * @param int $member_id The member user ID to be deleted.
	 * @param int $owner_id The group owner's user ID.
	 */
	private function delete_member( int $member_id, int $owner_id ) : bool {
		global $wpdb;

		// We don't want to cache these types of requests.
		// @codingStandardsIgnoreLine
		$success = (bool) $wpdb->delete(
			$wpdb->prefix . 'user_groups',
			[
				'owner_id'  => $owner_id,
				'member_id' => $member_id,
			],
			[ '%d', '%d' ]
		);

		return $success;
	}

}

/**
 * "Groups" object for REST response.
 */
class Groups { // @codingStandardsIgnoreLine
	/**
	 * Array of user IDs of the given user's coaches.
	 *
	 * @var int[]
	 */
	public $coaches;

	/**
	 * Array of user IDs in which the given user is coaching.
	 *
	 * @var int[]
	 */
	public $learners;

	/**
	 * Constructor.
	 *
	 * @param int $user_id The user id for which groups are to be assembled.
	 */
	public function __construct( int $user_id ) {
		$this->coaches  = $this->get_coaches( $user_id );
		$this->learners = $this->get_learners( $user_id );
	}

	/**
	 * Fetch a list of coach user IDs for a given user ID.
	 *
	 * @param int $user_id The User ID for which coaches should be fetched.
	 * @return int[]
	 */
	private function get_coaches( int $user_id ) : array {
		global $wpdb;

		$coach_ids = $wpdb->get_col(
			$wpdb->prepare(
				"
					SELECT owner_id
					  FROM {$wpdb->prefix}user_groups
					 WHERE member_id = %d
				",
				$user_id
			)
		);

		return array_map( 'intval', $coach_ids );
	}

	/**
	 * Fetch a list of learner user IDs for a given user ID.
	 *
	 * @param int $user_id The User ID for which coaches should be fetched.
	 * @return int[]
	 */
	private function get_learners( int $user_id ) : array {
		global $wpdb;

		$member_ids = $wpdb->get_col(
			$wpdb->prepare(
				"
					SELECT member_id
					  FROM {$wpdb->prefix}user_groups
					 WHERE owner_id = %d
				",
				$user_id
			)
		);

		return array_map( 'intval', $member_ids );
	}
}
