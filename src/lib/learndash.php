<?php
/**
 * Functionality related to LearnDash
 *
 * @package ALiEMU
 */

defined( 'ABSPATH' ) || exit;

/**
 * Adds "Course Short Description" field to the block meta.
 *
 * @param WP_Post[] $posts Array of posts.
 */
function learndash_course_grid_post_args( $posts ) {
	foreach ( $posts as $key => $post ) {
		if ( 'sfwd-courses' !== $post['post_type'] ) {
			continue;
		}

		$extra_fields = [
			'course_short_description' => [
				'name'      => 'Course Short Description',
				'type'      => 'textarea',
				'help_text' => 'Short description for the course. Try to keep word cound ≤ 20 words (MAXIMUM = 30 words)',
			],
			'recommendedHours'         => [
				'name'      => 'Recommended III Hours',
				'type'      => 'text',
				'help_text' => 'The amount of hours that you recommend students claim for this course.',
			],
		];

		$posts[ $key ]['fields'] = $posts[ $key ]['fields'] + $extra_fields;
	}
	return $posts;
}
add_filter( 'learndash_post_args', 'learndash_course_grid_post_args', 10, 1 );

/**
 * Adds a warning message if the short description field of a post exceeds 30 words.
 *
 * @global WP_Post $post
 */
function check_description_length() {
	global $post;

	// Not on a post page.
	if ( ! function_exists( 'get_current_screen' ) || ! $post ) {
		return;
	}

	// Not on a course edit page.
	$screen = get_current_screen();
	if ( 'sfwd-courses' !== $screen->id ) {
		return;
	}

	$meta        = get_post_meta( $post->ID, '_sfwd-courses' );
	$description = $meta[0]['sfwd-courses_course_short_description'];
	$words       = preg_split( '/(?: |(?<=\S)-(?=\S))/', $description );
	if ( count( $words ) > 30 ) {
		?>
		<div class="notice notice-error is-dismissible">
			<p>
				<a href="#sfwd-courses_course_short_description"><code>Course Short Description</code></a>
				word count <strong>must be less than 31 words</strong>. Please revise.
			</p>
		</div>
		<?php
	}
}
add_action( 'admin_notices', 'check_description_length' );
