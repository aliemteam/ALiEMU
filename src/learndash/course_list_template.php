<?php

defined( 'ABSPATH' ) || exit;

$ld          = get_post_meta( get_the_id(), '_sfwd-courses', true );
$hours       = $ld['sfwd-courses_recommendedHours'];
$description = $ld['sfwd-courses_course_short_description'];
$category    = get_the_category();

if ( ! $category ) {
	wp_die();
}
$category = $category[0]->cat_name;

?>
<article id="post-<?php the_id(); ?>" <?php post_class( 'course-box' ); ?>>
	<div <?php post_class( [ 'course-box__heading' ] ); ?>>
		<?php
			echo esc_html(
				sprintf(
					// translators: %s represents the number of hours.
					_n( '%s hour', '%s hours', $hours, 'aliemu' ),
					$hours
				)
			);
		?>
	</div>
	<div class="course-box__body">
		<code><?php echo esc_html( $category ); ?></code>
		<h3><?php the_title(); ?></h3>
		<div class="course-box__description">
			<?php echo esc_html( wp_trim_words( $description, 25 ) ); ?>
		</div>
		<div class="course-box__link">
			<a href="<?php the_permalink(); ?>" class="btn btn--flat btn--<?php echo esc_attr( strtolower( $category ) ); ?>">
				View <?php echo esc_html( LearnDash_Custom_Label::get_label( 'course' ) ); ?>
			</a>
		</div>
	</div>
</article>
<?php
