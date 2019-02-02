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
		'aliemu-catalog'   => 'AU_Catalog',
		'aliemu-dashboard' => 'AU_Dashboard',
		'aliemu-feedback'  => 'AU_Feedback',
	];

	/**
	 * Constructor. Initializes WordPress hooks.
	 */
	public function __construct() {
		add_action( 'after_setup_theme', [ $this, 'add_editor_styles' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 999 );
		add_action( 'wp_head', [ $this, 'print_globals' ] );
	}

	/**
	 * Prints global variables needed in most or all pages in the head
	 */
	public function print_globals() : void {
		// phpcs:disable
		?>
			<script>
				var AU_API = {
					nonce: '<?php echo esc_html( wp_create_nonce( 'wp_rest' ) ); ?>',
					url: '<?php echo esc_url_raw( rest_url() ); ?>',
				};
				var AU_AJAX = {
					nonce: '<?php echo esc_html( wp_create_nonce( 'wp_ajax' ) ); ?>',
					url: '<?php echo admin_url( 'admin-ajax.php', 'relative' ); ?>',
				};
			</script>
		<?php
		// phpcs:enable
	}

	/**
	 * Registers all scripts and styles with WordPress and then triggers the
	 * delegation process.
	 */
	public function register() : void {
		wp_register_style(
			'aliemu-fonts',
			add_query_arg(
				[
					'family' => join(
						'|',
						[
							'Roboto+Slab:400,700',
							'IBM+Plex+Mono:400,500,700',
							'IBM+Plex+Sans:400,400i,500,600',
							'Material+Icons',
						]
					),
					'subset' => 'greek,greek-ext,latin-ext',
				],
				'https://fonts.googleapis.com/css'
			),
			[],
			filemtime( get_stylesheet_directory( 'style.css' ) )
		);
		wp_register_style( 'aliemu', get_stylesheet_uri(), [ 'aliemu-fonts', 'dashicons' ], filemtime( get_stylesheet_directory( 'style.css' ) ) );

		foreach ( glob( ALIEMU_ROOT_PATH . '/js/*.css' ) as $stylesheet ) {
			$style = pathinfo( $stylesheet );
			wp_register_style( 'aliemu-' . $style['filename'], ALIEMU_ROOT_URI . '/js/' . $style['basename'], [], filemtime( $stylesheet ) );
		}

		// Header scripts.
		wp_register_script( 'mobile-nav-menu-helper', ALIEMU_ROOT_URI . '/js/mobile-nav-menu-helper.js', [ 'jquery' ], filemtime( ALIEMU_ROOT_PATH . '/js/mobile-nav-menu-helper.js' ), false );

		// Footer scripts.
		wp_register_script( 'aliemu-catalog', ALIEMU_ROOT_URI . '/js/catalog.js', [ 'jquery' ], filemtime( ALIEMU_ROOT_PATH . '/js/catalog.js' ), true );
		wp_register_script( 'aliemu-dashboard', ALIEMU_ROOT_URI . '/js/dashboard.js', [ 'jquery' ], filemtime( ALIEMU_ROOT_PATH . '/js/dashboard.js' ), true );
		wp_register_script( 'aliemu-feedback', ALIEMU_ROOT_URI . '/js/feedback.js', [ 'jquery', 'wp-util' ], filemtime( ALIEMU_ROOT_PATH . '/js/feedback.js' ), true );
		wp_register_script( 'aliemu-landing-page', ALIEMU_ROOT_URI . '/js/landing-page.js', [], filemtime( ALIEMU_ROOT_PATH . '/js/landing-page.js' ), true );
		wp_register_script( 'aliemu-login', ALIEMU_ROOT_URI . '/js/login.js', [ 'jquery', 'wp-util' ], filemtime( ALIEMU_ROOT_PATH . '/js/login.js' ), true );

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
	private function remove_junk() : void {
		$filter_func = function ( string $item ) : bool {
			return preg_match( '/^(?:um[-_]|learndash|sfwd|select2)/', $item );
		};
		wp_dequeue_style( array_filter( wp_styles()->queue, $filter_func ) );
		wp_dequeue_script( array_filter( wp_scripts()->queue, $filter_func ) );
	}

	/**
	 * Master delegator for the script loader.
	 *
	 * Loads/Unloads scripts and styles based on the current page.
	 */
	private function delegate() : void {
		// TODO: This is temporary until we can get forms styled better.
		if ( ! is_page( 'account' ) ) {
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

		if ( is_front_page() ) {
			array_push( $load->scripts, 'aliemu-landing-page' );
			array_push( $load->styles, 'aliemu-landing-page' );
		}

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

		if ( is_page( 'feedback' ) ) {
			array_push( $load->scripts, 'aliemu-feedback' );
			array_push( $load->styles, 'aliemu-feedback' );
		}

		if ( is_page( 'login' ) ) {
			array_push( $load->scripts, 'aliemu-login' );
			array_push( $load->styles, 'aliemu-login' );
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
