<?php
/**
 * Database queries related to Groups.
 *
 * @package ALiEMU
 */

// phpcs:disable WordPress.VIP.DirectDatabaseQuery.DirectQuery

namespace ALIEMU\Database\Queries;

use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * Return true if the given user has access to a given user's data.
 *
 * @param int $user_id    The user for which we're checking to see has access.
 * @param int $learner_id The data owner for which we're checking to see if the
 *                        current user has access.
 */
function user_has_access( int $user_id, int $learner_id ) : bool {
	$user = get_user_by( 'id', $user_id );

	if ( ! $user ) {
		return false;
	}

	if ( user_can( $user, 'edit_users', $learner_id ) || $user->ID === $learner_id ) {
		return true;
	}

	return user_is_coach_of( $user->ID, $learner_id );
}

/**
 * Return true if the current user has access to a given user's data.
 *
 * @param int $learner_id The data owner for which we're checking to see if the
 *                        current user has access.
 */
function current_user_has_access( int $learner_id ) : bool {
	return user_has_access( get_current_user_id(), $learner_id );
}

/**
 * Return true if the the given user is a coach of a given user.
 *
 * @param int $coach_id   The coach user ID in question.
 * @param int $learner_id The learner user ID in question.
 */
function user_is_coach_of( int $coach_id, int $learner_id ) : bool {
	global $wpdb;
	$user = get_user_by( 'id', $coach_id );

	if ( ! $user || $learner_id <= 0 ) {
		return false;
	}

	$cache_group   = "{$coach_id}_{$learner_id}";
	$user_is_coach = wp_cache_get( 'user_is_coach_of', $cache_group, false, $found );
	if ( ! $found ) {
		$user_is_coach = (bool) $wpdb->get_var(
			$wpdb->prepare(
				"
					SELECT COUNT(*)
					  FROM {$wpdb->prefix}user_groups
					 WHERE owner_id = %d
					   AND member_id = %d
				",
				$coach_id,
				$learner_id
			)
		);
		wp_cache_set( 'user_is_coach_of', $user_is_coach, $cache_group, 100 );
	}

	return $user_is_coach;
}

/**
 * Return true if the current user is a coach of a given user.
 *
 * @param int $learner_id The learner user ID in question.
 */
function current_user_is_coach_of( int $learner_id ) : bool {
	return user_is_coach_of( get_current_user_id(), $learner_id );
}

/**
 * Return true if user `$learner_id` is a learner of coach `$coach_id`.
 *
 * @param int $learner_id The learner user ID in question.
 * @param int $coach_id   The coach user ID in question.
 */
function user_is_learner_of( int $learner_id, int $coach_id ) : bool {
	return user_is_coach_of( $coach_id, $learner_id );
}

/**
 * Return true if the current user is a learner of a given user.
 *
 * @param int $coach_id The user in question.
 */
function current_user_is_learner_of( int $coach_id ) : bool {
	global $wpdb;
	$current_user = wp_get_current_user();

	if ( ! $current_user || $coach_id <= 0 ) {
		return false;
	}

	return user_is_learner_of( $current_user->ID, $coach_id );
}

/**
 * Fetch a list of coach user IDs for a given user ID.
 *
 * @param int $user_id The User ID for which coaches should be fetched.
 * @return int[]
 */
function get_user_coaches( int $user_id ) : array {
	global $wpdb;

	$coach_ids = wp_cache_get( 'coaches', $user_id );
	if ( false === $coach_ids ) {
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
		$coach_ids = array_map( 'intval', $coach_ids );
		wp_cache_set( 'coaches', $coach_ids, $user_id, 10 * MINUTE_IN_SECONDS );
	}

	return $coach_ids;
}

/**
 * Fetch a list of learner user IDs for a given user ID.
 *
 * @param int $user_id The User ID for which coaches should be fetched.
 * @return int[]
 */
function get_user_learners( int $user_id ) : array {
	global $wpdb;

	$member_ids = wp_cache_get( 'learners', $user_id );
	if ( false === $member_ids ) {
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
		$member_ids = array_map( 'intval', $member_ids );
		wp_cache_set( 'learners', $member_ids, $user_id, 10 * MINUTE_IN_SECONDS );
	}

	return $member_ids;
}

/**
 * Retrieve the coach's learner tags for a given coach and learner.
 *
 * @param int $coach_id The coach's user ID.
 * @param int $learner_id The learner's user ID.
 */
function get_learner_tags( int $coach_id, int $learner_id ) : array {
	global $wpdb;

	if ( $coach_id === $learner_id ) {
		return json_decode(
			get_user_meta( $coach_id, 'self_learner_tags', true ) // phpcs:ignore
		) ?? [];
	}

	$cache_group = "{$coach_id}_{$learner_id}";
	$tags        = wp_cache_get( 'learner_tags', $cache_group );
	if ( false === $tags ) {
		$tags = json_decode(
			$wpdb->get_var(
				$wpdb->prepare(
					"
					SELECT tags
					FROM {$wpdb->prefix}user_groups
					WHERE owner_id = %d
					AND member_id = %d
					",
					$coach_id,
					$learner_id
				)
			)
		) ?? [];
		wp_cache_set( 'learner_tags', $tags, $cache_group, 10 * MINUTE_IN_SECONDS );
	}
	return $tags;
}

