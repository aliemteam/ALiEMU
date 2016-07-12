<?php
/**
 * Adds Educator Dashboard Functionality
 *
 * @since 1.0.0
 * @version 0.0.2
 * @author Chris Gaafary
 */

 /***********************************************************
  *     Ultmate Member Educator Dashboard Functionality     *
  ***********************************************************/

// Add Educator Dashboard Tab
add_filter('um_profile_tabs', 'edudash_tab', 1000);
function edudash_tab( $tabs ) {
    $meta = get_user_meta(get_current_user_id(), "residency_us_em", true);
    $hasEducatorAccess = !empty($meta) && current_user_can('educator_access');
    if (current_user_can('administrator') || $hasEducatorAccess) {
        $tabs['edudash'] = [
            'name' => 'Educator Dashboard',
            'icon' => 'um-faicon-bar-chart',
            'custom' => true
        ];
    }
    return $tabs;
}

 // Tell the tab what to display
 add_action('um_profile_content_edudash_default', 'um_profile_content_edudash_default');
 function um_profile_content_edudash_default() {
    require_once(dirname(__FILE__) . '/educator-dashboard/index.php');
 }

 ?>
