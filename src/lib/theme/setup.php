<?php
/**
 * Theme setup file
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

use function ALIEMU\Utils\slack_message;

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function setup() : void {
	/**
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on ALiEMU, use a find and replace
	 * to change 'aliemu' to the name of your theme in all the template files.
	 */
	load_theme_textdomain( 'aliemu', get_template_directory() . '/languages' );

	/**
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/**
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
	 */
	add_theme_support( 'post-thumbnails' );

	/**
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support(
		'html5',
		[
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		]
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		[
			'menu-primary' => esc_html__( 'Primary Navigation', 'aliemu' ),
			'menu-footer'  => esc_html__( 'Footer Links', 'aliemu' ),
		]
	);
}
add_action( 'after_setup_theme', __NAMESPACE__ . '\setup' );

/**
 * Limit max menu depth in admin panel to 2
 *
 * @param string $hook  The current admin page being loaded.
 */
function limit_nav_menu_depth( $hook ) {
	if ( 'nav-menus.php' === $hook ) {
		wp_add_inline_script( 'nav-menu', 'wpNavMenu.options.globalMaxDepth = 1;', 'after' );
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\limit_nav_menu_depth' );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function widgets_init() : void {
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
add_action( 'widgets_init', __NAMESPACE__ . '\widgets_init' );

/**
 * Customizes the comment form.
 *
 * @param mixed[] $defaults The default comment form arguments.
 */
function comments_args( $defaults ) : array {

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
		$defaults,
		[
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
add_filter( 'comment_form_defaults', __NAMESPACE__ . '\comments_args' );

/**
 * Filters out unnecessary classes from posts.
 *
 * Specifically, we're removing 'hentry' because this isn't a tradional "blog"
 * so posts/pages should not be treated as such.
 *
 * @param string[] $classes The complete list of classes.
 * @param string[] $class A subset of custom classes added.
 * @param int      $id The post id of the calling post.
 */
function filter_post_classes( array $classes, array $class, int $id ) : array {
	$filtered = array_values(
		array_filter(
			$classes,
			function ( string $cls ) : bool {
				return ! in_array( $cls, [ 'hentry' ], true );
			}
		)
	);
	return $filtered;
}
add_filter( 'post_class', __NAMESPACE__ . '\filter_post_classes', 10, 3 );

/**
 * Adjusts the scheme of avatar URLs to enforce https.
 *
 * @param array $args Arguments passed to get_avatar_data(), after processing.
 */
function avatars_via_https( array $args ) : array {
	$args['scheme'] = 'https';
	return $args;
}
add_filter( 'pre_get_avatar_data', __NAMESPACE__ . '\avatars_via_https' );

/**
 * Routes all comments to Slack.
 *
 * @param  string $comment_id The comment ID.
 */
function slack_comment( $comment_id ) {
	$comment  = get_comment( $comment_id );
	$post     = get_post( $comment->comment_post_ID );
	$category = get_the_category( $post->ID )[0]->slug;

	if ( ! in_array( $category, [ 'capsules', 'air', 'air-pro', 'in-training-exam-prep' ], true ) ) {
		$category = 'aliemu';
	}

	slack_message(
		"$category/messages/comments",
		[
			'name'     => $comment->comment_author,
			'email'    => $comment->comment_author_email,
			'content'  => $comment->comment_content,
			'postUrl'  => $post->guid,
			'postName' => $post->post_title,
		]
	);
}
add_action( 'comment_post', __NAMESPACE__ . '\slack_comment' );
