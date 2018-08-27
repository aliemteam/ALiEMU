<?php
/**
 * Abstractions for `rest_prepare_comment` filter, which is used for modifying
 * the final response fields returned for a request based on one or more
 * arbitrary conditions.
 *
 * @package ALiEMU
 */

namespace ALIEMU\API\Comments\Prepare;

defined( 'ABSPATH' ) || exit;

add_filter(
	'rest_prepare_comment',
	function( $response, $comment, $request ) {
		$prepare_funcs = [
			'link_up',
		];

		foreach ( $prepare_funcs as $func ) {
			$func     = __NAMESPACE__ . '\\' . $func;
			$response = call_user_func( $func, $response, $comment, $request );
		}

		return rest_ensure_response( $response );
	},
	10,
	3
);

/**
 * Fixes "up" links for comments.
 *
 * @see https://core.trac.wordpress.org/ticket/44152#ticket
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_Comment       $comment Comment object used to create response.
 * @param WP_REST_Request  $request Request object.
 */
function link_up( $response, $comment, $request ) {
	$post = get_post( $comment->comment_post_ID );

	if ( ! empty( $post->ID ) ) {
		$obj = get_post_type_object( $post->post_type );
		if ( substr( $obj->rest_controller_class, 0, 6 ) === 'ALIEMU' ) {
			$base = $obj->rest_base ?? $obj->name;
			$response->remove_link( 'up' );
			$response->add_link(
				'up',
				rest_url(
					'aliemu/v1/' . $base . '/' . $comment->comment_post_ID
				),
				[ 'embeddable' => true ]
			);
		}
	}

	return rest_ensure_response( $response );
}

