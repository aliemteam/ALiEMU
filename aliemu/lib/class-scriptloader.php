<?php

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Master class to load and unload all scripts / styles
 */
class ScriptLoader {
	private $localized;

	public function __construct() {
		$this->prepare_localizers();
		add_action( 'admin_enqueue_scripts', [ $this, 'init_admin' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'init' ], 999 );
	}

	public function init_admin( $hook ) {
		if ( in_array( $hook, [ 'post-new.php', 'post.php', 'page-new.php', 'page.php' ], true ) ) {
			wp_enqueue_style( 'aliem_admin_style', ROOT_URI . '/admin.css' );
		}
	}

	public function init() {
		global $current_user, $post;

		wp_register_script( 'about-nav', ROOT_URI . '/vendor/about-nav.js', [ 'jquery' ], false, true );
		wp_register_script( 'educator-dashboard', ROOT_URI . '/js/educator-dashboard.js', [], ALIEMU_VERSION, true );
		wp_register_script( 'nav-helper', ROOT_URI . '/js/nav-helper.js', [], false, true );
		wp_register_script( 'particlesjs', 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js', false, true );
		wp_register_script( 'particles', ROOT_URI . '/js/particles.js', [ 'particlesjs' ], false, true );

		wp_register_style( 'roboto-font', 'https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700&amp;subset=cyrillic,greek' );
		wp_register_style( 'bootstrap-nav-css', ROOT_URI . '/vendor/side-nav.css' );
		wp_register_style( 'aliemu', ROOT_URI . '/style.css', ALIEMU_VERSION );

		$this->delegate( $post, $current_user );
	}

	private function prepare_localizers() {
		$this->localized = [
			'educator-dashboard' => [ 'AU_EducatorData', 'educator_dashboard' ],
		];
		foreach ( glob( __DIR__ . '/localizers/*' ) as $localizer ) {
			require_once $localizer;
		}
	}

	/**
	 * Master delegator for the script loader.
	 *
	 * Loads/Unloads scripts and styles based on the current page.
	 *
	 * @param  string $req   Server request string.
	 * @param  object $user  Current WordPress user.
	 * @return void
	 */
	private function delegate( $post, $user ) {
		$req   = strtok( $_SERVER['REQUEST_URI'], '?' );
		$query = $_SERVER['QUERY_STRING'];

		// Always load these.
		$load = [
			[ 'nav-helper' ],
			[ 'aliemu', 'roboto-font' ],
		];
		// Always unload these.
		$unload = [
			[],
			[
				'learndash_quiz_front_css',
				'learndash_style',
				// 'learndash_template_style_css',
				'sfwd_front_css',
				'wpProQuiz_front_style',
			],
		];

		// Not an Ultimate Member page.
		if ( ! array_intersect( [ 'um-page-loggedin', 'um-page-loggedout', 'home', 'page-id-3432' ], get_body_class() ) ) {
			array_push( $unload[0], 'um_minified' );
			array_push( $unload[1], 'um_minified', 'um_recaptcha' );
		}

		switch ( $req ) {
			case '/':
			case '/faculty-start/':
				array_push( $load[0], 'particlesjs', 'particles' );
				break;
			case '/about/':
				array_push( $load[0], 'about-nav' );
				array_push( $load[1], 'bootstrap-nav-css' );
				break;
			// Ultimate Member Pages / Tabs.
			case '/user/' . strtolower( $user->user_login ) . '/':
				switch ( $query ) {
					case 'profiletab=edudash':
						array_push( $load[0], 'educator-dashboard' );
						break;
				}
				break;
		}

		$this->load( ...$load );
		$this->unload( ...$unload );
		$this->localize( $load[0] );
	}

	/**
	 * Helper function that loads scripts/styles from an array of handles.
	 *
	 * @param  array $scripts Array of script handles.
	 * @param  array $styles  Array of style handles.
	 * @return void
	 */
	private function load( $scripts, $styles ) {
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
	 * @param  array $scripts Array of script handles.
	 * @param  array $styles  Array of style handles.
	 * @return void
	 */
	private function unload( $scripts, $styles ) {
		foreach ( array_unique( $scripts ) as $script ) {
			wp_dequeue_script( $script );
		}
		foreach ( array_unique( $styles ) as $style ) {
			wp_dequeue_style( $style );
		}
	}

	/**
	 * Helper function that localizes any scripts that require localization
	 * by calling its associated "localizer" function.
	 *
	 * @param array $scripts  Array of script handles.
	 * @return void
	 */
	private function localize( $scripts ) {
		foreach ( array_unique( $scripts ) as $script ) {
			if ( array_key_exists( $script, $this->localized ) ) {
				$fname = $this->localized[ $script ][1];
				$func  = "\ALIEMU\Localizers\\$fname";
				wp_localize_script( $script, $this->localized[ $script ][0], $func() );
			}
		}
	}
}

new ScriptLoader();
