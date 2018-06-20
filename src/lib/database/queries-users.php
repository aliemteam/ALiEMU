<?php
/**
 * Database queries related to Users.
 *
 * @package ALiEMU
 */

// phpcs:disable WordPress.VIP.DirectDatabaseQuery.DirectQuery

namespace ALIEMU\Database\Queries;

defined( 'ABSPATH' ) || exit;

/**
 * Retrieve the course progress data for a given user.
 *
 * @param int $user_id  The user ID of interest.
 */
function get_user_course_progress( int $user_id ) : array {
	global $wpdb;

	$course_progress = wp_cache_get( $user_id, __FUNCTION__ );
	if ( ! $course_progress ) {
		$results = $wpdb->get_results(
			$wpdb->prepare(
				"
				SELECT
					a.activity_id,
					a.post_id,
					a.activity_status,
					m1.activity_meta_value AS steps_completed,
					m2.steps_total,
					a.activity_started,
					a.activity_updated,
					CASE
						WHEN a.activity_completed > 0 THEN a.activity_completed
						WHEN a.activity_status = 1 AND COALESCE(a.activity_completed, 0) < 1 THEN a.activity_updated
						ELSE 0
					END AS activity_completed
				FROM {$wpdb->prefix}learndash_user_activity AS a
				LEFT JOIN {$wpdb->prefix}learndash_user_activity_meta AS m1
					ON a.activity_id = m1.activity_id AND m1.activity_meta_key = 'steps_completed'
				LEFT JOIN (
					SELECT
						CAST(meta.meta_value AS UNSIGNED) AS post_id,
						COUNT(*) as steps_total
					FROM {$wpdb->prefix}posts post
					LEFT JOIN {$wpdb->prefix}postmeta meta
						ON meta.post_id = post.ID
					WHERE meta.meta_key = 'course_id'
					AND meta.meta_value > 0
					AND post.ID NOT IN (
						SELECT p.ID
						FROM {$wpdb->prefix}postmeta m
						LEFT JOIN {$wpdb->prefix}posts p
							ON p.ID = m.post_id
						WHERE m.meta_key = 'lesson_id'
						AND m.meta_value > 0
						AND p.post_type = 'sfwd-quiz'
					)
					AND meta.meta_value NOT IN (
						SELECT ID
						FROM {$wpdb->prefix}posts post
						LEFT JOIN {$wpdb->prefix}postmeta meta
							ON post.ID = meta.post_id AND meta.meta_key IN ( 'lesson_id', 'topic_id' ) AND meta.meta_value > 0
						WHERE post.post_type = 'sfwd-quiz'
					)
					GROUP BY meta.meta_value
				) AS m2 USING ( post_id )
				WHERE a.activity_type = 'course'
				AND m1.activity_meta_value > 0
				AND a.user_id = %d
				",
				$user_id
			)
		);

		$course_progress = [];
		foreach ( $results as $result ) {
			$meta              = get_post_meta( $result->post_id, '_sfwd-courses', true );
			$course_progress[] = [
				'status'             => (
					1 === (int) $result->activity_status
					? 'COMPLETED'
					: 'STARTED'
				),
				'id'                 => (int) $result->post_id,
				'steps_total'        => (int) $result->steps_total,
				'steps_completed'    => (int) $result->steps_completed,
				'activity_started'   => (
					0 === (int) $result->activity_started
					? null
					: date( 'c', $result->activity_started )
				),
				'activity_completed' => (
					0 === (int) $result->activity_completed
					? null
					: date( 'c', $result->activity_completed )
				),
				'activity_updated'   => (
					0 === (int) $result->activity_updated
					? null
					: date( 'c', $result->activity_updated )
				),
				'hours_awarded'      => (
					1 === (int) $result->activity_status ?
					(int) $meta['sfwd-courses_recommendedHours']
					: 0
				),
			];
		}
		wp_cache_set( $user_id, $course_progress, __FUNCTION__, 10 * MINUTE_IN_SECONDS );
	}

	return $course_progress;
}

