<?php
/**
 * Main entrypoint for registering REST routes
 *
 * @package ALiEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init', function() {
		$controllers = [
			'Courses_Controller' => __DIR__ . '/endpoints/class-courses-controller.php',
			'Lessons_Controller' => __DIR__ . '/endpoints/class-lessons-controller.php',
			'Topics_Controller'  => __DIR__ . '/endpoints/class-topics-controller.php',
			'Quizzes_Controller' => __DIR__ . '/endpoints/class-quizzes-controller.php',
		];

		foreach ( $controllers as $classname => $path ) {
			require_once $path;
			$class      = __NAMESPACE__ . '\\' . $classname;
			$controller = new $class();
			$controller->register_routes();
		}

		$fields = [
			'Users\Course_Progress_Field' => __DIR__ . '/fields/user/class-course-progress-field.php',
			'Users\Institution_Field'     => __DIR__ . '/fields/user/class-institution-field.php',
		];

		foreach ( $fields as $classname => $path ) {
			require_once $path;
			$class = __NAMESPACE__ . '\\' . $classname;
			$field = new $class();
			$field->register();
		}
	}
);

/**
 * Modify the final response of the `users` endpoint.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_User          $user User object used to create response.
 * @param WP_REST_Request  $request Request object.
 */
function rest_prepare_user( $response, $user, $request ) {
	// Allow access to user registered date in all contexts because it's not
	// protected information and it's silly to block access to it.
	if ( ! array_key_exists( 'registered_date', $response->data ) ) {
		$response->data['registered_date'] = date( 'c', strtotime( $user->user_registered ) );
	}
	return rest_ensure_response( $response );
}
add_filter( 'rest_prepare_user', __NAMESPACE__ . '\rest_prepare_user', 10, 3 );

/**
 * Modify the final response of the `comments` endpoint.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Comment       $comment User object used to create response.
 * @param WP_REST_Request  $request Request object.
 */
function rest_prepare_comment( $response, $comment, $request ) {
	$post = get_post( $comment->comment_post_ID );

	// Fix "up" links for comments.
	// @see https://core.trac.wordpress.org/ticket/44152#ticket .
	if ( ! empty( $post->ID ) ) {
		$obj = get_post_type_object( $post->post_type );
		if ( substr( $obj->rest_controller_class, 0, 6 ) === 'ALIEMU' ) {
			$base = $obj->rest_base ?? $obj->name;
			$response->remove_link( 'up' );
			$response->add_link(
				'up',
				rest_url(
					'aliemu/v1/' . $base . '/' . $comment->comment_post_ID
				), [ 'embeddable' => true ]
			);
		}
	}

	return $response;
}
add_filter( 'rest_prepare_comment', __NAMESPACE__ . '\rest_prepare_comment', 10, 3 );
