<?php
/**
 * Abstractions for `rest_prepare_user` filter, which is used for modifying
 * the final response fields returned for a request based on one or more
 * arbitrary conditions.
 *
 * @package ALiEMU
 */

namespace ALIEMU\API\Users\Prepare;

use WP_REST_Request;
use WP_REST_Response;
use WP_User;

defined( 'ABSPATH' ) || exit;

add_filter(
	/**
	 * Filters the REST avatar sizes.
	 *
	 * @param array $sizes An array of int values that are the pixel sizes for avatars.
	 *                     Default `[ 24, 48, 96 ]`.
	 */
	'rest_avatar_sizes', function( array $sizes ) : array {
		$sizes[] = 150;
		return $sizes;
	}
);

add_filter(
	/**
	 * Removes `has_published_posts` from the query args so even users who have not
	 * published content are returned by the request.
	 *
	 * @see https://developer.wordpress.org/reference/classes/wp_user_query/
	 *
	 * @param array           $prepared_args Array of arguments for WP_User_Query.
	 * @param WP_REST_Request $request       The current request.
	 */
	'rest_user_query', function( array $prepared_args, WP_REST_Request $request ) : array {
		unset( $prepared_args['has_published_posts'] );
		return $prepared_args;
	}, 10, 2
);

add_filter(
	/**
	 * Applies a list of `prepare_funcs` to the response which, in turn
	 * transforms the response in various different ways depending on the
	 * environment and the user requesting the data.
	 *
	 * @param WP_REST_Response $response The response object.
	 * @param WP_User          $user     User object used to create response.
	 * @param WP_REST_Request  $request  Request object.
	 */
	'rest_prepare_user',
	function(
		WP_REST_Response $response,
		WP_User $user,
		WP_REST_Request $request
	) : WP_REST_Response {
		$prepare_funcs = [
			'field_course_progress',
			'field_email',
			'field_first_name_last_name',
			'field_last_login',
			'field_registered_date',
		];

		foreach ( $prepare_funcs as $func ) {
			$func     = __NAMESPACE__ . '\\' . $func;
			$response = call_user_func( $func, $response, $user, $request );
		}

		return rest_ensure_response( $response );
	}, 10, 3
);

/**
 * Only serve course progress data to users with valid permissions to be
 * looking at that information.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_course_progress( $response, $user, $request ) : WP_REST_Response {
	if ( ! current_user_has_access( $user->ID ) ) {
		unset( $response->data['course_progress'] );
	}
	return rest_ensure_response( $response );
}

/**
 * Allow access to user email at the view context if the requesting user is a
 * learner or coach of the user.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_email( $response, $user, $request ) : WP_REST_Response {
	if (
		! array_key_exists( 'email', $response->data ) &&
		( current_user_has_access( $user->ID ) || current_user_is_learner_of( $user->ID ) )
	) {
		$response->data['email'] = $user->data->user_email;
	}
	return rest_ensure_response( $response );
}

/**
 * Allow access to user's name at the view context if the requesting user is a
 * learner or coach of the user.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_first_name_last_name( $response, $user, $request ) : WP_REST_Response {
	if (
		! array_key_exists( 'first_name', $response->data ) &&
		( current_user_has_access( $user->ID ) || current_user_is_learner_of( $user->ID ) )
	) {
		// Ignoring because this is only an issue on massive multisites like WordPress VIP.
		// @codingStandardsIgnoreStart
		$response->data['first_name'] = get_user_meta( $user->ID, 'first_name', true );
		$response->data['last_name']  = get_user_meta( $user->ID, 'last_name', true );
		// @codingStandardsIgnoreEnd
	}
	return rest_ensure_response( $response );
}

/**
 * Add `last_login` field to User response for current user and all learners of
 * current user.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_last_login( $response, $user, $request ) : WP_REST_Response {
	if ( current_user_has_access( $user->ID ) ) {
		// Ignoring because this is only an issue on massive multisites like WordPress VIP.
		// @codingStandardsIgnoreLine
		$response->data['last_login'] = (int) get_user_meta( $user->ID, '_um_last_login', true );
	}
	return rest_ensure_response( $response );
}

/**
 * Allow access to user registered date in all contexts because it's not
 * protected information and it's silly to block access to it.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_registered_date( $response, $user, $request ) : WP_REST_Response {
	if ( ! array_key_exists( 'registered_date', $response->data ) ) {
		$response->data['registered_date'] = date( 'c', strtotime( $user->user_registered ) );
	}
	return rest_ensure_response( $response );
}

/**
 * Return true if the current user has access to a given user's data.
 *
 * @param int $user_id The data owner for which we're checking to see if the
 *                     current user has access.
 */
function current_user_has_access( int $user_id ) : bool {
	global $wpdb;
	$current_user = wp_get_current_user();

	if ( ! $current_user ) {
		return false;
	}

	if ( current_user_can( 'edit_users', $user_id ) || $current_user->ID === $user_id ) {
		return true;
	}

	return current_user_is_coach_of( $user_id );
}

/**
 * Return true if the current user is a coach of a given user.
 *
 * @param int $user_id The user in question.
 */
function current_user_is_coach_of( $user_id ) : bool {
	global $wpdb;
	$current_user = wp_get_current_user();

	if ( ! $current_user || $user_id <= 0 ) {
		return false;
	}

	$current_user_is_learner = (bool) $wpdb->get_var(
		$wpdb->prepare(
			"
				SELECT COUNT(*)
				  FROM {$wpdb->prefix}user_groups
				 WHERE owner_id = %d
				   AND member_id = %d
			",
			$current_user->ID,
			$user_id
		)
	);

	return $current_user_is_learner;
}

/**
 * Return true if the current user is a learner of a given user.
 *
 * @param int $user_id The user in question.
 */
function current_user_is_learner_of( $user_id ) : bool {
	global $wpdb;
	$current_user = wp_get_current_user();

	if ( ! $current_user || $user_id <= 0 ) {
		return false;
	}

	$current_user_is_learner = (bool) $wpdb->get_var(
		$wpdb->prepare(
			"
				SELECT COUNT(*)
				  FROM {$wpdb->prefix}user_groups
				 WHERE owner_id = %d
				   AND member_id = %d
			",
			$user_id,
			$current_user->ID
		)
	);

	return $current_user_is_learner;
}
