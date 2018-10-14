<?php

defined( 'ABSPATH' ) || exit;

$ld          = get_post_meta( get_the_id(), '_sfwd-courses', true );
$hours       = $ld['sfwd-courses_recommendedHours'];
$description = $ld['sfwd-courses_course_short_description'];
$category    = get_the_category();

if ( ! empty( $category ) ) :

	$category           = $category[0]->cat_name;
	$category_lowercase = strtolower( $category );

	?>
<a
	class="course-box"
	role="listitem"
	aria-labelledby="course-<?php the_id(); ?>-title course-<?php the_id(); ?>-hours"
	aria-describedby="course-<?php the_id(); ?>-description"
	href="<?php the_permalink(); ?>"
>
	<div
		id="course-<?php the_id(); ?>-hours"
		class="course-box__heading course-box__heading--<?php echo esc_attr( $category_lowercase ); ?>"
	>
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
		<h3
			id="course-<?php the_id(); ?>-title"
		>
			<?php the_title(); ?>
		</h3>
		<div
			id="course-<?php the_id(); ?>-description"
			class="course-box__description"
		>
			<?php echo esc_html( wp_trim_words( $description, 30 ) ); ?>
		</div>
	</div>
</a>
	<?php

endif;
