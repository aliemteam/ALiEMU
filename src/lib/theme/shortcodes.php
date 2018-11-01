<?php
/**
 * Custom shortcodes
 *
 * @package ALiEMU
 */

namespace ALIEMU\Theme\Shortcodes;

use function ALIEMU\Theme\Tags\the_array_css;
use function ALIEMU\Utils\{
	gravatar_profile_data,
	unautop,
};

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
		],
		$atts
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
	// phpcs:ignore
	if ( isset( $_GET['course_id'] ) ) {
		$course_id = intval( $_GET['course_id'] );
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
		],
		$atts
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
	$atts     = shortcode_atts(
		[
			'title'   => '',
			'name'    => null,
			'email'   => null,
			'image'   => null,
			'twitter' => null,
			'align'   => null,
		],
		$atts,
		'person'
	);
	$atts_arr = $atts;
	$atts     = (object) $atts;
	$data     = $atts->email ? gravatar_profile_data( $atts->email ) : (object) [];

	// phpcs:disable WordPress.NamingConventions
	$name  = $atts->name ?? $data->displayName ?? '';
	$bio   = ( $content ? unautop( $content ) : null ) ?? $data->aboutMe ?? '';
	$title = $atts->title;
	$style = in_array( $atts->align, [ 'left', 'right' ], true )
		? "float: {$atts->align}; margin: 0 20px; margin-{$atts->align}: 0;"
		: '';
	$image = (
		is_file( ALIEMU_ROOT_PATH . "/assets/{$atts->image}" )
		? ALIEMU_ROOT_URI . "/assets/{$atts->image}"
		: null
	) ?? add_query_arg(
		[
			'size'    => 255,
			'default' => 'mp',
		],
		$data->thumbnailUrl ?? 'https://secure.gravatar.com/avatar/'
	);
	// phpcs:enable

	$accounts = [];
	foreach ( $data->accounts ?? [] as $account ) {
		if ( ! array_key_exists( $account->shortname, $accounts ) ) {
			$accounts[ $account->shortname ] = $account->url;
		}
	}
	if ( $atts->twitter ) {
		$accounts['twitter'] = "https://twitter.com/{$atts->twitter}";
	}

	ob_start();
	if ( ! $name ) {
		$atts_str = array_reduce(
			array_keys( $atts_arr ),
			function( $str, $k ) use ( $atts_arr ) {
				if ( $atts_arr[ $k ] ) {
					$str .= ' ' . $k . '=' . $atts_arr[ $k ];
				}
				return $str;
			},
			''
		);
		?>
			<code style="word-break: break-all;">
				[person <?php echo esc_html( $atts_str ); ?>]<?php echo esc_html( trim( $content ) ); ?>[/person]
			</code>
		<?php
	} else {
		?>
		<div class="person" style="<?php echo esc_attr( $style ); ?>">
			<div class="person__img">
				<img src="<?php echo esc_attr( $image ); ?>" alt="<?php echo esc_attr( $name . ' photo' ); ?>" />
			</div>
			<div class="person__meta">
				<div class="person__name"><?php echo esc_html( $name ); ?></div>
				<div class="person__title"><?php echo esc_html( $title ); ?></div>
				<div class="person__background"><?php echo do_shortcode( $bio ); ?></div>
			</div>
			<div class="person__social-media">
				<?php
				foreach ( $accounts as $site => $url ) :
					$svg = ALIEMU_ROOT_PATH . "/assets/icons/{$site}.svg";
					if ( is_file( $svg ) ) :
						?>
						<a
							href="<?php echo esc_url( $url ); ?>"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="<?php echo esc_attr( $site ); ?>"
						>
							<?php require $svg; ?>
						</a>
					<?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}
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
		],
		$atts
	);

	if ( is_null( $content ) ) {
		return '';
	}

	$content = unautop( $content );

	$css = [
		'grid-template-columns' => "repeat(auto-fit, minmax($width, 1fr))",
		'grid-gap'              => $gap,
	];

	ob_start();
	?>
		<div
			class="grid"
			style="<?php the_array_css( $css ); ?>"
		><?php echo do_shortcode( $content ); ?></div>
	<?php
	return trim( ob_get_clean() );
}
add_shortcode( 'grid', __NAMESPACE__ . '\grid' );