/**
 * Add user `$coach_id` as a coach of user `$user_id`
 *
 * @param int $user_id The ID of the user for which a coach is to be added.
 * @param int $coach_id The ID of the coach to be added.
 * @return bool|WP_Error Return `true` on success, or WP_Error with the error that occurred.
 */
function add_coach_for_user( int $user_id, int $coach_id ) {
	global $wpdb;

	$learner = get_user_by( 'id', $user_id );
	$coach   = get_user_by( 'id', $coach_id );

	if ( ! $learner || ! $coach ) {
		$kind = false === $learner ? 'learner' : 'coach';
		return new WP_Error(
			"groups_invalid_{$kind}",
			"Invalid $kind ID provided.",
			[ 'status' => 400 ]
		);
	}

	// Suppressing here because attempting to insert a duplicate should
	// fail silently, not produce a fatal error.
	$wpdb->suppress_errors( true );

	$success = (bool) $wpdb->insert(
		$wpdb->prefix . 'user_groups',
		[
			'owner_id'  => $coach_id,
			'member_id' => $user_id,
		],
		[ '%d', '%d' ]
	);

	if ( ! $success ) {
		return new WP_Error(
			'groups_coach_exists',
			'Coach already exists for user.',
			[ 'status' => 409 ]
		);
	}

	wp_cache_flush();

	return true;
}

/**
 * Add user `$coach_id` as a coach of current user.
 *
 * @see add_coach_for_user
 *
 * @param int $coach_id The ID of the coach to be added.
 * @return bool|WP_Error Return `true` on success, or WP_Error with the error that occurred.
 */
function add_coach_for_current_user( int $coach_id ) {
	return add_coach_for_user( get_current_user_id(), $coach_id );
}

/**
 * Deletes a coach for a given user.
 *
 * @param int $user_id The user ID for which a coach is to be deleted.
 * @param int $coach_id The user ID of the coach.
 * @return bool|WP_Error True on success, WP_Error on error.
 */
function remove_coach_for_user( int $user_id, int $coach_id ) {
	global $wpdb;

	// We don't want to cache these types of requests.
	// phpcs:ignore
	$success = $wpdb->delete(
		$wpdb->prefix . 'user_groups',
		[
			'owner_id'  => $coach_id,
			'member_id' => $user_id,
		],
		[ '%d', '%d' ]
	);

	if ( false === $success ) {
		return new WP_Error(
			'rest_cannot_delete',
			'The coach cannot be deleted',
			[ 'status' => 500 ]
		);
	}

	wp_cache_flush();

	return true;
}

/**
 * Adds a learner tag for a given coach and learner.
 *
 * @param int    $coach_id   The user ID of the coach.
 * @param int    $learner_id The user ID of the learner.
 * @param string $tag        The tag to add.
 * @return string[]|WP_Error New set of tags on success, WP_Error on error.
 */
function add_learner_tag_for_user( int $coach_id, int $learner_id, string $tag ) {
	return _update_learner_tags_for_user( $coach_id, $learner_id, $tag );
}

/**
 * Removes a learner tag for a given coach and learner.
 *
 * @param int    $coach_id   The user ID of the coach.
 * @param int    $learner_id The user ID of the learner.
 * @param string $tag        The tag to remove.
 * @return string[]|WP_Error New set of tags on success, WP_Error on error.
 */
function remove_learner_tag_for_user( int $coach_id, int $learner_id, string $tag ) {
	return _update_learner_tags_for_user( $coach_id, $learner_id, $tag, true );
}

/**
 * Updates a learner tag for a given coach and learner.
 *
 * @param int    $coach_id   The user ID of the coach.
 * @param int    $learner_id The user ID of the learner.
 * @param string $tag        The tag to either add or remove.
 * @param bool   $remove     True if the tag should be removed. Otherwise tag will be added.
 * @return string[]|WP_Error New set of tags on success, WP_Error on error.
 */
function _update_learner_tags_for_user( int $coach_id, int $learner_id, string $tag, $remove = false ) {
	global $wpdb;

	$old_tags = get_learner_tags( $coach_id, $learner_id );

	if ( $remove ) {
		if ( ! in_array( $tag, $old_tags, true ) ) {
			return $old_tags;
		}
		$tags = array_values(
			array_diff( $old_tags, [ $tag ] )
		);
	} else {
		if ( in_array( $tag, $old_tags, true ) ) {
			return $old_tags;
		}
		$tags = array_values(
			array_merge( $old_tags, [ $tag ] )
		);
	}

	if ( $coach_id === $learner_id ) {
		update_user_meta( // phpcs:ignore
			$coach_id,
			'self_learner_tags',
			empty( $tags ) ? null : wp_json_encode( $tags )
		);
		return $tags;
	}

	// We don't want to cache updates.
	// phpcs:ignore
	$updated = $wpdb->update(
		$wpdb->prefix . 'user_groups',
		[
			'tags' => empty( $tags ) ? null : wp_json_encode( $tags ),
		],
		[
			'owner_id'  => $coach_id,
			'member_id' => $learner_id,
		],
		[ '%s' ],
		[ '%d', '%d' ]
	);

	if ( false === $updated ) {
		return new WP_Error(
			'rest_invalid_json',
			'An error occurred while attempting to convert tags to JSON.',
			[ 'status' => 500 ]
		);
	}

	if ( 0 === $updated ) {
		return new WP_Error(
			'rest_invalid_learner',
			'Learner does not exist for requested coach.',
			[ 'status' => 404 ]
		);
	}

	wp_cache_flush();

	return $tags;
}
