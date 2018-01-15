<?php

defined( 'ABSPATH' ) || exit;

/**
 * Remove emojis
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/**
 * Load / unload styles from tinymce
 */
add_filter(
	'mce_css', function( $styles ) {
		$css   = explore( ',', $styles );
		$css[] = 'https://fonts.googleapis.com/css?family=Roboto:300%2C400%2C400i%2C500%2C700&amp;subset=cyrillic%2Cgreek';
		$css[] = ROOT_URI . '/editor.css';
		return join( ',', $css );
	}
);

/**
 * Ultimate Member Profile Display Name Integration
 *
 * @param  string $author_name The author's name.
 * @param  object $comment     WordPress comment object.
 * @return string
 */
function wpdiscuz_um_author( $author_name, $comment ) {
	if ( $comment->user_id ) {
		$column = 'display_name';
		if ( class_exists( 'UM_API' ) ) {
			um_fetch_user( $comment->user_id );
			$author_name = um_user( $column );
			um_reset_user();
			return $author_name;
		}
		$author_name = get_the_author_meta( $column, $comment->user_id );
	}
	return $author_name;
}
add_filter( 'wpdiscuz_comment_author', 'wpdiscuz_um_author', 10, 2 );


/**
 * Ultimate Member Profile URL Integration
 *
 * @param  string $profile_url The user's profile URL.
 * @param  object $user        WordPress user object.
 * @return string
 */
function wpdiscuz_um_profile_url( $profile_url, $user ) {
	if ( $user && class_exists( 'UM_API' ) ) {
		um_fetch_user( $user->ID );
		$profile_url = um_user_profile_url();
	}
	return $profile_url;
}
add_filter( 'wpdiscuz_profile_url', 'wpdiscuz_um_profile_url', 10, 2 );

/**
 * HTML-Generating Helper Functions
 */
function sorted_course_list( $end_year, $category ) {
	$current_year = intval( get_gmt_from_date( null, 'Y' ) );
	$year         = $current_year;
	?>
	<div class="content-area course-list">
		<div class="course-list__year-links">
			<?php while ( $year >= $end_year ) : ?>
				<a href="#year-<?php echo $year; ?>" aria-label="in page link to <?php echo $year; ?>"><?php echo $year--; ?></a>
			<?php endwhile; ?>
			<?php $year = $current_year; ?>
		</div>
		<?php while ( $year >= $end_year ) : ?>
			<div id="year-<?php echo $year; ?>" class="course-list__single-year-container">
				<div class="course-list__year-heading"><?php echo $year; ?></div>
				<div class="course-boxes course-boxes--scroll">
					<?php echo do_shortcode( "[ld_course_list category_name='$category' tag='$year']" ); ?>
				</div>
			</div>
			<?php $year--; ?>
		<?php endwhile; ?>
	</div>
	<?php
}
