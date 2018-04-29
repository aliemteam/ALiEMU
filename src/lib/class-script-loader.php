<?php
/**
 * Responsible for loading and unloading all scripts/styles.
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Master class to load and unload all scripts / styles.
 *
 * Along with loading scripts, this class is also responsible for injecting, or
 * "localizing" scripts with the data that they depend on.
 */
class Script_Loader {
	/**
	 * Describes the scripts that need localization.
	 *
	 * Array key = script handle name.
	 * Array value = global JS variable name.
	 *
	 * @var array $localized
	 */
	private static $localized = [
		'catalog'            => 'AU_Catalog',
		'educator-dashboard' => 'AU_EducatorData',
	];

	/**
	 * The current URL path split by `/`.
	 *
	 * @var string[] $path
	 */
	private $path;

	/**
	 * The current URL query (if it exists).
	 *
	 * @var string[] $query Key-value array of query params.
	 */
	private $query;

	/**
	 * Constructor. Initializes WordPress hooks.
	 */
	public function __construct() {
		$url = wp_parse_url(
			isset( $_SERVER['REQUEST_URI'] ) // Input var okay.
			? wp_unslash( $_SERVER['REQUEST_URI'] ) // Input var okay; sanitization okay.
			: ''
		);

		// `array_values` is important. Without it, keys will be preserved.
		$this->path  = array_values(
			array_filter(
				explode( '/', $url['path'] )
			)
		);
		$this->query = [];

		if ( ! empty( $url['query'] ) ) {
			parse_str( $url['query'], $this->query );
		}

		add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 999 );
		add_action( 'after_setup_theme', [ $this, 'add_editor_styles' ] );
	}

	/**
	 * Registers all scripts and styles with WordPress and then triggers the
	 * delegation process.
	 */
	public function register() : void {
		wp_register_style( 'aliemu', get_stylesheet_uri() );
		wp_register_style(
			'aliemu-fonts', add_query_arg(
				[
					'family' => 'Roboto+Mono:400,500,700|Roboto+Slab:300,400,700|Roboto:300,400,400i,500,700',
					'subset' => 'greek,greek-ext,latin-ext',
				], 'https://fonts.googleapis.com/css'
			)
		);

		foreach ( glob( ALIEMU_ROOT_PATH . '/js/*.css' ) as $stylesheet ) {
			$style = pathinfo( $stylesheet );
			wp_register_style( $style['filename'], ALIEMU_ROOT_URI . '/js/' . $style['basename'], [], hash_file( 'md5', $stylesheet ) );
		}

		wp_register_script( 'catalog', ALIEMU_ROOT_URI . '/js/catalog.js', [ 'wp-api' ], ALIEMU_VERSION, true );
		wp_register_script( 'educator-dashboard', ALIEMU_ROOT_URI . '/js/educator-dashboard.js', [], ALIEMU_VERSION, true );
		wp_register_script( 'mobile-nav-menu-helper', ALIEMU_ROOT_URI . '/js/mobile-nav-menu-helper.js', [ 'jquery' ], ALIEMU_VERSION );

		$this->delegate();
	}

	/**
	 * Adds custom stylesheet to the post editor.
	 */
	public function add_editor_styles() : void {
		add_editor_style( [ ALIEMU_ROOT_URI . '/css/editor.css' ] );
	}

	/**
	 * Master delegator for the script loader.
	 *
	 * Loads/Unloads scripts and styles based on the current page.
	 */
	private function delegate() : void {
		// Always load these.
		$load = (object) [
			'scripts' => [ 'mobile-nav-menu-helper' ],
			'styles'  => [ 'aliemu', 'aliemu-fonts' ],
		];
		// Always unload these.
		$unload = (object) [
			'scripts' => [],
			'styles'  => [
				'learndash_quiz_front_css',
				'learndash_template_style_css',
				'learndash_style',
				'sfwd_front_css',
				'wpProQuiz_front_style',
			],
		];

		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
			array_push( $load->scripts, 'comment-reply' );
		}

		// Not an Ultimate Member page.
		if ( ! array_intersect( [ 'um-page-loggedin', 'um-page-loggedout', 'home', 'page-id-3432' ], get_body_class() ) ) {
			array_push( $unload->scripts, 'um_minified' );
			array_push( $unload->styles, 'um_minified', 'um_recaptcha' );
		}

		if ( is_post_type_archive( 'sfwd-courses' ) ) {
			array_push( $load->scripts, 'catalog' );
			array_push( $load->styles, 'catalog' );
		}

		switch ( $this->path[0] ?? '' ) {
			case 'user':
				switch ( $this->query['profiletab'] ?? '' ) {
					case 'educator_dashboard':
						array_push( $load->scripts, 'educator-dashboard' );
						array_push( $load->styles, 'educator-dashboard' );
						break 2;
					case 'user_progress':
						array_push( $load->styles, 'learndash_template_style_css' );
						break 2;
				}
				break;
		}

		$this->unload( $unload->scripts, $unload->styles );
		$this->load( $load->scripts, $load->styles );

		foreach ( array_intersect( array_unique( $load->scripts ), array_keys( self::$localized ) ) as $script ) {
			$this->localize( $script, self::$localized[ $script ] );
		}
	}

	/**
	 * Helper function that loads scripts/styles from an array of handles.
	 *
	 * @param string[] $scripts Array of script handles.
	 * @param string[] $styles  Array of style handles.
	 */
	private function load( $scripts, $styles ) : void {
		foreach ( array_reverse( array_unique( $styles ) ) as $style ) {
			wp_enqueue_style( $style );
		}
		foreach ( array_reverse( array_unique( $scripts ) ) as $script ) {
			wp_enqueue_script( $script );
		}
	}

	/**
	 * Helper function that unloads scripts/styles from an array of handles.
	 *
	 * @param string[] $scripts Array of script handles.
	 * @param string[] $styles  Array of style handles.
	 */
	private function unload( $scripts, $styles ) : void {
		foreach ( array_unique( $scripts ) as $script ) {
			wp_dequeue_script( $script );
		}
		foreach ( array_unique( $styles ) as $style ) {
			wp_dequeue_style( $style );
		}
	}

	/**
	 * Helper function that localizes any scripts that require localization
	 * by calling its associated "localize" function.
	 *
	 * @param string $script Handle of script to be localized.
	 * @param string $varname Name of the global JS variable to set.
	 */
	private function localize( $script, $varname ) : void {
		require_once __DIR__ . "/localizers/$script.php";
		wp_localize_script( $script, $varname, localize() );
	}
}

new Script_Loader();
