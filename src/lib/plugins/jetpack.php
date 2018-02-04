<?php
/**
 * Jetpack Compatibility File
 *
 * @link https://jetpack.com/
 *
 * @package ALiEMU
 */

namespace ALIEMU\Plugins;

if ( defined( 'JETPACK__VERSION' ) ) :

	/**
	 * Jetpack setup function.
	 *
	 * See: https://jetpack.com/support/responsive-videos/
	 * See: https://jetpack.com/support/content-options/
	 */
	function jetpack_setup() {
		// Add theme support for Responsive Videos.
		add_theme_support( 'jetpack-responsive-videos' );

		// Add theme support for Content Options.
		add_theme_support(
			'jetpack-content-options', [
				'post-details'    => [
					'stylesheet' => 'aliemu',
					'date'       => '.posted-on',
					'categories' => '.cat-links',
					'tags'       => '.tags-links',
					'author'     => '.byline',
					'comment'    => '.comments-link',
				],
				'featured-images' => [
					'archive' => true,
					'post'    => true,
					'page'    => true,
				],
			]
		);
	}
	add_action( 'after_setup_theme', __NAMESPACE__ . '\jetpack_setup' );

endif;
