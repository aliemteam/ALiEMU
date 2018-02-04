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
	[
		'heading' => $heading,
	] = shortcode_atts(
		[
			'heading' => 'CAPSULE',
		], $atts
	);

	$body_class = 'CAPSULE' === $heading
		? 'capsule-box__body capsule-box__body--capsule'
		: 'capsule-box__body';

	ob_start();
	?>
	<div class='capsule-box'>
		<div class='capsule-box__heading'>
			<?php echo esc_html( $heading ); ?>
		</div>
		<div class='<?php echo esc_attr( $body_class ); ?>'>
			<?php echo do_shortcode( $content ); ?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'capsule', __NAMESPACE__ . '\capsule' );

/**
 * Shortcode which GETs and returns the recommended III hours for certificates.
 *
 * @return string The recommended hours or "N/A" if not defined
 */
function course_hours() : string {
	$hours = 'N/A';
	// Ignoring nonce verification here because learndash sets dynamic nonce
	// action names using data that I don't have access to because they are the
	// worst programmers ever.
	// @codingStandardsIgnoreStart
	if ( isset( $_GET['course_id'] ) ) {
		// @codingStandardsIgnoreEnd
		$course_id = intval( $_GET['course_id'] ); // Input var okay.
		$meta      = get_post_meta( $course_id, '_sfwd-courses', true );
		$hours     = $meta['sfwd-courses_recommendedHours'];
	}
	return $hours;
}
add_shortcode( 'course-hours', __NAMESPACE__ . '\course_hours' );


/**
 * "Learn more" toggle
 *
 * @param mixed[] $atts {
 *     Shortcode attributes.
 *
 *     @type string $caption The caption to be displayed in the toggle.
 * }
 * @param string  $content The content to be toggled.
 */
function learn_more( $atts, $content ) {
	[
		'caption' => $caption,
	] = shortcode_atts(
		[
			'caption' => 'Details',
		], $atts
	);

	ob_start();
	?>
		<details>
			<summary><?php echo esc_html( $caption ); ?></summary>
			<?php echo do_shortcode( $content ); ?>
		</details>
	<?php
	return ob_get_clean();
}
add_shortcode( 'learn_more', __NAMESPACE__ . '\learn_more' );
