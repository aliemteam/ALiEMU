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

use function ALIEMU\Database\Queries\{
	current_user_has_access,
	current_user_is_coach_of,
	current_user_is_learner_of,
	get_learner_tags,
};

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
			'field_learner_tags',
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
		$response->data['first_name'] = get_user_meta( $user->ID, 'first_name', true ); // phpcs:ignore
		$response->data['last_name']  = get_user_meta( $user->ID, 'last_name', true ); // phpcs:ignore
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
		$last_login_time = (int) get_user_meta( $user->ID, '_um_last_login', true ); // phpcs:ignore
		$response->data['last_login'] = 0 === $last_login_time
			? false
			: date( 'c', $last_login_time );
	}
	return rest_ensure_response( $response );
}

/**
 * Add `learner_tags` field to User response for users who are learner of the current user.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user     User object used to create response.
 * @param WP_REST_Request  $request  Request object.
 */
function field_learner_tags( $response, $user, $request ) : WP_REST_Response {
	$current_user_id = get_current_user_id();
	if ( current_user_is_coach_of( $user->ID ) || $current_user_id === $user->ID ) {
		$response->data['learner_tags'] = get_learner_tags( $current_user_id, $user->ID );
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

