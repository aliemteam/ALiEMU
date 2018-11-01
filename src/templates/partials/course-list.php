<?php
/**
 * Template part for displaying the course list on course pages.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ALiEMU
 */

?>

<?php if ( ! is_page( 'air', 'air-pro' ) ) : ?>

	<div class="course-list">
		<div class="course-boxes" role="list">
			<?php echo do_shortcode( "[ld_course_list category_name='$post->post_name']" ); ?>
		</div>
	</div>

	<?php
else :

	$current_year = (int) get_gmt_from_date( null, 'Y' );
	$year         = 2014;
	$courses      = [];

	while ( $year <= $current_year ) {
		$list = do_shortcode( "[ld_course_list category_name='$post->post_name' tag='$year']" );
		if ( ! empty( $list ) ) {
			$courses[ (string) $year ] = $list;
		}
		$year++;
	}

	$years = array_keys( $courses );
	?>

	<div class="course-list">
	<?php foreach ( array_reverse( $courses, true ) as $year => $boxes ) : ?>
		<h1
			class="course-list__year-heading"
			id="year-<?php echo esc_attr( $year ); ?>"
		>
			<?php echo esc_html( $year ); ?>
		</h1>
		<div
			class="course-boxes"
			role="list"
			aria-labelledby="year-<?php echo esc_attr( $year ); ?>"
		>
			<?php
			// Ignoring this because it's already sanitized -- Came from a shortcode.
			// phpcs:ignore
			echo $boxes;
			?>
		</div>
	<?php endforeach; ?>
	</div>

	<?php
endif;
