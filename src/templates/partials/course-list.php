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

	<div class="course-list course-list--transparent">
		<div class="course-boxes">
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
		<div class="course-list__year-links">
			<?php foreach ( array_reverse( $years ) as $year ) : ?>
				<a
					href="#year-<?php echo esc_attr( $year ); ?>"
					aria-label="in page link to <?php echo esc_attr( $year ); ?>"
				>
				<?php
					echo esc_html( $year );
				?>
				</a>
			<?php endforeach; ?>
		</div>
	<?php foreach ( array_reverse( $courses, true ) as $year => $boxes ) : ?>
		<div id="year-<?php echo esc_attr( $year ); ?>" class="course-list__single-year-container">
			<h1><?php echo esc_html( $year ); ?></h1>
			<div class="course-boxes course-boxes--scroll">
				<?php
				// Ignoring this because it's already sanitized -- Came from a shortcode.
				// @codingStandardsIgnoreStart
				echo $boxes;
				// @codingStandardsIgnoreEnd
				?>
			</div>
		</div>
	<?php endforeach; ?>
	</div>
<?php
endif;
