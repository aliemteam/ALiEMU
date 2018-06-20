<?php
/**
 * Queries related to custom post types.
 *
 * @package ALiEMU
 */

// phpcs:disable WordPress.VIP.DirectDatabaseQuery.DirectQuery
namespace ALIEMU\Database\Queries;

defined( 'ABSPATH' ) || exit;

use WP_Post;
use function ALIEMU\Utils\post_type_normalized;

/**
 * Given a post ID, return the post object of the post's direct parent, or
 * NULL if it doesn't have one.
 *
 * @param int $id The post ID.
 * @return WP_Post|null
 */
function get_nearest_parent( int $id ) {
	global $wpdb;

	$parent = wp_cache_get( $id, __FUNCTION__, false, $found );
	if ( ! $found ) {
		$parent = $wpdb->get_var(
			$wpdb->prepare(
				"
				SELECT meta_value
				FROM $wpdb->postmeta
				WHERE post_id = %d
				AND meta_key IN (
					'course_id',
					'lesson_id',
					'topic_id'
				)
				AND meta_value != 0
				ORDER BY
						CASE
							WHEN meta_key = 'topic_id'  THEN 1
							WHEN meta_key = 'lesson_id' THEN 2
							WHEN meta_key = 'course_id' THEN 3
						END
				",
				$id
			)
		);

		if ( $parent ) {
			$parent = get_post( (int) $parent );
		}
		wp_cache_set( $id, $parent, __FUNCTION__ );
	}

	return $parent;
}

/**
 * Fetch a list of associated lesson IDs for a given post.
 *
 * @param WP_Post $post The course of interest.
 */
function get_post_lesson_ids( WP_Post $post ) : array {
	return _get_associated_ids( $post, ALIEMU_POST_TYPES['lesson'] );
}

/**
 * Fetch a list of associated topic IDs for a given post.
 *
 * @param WP_Post $post The course of interest.
 */
function get_post_topic_ids( WP_Post $post ) : array {
	return _get_associated_ids( $post, ALIEMU_POST_TYPES['topic'] );
}

/**
 * Fetch a list of associated quiz IDs for a given post.
 *
 * @param WP_Post $post The post of interest.
 */
function get_post_quiz_ids( WP_Post $post ) : array {
	return _get_associated_ids( $post, ALIEMU_POST_TYPES['quiz'] );
}

/**
 * Gets a list of associated post IDs of type $assoc_type for a given post.
 *
 * @param WP_Post $post A post instance for which associated post IDs are to be fetched.
 * @param string  $assoc_type A custom post type of the type of interest.
 */
function _get_associated_ids( WP_Post $post, string $assoc_type ) : array {
	global $wpdb;

	$normalized_type = post_type_normalized( $post->post_type );
	$cache_group     = "aliemu_{$normalized_type}_{$assoc_type}";
	$assoc_ids       = wp_cache_get( $post->ID, $cache_group );
	if ( ! $assoc_ids ) {
		$assoc_ids = $wpdb->get_col(
			$wpdb->prepare(
				"
				SELECT ID
				FROM $wpdb->posts
				WHERE ID IN (
					SELECT post_id
					FROM $wpdb->postmeta
					WHERE meta_key = %s
					AND meta_value = %d
				)
				AND post_type = %s
				",
				$normalized_type . '_id',
				$post->ID,
				$assoc_type
			)
		);
		wp_cache_set( $post->ID, $assoc_ids, $cache_group, DAY_IN_SECONDS );
	}
	return $assoc_ids;
}
