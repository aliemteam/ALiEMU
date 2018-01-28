<?php

defined( 'ABSPATH' ) || exit;

function au_capsule_shortcode( $atts, $content = null ) {
	$atts = shortcode_atts( [ 'heading' => 'CAPSULE' ], $atts );

	$body_class = 'CAPSULE' === $atts['heading']
		? 'capsule-box__body capsule-box__body--capsule'
		: 'capsule-box__body';

	ob_start();
	?>
	<div class='capsule-box'>
		<div class='capsule-box__heading'>
			<?php echo esc_html( $atts['heading'] ); ?>
		</div>
		<div class='<?php echo esc_attr( $body_class ); ?>'>
			<?php echo do_shortcode( $content ); ?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'capsule', 'au_capsule_shortcode' );

/**
 * Shortcode which GETs and returns the recommended III hours for certificates.
 *
 * @return string The recommended hours
 */
function au_course_hours() {
	$course_id = @$_GET['course_id'];
	if ( empty( $course_id ) ) {
		return '';
	}
	$meta = get_post_meta( $course_id, '_sfwd-courses', true );
	return $meta['sfwd-courses_recommendedHours'];
}
add_shortcode( 'course-hours', 'au_course_hours' );

function au_learn_more( $atts, $content ) {
	$atts = shortcode_atts(
		[
			'caption' => '',
		], $atts
	);

	ob_start();
	?>
		<details>
			<?php if ( $atts['caption'] ) : ?>
			<summary><?php echo esc_html( $atts['caption'] ); ?></summary>
			<?php endif; ?>
			<?php echo do_shortcode( $content ); ?>
		</details>
	<?php
	return ob_get_clean();
}
add_shortcode( 'learn_more', 'au_learn_more' );
