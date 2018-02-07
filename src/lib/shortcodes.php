<?php
/**
 * Custom shortcodes
 *
 * @package ALiEMU
 */

namespace ALIEMU\Shortcodes;

use ALIEMU\{Utils,Tags};

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
function capsule( $atts, $content ) : string {
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
function learn_more( $atts, $content ) : string {
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

/**
 * Person
 *
 * @param mixed[] $atts {
 *      Shortcode attributes.
 *
 *      @type string $name The person's full name.
 *      @type string $title The person's title.
 *      @type string $image A full URL to an image file OR a path relative to
 *                          the assets directory.
 *      @type string $twitter Optional. The person's twitter handle.
 *      @type string $align Optional. The alignment of the element.
 * }
 * @param string  $content The person's background information / supporting details.
 */
function person( $atts = [], $content = null ) : string {
	$atts = shortcode_atts(
		[
			'name'    => '',
			'title'   => '',
			'image'   => '',
			'twitter' => '',
			'align'   => '',
		], $atts
	);

	if ( ! in_array( $atts['align'], [ 'left', 'right' ], true ) ) {
		$style = '';
	} else {
		$style = "float: {$atts['align']}; margin: 0 20px; margin-{$atts['align']}: 0;";
	}

	ob_start();
	if ( ! $atts['name'] || ! $atts['image'] || ! $content ) {
		?>
			<h1 style='color: red'>
				Person shortcode requires 'name', 'image', and inner content!
			</h1>
		<?php
		return ob_get_clean();
	}

	if ( ! filter_var( $atts['image'], FILTER_VALIDATE_URL ) ) {
		if ( file_exists( ALIEMU_ROOT_PATH . "/assets/{$atts['image']}" ) ) {
			$atts['image'] = ALIEMU_ROOT_URI . "/assets/{$atts['image']}";
		} else {
			$atts['image'] = ALIEMU_ROOT_URI . '/assets/team/team-placeholder.svg';
		}
	}

	$content = Utils\unautop( $content );

	?>
	<div class="person" style="<?php echo esc_attr( $style ); ?>">
		<div class="person__img">
			<img src="<?php echo esc_attr( $atts['image'] ); ?>"/>
		</div>
		<div class="person__meta">
			<div class="person__name"><?php echo esc_html( $atts['name'] ); ?></div>
			<div class="person__title"><?php echo esc_html( $atts['title'] ); ?></div>
			<div class="person__background"><?php echo do_shortcode( $content ); ?></div>
		</div>
		<div class="person__social-media">
			<?php if ( '' !== $atts['twitter'] ) : ?>
				<a
					href="https://twitter.com/<?php echo esc_attr( $atts['twitter'] ); ?>"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Link to Twitter profile"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						role="img"
						viewBox="0 0 24 24"
						height="24"
						width="24"
					>
						<path
							fill="#1da1f2"
							d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
						/>
					</svg>
				</a>
			<?php endif; ?>
		</div>
	</div>
	<?php
	return trim( ob_get_clean() );
}
add_shortcode( 'person', __NAMESPACE__ . '\person' );

/**
 * CSS Grid shortcode.
 *
 * Important note: All content wrapped in this shortcode should be block-level
 * elements. Absolutely no inline elements (e.g. plain text).
 *
 * @param mixed[] $atts {
 *      Shortcode attributes.
 *
 *      @type string $min-width The minimum width of a single grid column track.
 *                              Default '250px'.
 *      @type string $gap The width of the grid gap. Default '1em'.
 * }
 * @param string  $content The content to be wrapped as a grid.
 */
function grid( $atts = [], $content = null ) : string {
	[
		'min-width' => $width,
		'gap'       => $gap,
	] = shortcode_atts(
		[
			'min-width' => '250px',
			'gap'       => '1em',
		], $atts
	);

	if ( is_null( $content ) ) {
		return '';
	}

	$content = Utils\unautop( $content );

	$css = [
		'grid-template-columns' => "repeat(auto-fit, minmax($width, 1fr))",
		'grid-gap'              => $gap,
	];

	ob_start();
	?>
		<div
			class="grid"
			style="<?php Tags\the_array_css( $css ); ?>"
		><?php echo do_shortcode( $content ); ?></div>
	<?php
	return trim( ob_get_clean() );
}
add_shortcode( 'grid', __NAMESPACE__ . '\grid' );
