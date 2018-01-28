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
		add_action( 'wp_enqueue_scripts', [ $this, 'init' ], 999 );
		add_action( 'after_setup_theme', [ $this, 'add_editor_styles' ] );
	}

	public function init() {
		global $current_user, $post;

		$fonts = add_query_arg(
			[
				'family' => 'Roboto+Mono:400,500,700|Roboto+Slab:300,400,700|Roboto:300,400,400i,500,700',
				'subset' => 'greek,greek-ext,latin-ext',
			], 'https://fonts.googleapis.com/css'
		);
		wp_register_style( 'aliemu-fonts', $fonts );
		wp_register_style( 'aliemu', ALIEMU_ROOT_URI . '/style.css', ALIEMU_VERSION );

		wp_register_script( 'educator-dashboard', ALIEMU_ROOT_URI . '/js/educator-dashboard.js', [], ALIEMU_VERSION, true );
		wp_register_script( 'mobile-nav-menu-helper', ALIEMU_ROOT_URI . '/js/mobile-nav-menu-helper.js', [ 'jquery' ], ALIEMU_VERSION );

		$this->delegate( $post, $current_user );
	}

	public function add_editor_styles() {
		add_editor_style( [ ALIEMU_ROOT_URI . '/css/editor.css' ] );
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
			[ 'mobile-nav-menu-helper' ],
			[ 'aliemu', 'aliemu-fonts' ],
		];
		// Always unload these.
		$unload = [
			[],
			[
				'learndash_quiz_front_css',
				'learndash_template_style_css',
				'learndash_style',
				'sfwd_front_css',
				'wpProQuiz_front_style',
			],
		];

		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
			array_push( $load[0], 'comment-reply' );
		}

		// Not an Ultimate Member page.
		if ( ! array_intersect( [ 'um-page-loggedin', 'um-page-loggedout', 'home', 'page-id-3432' ], get_body_class() ) ) {
			array_push( $unload[0], 'um_minified' );
			array_push( $unload[1], 'um_minified', 'um_recaptcha' );
		}

		switch ( $req ) {
			// Ultimate Member Pages / Tabs.
			case '/user/' . strtolower( $user->user_login ) . '/':
				switch ( $query ) {
					case 'profiletab=edudash':
						array_push( $load[0], 'educator-dashboard' );
						break;
					case 'profiletab=progress':
						array_push( $load[1], 'learndash_template_style_css' );
						break;
				}
				break;
		}

		$this->unload( ...$unload );
		$this->load( ...$load );
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
