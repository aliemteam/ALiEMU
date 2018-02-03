<?php
/**
 * Custom shortcodes
 *
 * @package ALiEMU
 */

namespace ALIEMU\Shortcodes;

defined( 'ABSPATH' ) || exit;

/**
 * Capsule box
 *
 * @param mixed[] $atts {
 *      Shortcode attributes.
 *
 *      @type string $heading Optional. The capsule box's heading. Default 'CAPSULE'.
 * }
 * @param string  $content The content to be displayed inside the box.
 */
function capsule( $atts, $content ) {
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
add_shortcode( 'capsule', 'ALIEMU\Shortcodes\capsule' );

/**
 * Shortcode which GETs and returns the recommended III hours for certificates.
 *
 * @return string The recommended hours
 */
function course_hours() {
	$course_id = @$_GET['course_id'];
	if ( empty( $course_id ) ) {
		return '';
	}
	$meta = get_post_meta( $course_id, '_sfwd-courses', true );
	return $meta['sfwd-courses_recommendedHours'];
}
add_shortcode( 'course-hours', 'ALIEMU\Shortcodes\course_hours' );


/**
 * "Learn more" toggle
 *
 * @param mixed[] $atts {
 *      Shortcode attributes.
 *
 *      @type string $caption The caption to be displayed in the toggle.
 * }
 * @param string  $content The content to be toggled.
 */
function learn_more( $atts, $content ) {
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
add_shortcode( 'learn_more', 'ALIEMU\Shortcodes\learn_more' );
