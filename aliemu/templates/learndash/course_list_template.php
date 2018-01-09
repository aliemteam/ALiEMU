<?php

defined( 'ABSPATH' ) || exit;

$ld = get_post_meta( get_the_id(), '_sfwd-courses', true );
$hours = $ld['sfwd-courses_recommendedHours'];
$description = $ld['sfwd-courses_course_short_description'];
$category = get_the_category();

if ( ! $category ) {
	wp_die();
}
$category = $category[0]->cat_name;
?>
<article id="post-<?php the_id(); ?>" <?php post_class( 'course-box' ); ?>>
	<div <?php post_class( ['course-box__heading'] ); ?>>
		<?php echo $hours == 1 ? $hours . ' hour' : $hours . ' hours'; ?>
	</div>
	<div class="course-box__body">
		<div class="course-box__category">
			<?php echo $category; ?>
		</div>
		<div class="course-box__title">
			<?php the_title(); ?>
		</div>
		<div class="course-box__description">
			<?php echo $description; ?>
		</div>
		<div class="course-box__link">
			<a href="<?php the_permalink(); ?>" class="btn btn--flat btn--<?php echo strtolower( $category ); ?>">View Module</a>
		</div>
	</div>
</article>
<?php
