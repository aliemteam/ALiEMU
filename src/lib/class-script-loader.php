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
		'aliemu-catalog'            => 'AU_Catalog',
		'aliemu-dashboard'          => 'AU_Dashboard',
		'aliemu-educator-dashboard' => 'AU_EducatorData',
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
		wp_register_style(
			'aliemu-fonts', add_query_arg(
				[
					'family' => 'Roboto+Mono:400,500,700|Roboto+Slab:300,400,700|Roboto:300,400,400i,500,700',
					'subset' => 'greek,greek-ext,latin-ext',
				], 'https://fonts.googleapis.com/css'
			)
		);
		wp_register_style( 'aliemu', get_stylesheet_uri(), [ 'aliemu-fonts', 'dashicons' ] );

		foreach ( glob( ALIEMU_ROOT_PATH . '/js/*.css' ) as $stylesheet ) {
			$style = pathinfo( $stylesheet );
			wp_register_style( 'aliemu-' . $style['filename'], ALIEMU_ROOT_URI . '/js/' . $style['basename'], [], hash_file( 'md5', $stylesheet ) );
		}

		wp_register_script( 'aliemu-catalog', ALIEMU_ROOT_URI . '/js/catalog.js', [ 'wp-api' ], ALIEMU_VERSION, true );
		wp_register_script( 'aliemu-dashboard', ALIEMU_ROOT_URI . '/js/dashboard.js', [ 'wp-api' ], ALIEMU_VERSION, true );
		wp_register_script( 'aliemu-educator-dashboard', ALIEMU_ROOT_URI . '/js/educator-dashboard.js', [], ALIEMU_VERSION, true );
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
	 * Removes unnecessary garbage styles/scripts unless they're actually needed.
	 */
	private function remove_junk(): void {
		$styles  = wp_styles();
		$scripts = wp_scripts();
		foreach ( $styles->queue as $style ) {
			if ( ( ! is_ultimatemember() && ! is_front_page() || is_page( 'user' ) ) && strncmp( $style, 'um_', 3 ) === 0 ) {
				wp_dequeue_style( $style );
			}
			if ( strncmp( $style, 'learndash_', 10 ) === 0 || strncmp( $style, 'sfwd_', 5 ) === 0 ) {
				wp_dequeue_style( $style );
			}
		}

		foreach ( $scripts->queue as $script ) {
			if ( ( ! is_ultimatemember() && ! is_front_page() || is_page( 'user' ) ) && strncmp( $script, 'um_', 3 ) === 0 ) {
				wp_dequeue_script( $script );
			}
			if ( strncmp( $script, 'learndash_', 10 ) === 0 || strncmp( $script, 'sfwd_', 5 ) === 0 ) {
				wp_dequeue_script( $script );
			}
		}
	}

	/**
	 * Master delegator for the script loader.
	 *
	 * Loads/Unloads scripts and styles based on the current page.
	 */
	private function delegate() : void {
		// TODO: This is temporary until we can get forms styled better.
		if ( ! is_page( 'faculty-start' ) ) {
			$this->remove_junk();
		}

		// Always load these.
		$load = (object) [
			'scripts' => [ 'mobile-nav-menu-helper' ],
			'styles'  => [ 'aliemu', 'aliemu-fonts' ],
		];
		// Always unload these.
		$unload = (object) [
			'scripts' => [],
			'styles'  => [],
		];

		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
			array_push( $load->scripts, 'comment-reply' );
		}

		if ( is_post_type_archive( 'sfwd-courses' ) ) {
			array_push( $load->scripts, 'aliemu-catalog' );
			array_push( $load->styles, 'aliemu-catalog' );
		}

		if ( is_page( 'user' ) ) {
			array_push( $load->scripts, 'aliemu-dashboard' );
			array_push( $load->styles, 'aliemu-dashboard' );
		}

		switch ( $this->path[0] ?? '' ) {
			case 'user':
				switch ( $this->query['profiletab'] ?? '' ) {
					case 'educator_dashboard':
						array_push( $load->scripts, 'aliemu-educator-dashboard' );
						array_push( $load->styles, 'aliemu-educator-dashboard' );
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
		$scriptname = preg_replace( '/^aliemu-/', '', $script );
		if ( file_exists( __DIR__ . "/localizers/$scriptname.php" ) ) {
			require_once __DIR__ . "/localizers/$scriptname.php";
		} else {
			wp_die( 'Could not locate required localizer script' );
		}
		wp_localize_script( $script, $varname, localize() );
	}
}

new Script_Loader();
