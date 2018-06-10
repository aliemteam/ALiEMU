<?php
/**
 * Functionality Related to Ultimate Member
 *
 * @package ALiEMU
 */

namespace ALIEMU\Plugins\UltimateMember;

defined( 'ABSPATH' ) || exit;

if ( defined( 'ultimatemember_version' ) ) :

	/**
	 * Adds additional tabs to the Ultimate Member user profile page.
	 *
	 * @param mixed[] $tabs {
	 *      The default tabs.
	 *      @type mixed[] $key {
	 *          Single tab.
	 *          @type string $name The tabs rendered text.
	 *          @type string $icon The tabs rendered icon ID.
	 *          @type bool $custom This should always be set to true.
	 *      }
	 * }
	 *
	 * @return mixed[] The filtered tabs.
	 */
	function profile_tabs( $tabs ) : array {
		// Course Progress Tab -- Show for all users.
		$tabs['user_progress'] = [
			'name'   => 'My Progress',
			'icon'   => 'um-faicon-bar-chart',
			'custom' => true,
		];

		// Educator Dashboard Tab -- Only show if user has "educator_access" role.
		if ( current_user_can( 'administrator' ) || current_user_can( 'educator_access' ) ) {
			$tabs['educator_dashboard'] = [
				'name'   => 'Educator Dashboard',
				'icon'   => 'um-faicon-bar-chart',
				'custom' => true,
			];
		}

		return $tabs;
	}
	add_filter( 'um_profile_tabs', __NAMESPACE__ . '\profile_tabs', 1000 );

	/**
	 * Educator dashboard content.
	 */
	function educator_dashboard_content() {
		?>
			<div id="educator-dashboard"></div>
		<?php
	}
	add_action( 'um_profile_content_educator_dashboard', __NAMESPACE__ . '\educator_dashboard_content' );

	/**
	 * User course progress content.
	 */
	function user_progress_content() {
		echo do_shortcode( '[ld_profile]' );
	}
	add_action( 'um_profile_content_user_progress', __NAMESPACE__ . '\user_progress_content' );

endif;
