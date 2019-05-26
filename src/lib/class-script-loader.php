<?php
/**
 * Responsible for loading and unloading all scripts/styles.
 *
 * @package ALiEMU
 */

namespace ALIEMU;

use function ALIEMU\Utils\{
	register_script,
};

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
				var AU_AJAX_NONCE = '<?php echo esc_html( wp_create_nonce( 'wp_ajax' ) ); ?>';
				var AU_API_NONCE = '<?php echo esc_html( wp_create_nonce( 'wp_rest' ) ); ?>';
				var AU_NONCE = '<?php echo esc_html( wp_create_nonce( 'aliemu' ) ); ?>';
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
			filemtime( ALIEMU_ROOT_PATH . '/style.css' ),
		);
		wp_register_style(
			'aliemu',
			get_stylesheet_uri(),
			[
				'aliemu-fonts',
				'dashicons',
			],
			filemtime( ALIEMU_ROOT_PATH . '/style.css' ),
		);

		// Header scripts.
		register_script( 'mobile-nav-menu-helper', false );

		// Footer scripts.
		register_script( 'catalog' );
		register_script( 'dashboard' );
		register_script( 'feedback' );
		register_script( 'landing-page' );
		register_script( 'login' );

		$this->delegate();
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
			'scripts' => [ 'aliemu-mobile-nav-menu-helper' ],
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

		if ( is_singular( 'sfwd-quiz' ) ) {
			// add quiz button fix here
		}

		if ( is_post_type_archive( 'sfwd-courses' ) ) {
			array_push( $load->scripts, 'aliemu-catalog' );
			array_push( $load->styles, 'aliemu-catalog' );
		} elseif ( is_front_page() ) {
			array_push( $load->scripts, 'aliemu-landing-page' );
			array_push( $load->styles, 'aliemu-landing-page' );
		} elseif ( is_page( 'user' ) ) {
			array_push( $load->scripts, 'aliemu-dashboard' );
			array_push( $load->styles, 'aliemu-dashboard' );
		} elseif ( is_page( 'feedback' ) ) {
			array_push( $load->scripts, 'aliemu-feedback' );
			array_push( $load->styles, 'aliemu-feedback' );
		} elseif ( is_page( 'login' ) ) {
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
