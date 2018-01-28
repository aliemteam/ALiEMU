<?php
/**
 * Theme setup file
 *
 * @package ALiEMU
 */

/**
 * Sets the max content width for WordPress to be aware of
 *
 * @link https://codex.wordpress.org/Content_Width
 */
$content_width = 640;

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function aliemu_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on ALiEMU, use a find and replace
	 * to change 'aliemu' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'aliemu', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		[
			'menu-primary' => esc_html__( 'Primary Navigation', 'aliemu' ),
			'menu-footer'  => esc_html__( 'Footer Links', 'aliemu' ),
		]
	);

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support(
		'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background', apply_filters(
			'aliemu_custom_background_args', array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
	add_theme_support(
		'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'aliemu_setup' );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function aliemu_widgets_init() {
	register_sidebar(
		[
			'name'          => esc_html__( 'Sidebar', 'aliemu' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'aliemu' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		]
	);
}
add_action( 'widgets_init', 'aliemu_widgets_init' );

function aliemu_comments_args( $defaults ) {

	$user = wp_get_current_user();

	/**
	 * Comment field template.
	 */
	ob_start();
	?>
		<p class="comment-form-comment">
			<textarea
				id="comment"
				name="comment"
				aria-required="true"
				aria-labelledby="submit"
			></textarea>
		</p>
	<?php
	$comment_field = ob_get_clean();

	/**
	 * Logged in as template.
	 */
	ob_start();
	?>
		<p class="logged-in-as">
			<?php
				echo wp_kses(
					sprintf(
						// translators: $1: profile url, $2: user's display name.
						__( 'Commenting as <a href="%1$s">%2$s</a>', 'aliemu' ),
						esc_url( "/user/{$user->data->user_login}" ),
						$user->data->display_name
					),
					[
						'a' => [
							'href' => [],
						],
					]
				);
			?>
		</p>
	<?php
	$logged_in_as = ob_get_clean();

	$defaults = array_merge(
		$defaults, [
			'cancel_reply_before' => '',
			'cancel_reply_after'  => '',
			'comment_field'       => $comment_field,
			'logged_in_as'        => $logged_in_as,
			'title_reply'         => '',
			'title_reply_before'  => '',
			'title_reply_after'   => '',
		]
	);

	return $defaults;
}
add_filter( 'comment_form_defaults', 'aliemu_comments_args' );


function aliemu_soundcloud_embed( $html, $url ) {

	// We're only concerned with soundcloud embeds.
	if ( wp_parse_url( $url, PHP_URL_HOST ) !== 'soundcloud.com' ) {
		return $html;
	}

	preg_match( '/src="(.+?)"/', $html, $matches );
	parse_str( wp_parse_url( htmlspecialchars_decode( $matches[1] ), PHP_URL_QUERY ), $query_data );

	foreach ( [ 'visual', 'maxheight', 'maxwidth' ] as $idx ) {
		unset( $query_data[ $idx ] );
	}

	$query = http_build_query( $query_data, '', '&amp;' );

	ob_start();
	?>
		<iframe
			width="100%"
			height="166"
			scrolling="no"
			frameborder="no"
			allow="autoplay"
			src="https://w.soundcloud.com/player/?<?php echo esc_attr( $query ); ?>"
		></iframe>
	<?php

	return ob_get_clean();
}
add_filter( 'oembed_result', 'aliemu_soundcloud_embed', 10, 2 );

/**
 * Custom template tags for this theme.
 */
require ALIEMU_ROOT . '/templates/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require ALIEMU_ROOT . '/templates/template-functions.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require __DIR__ . '/jetpack.php';
}
