<?php
/**
 * Adds Educator Dashboard Functionality
 *
 * @since 1.0.0
 * @version 0.0.2
 * @author Chris Gaafary
 */

 /***********************************************************
  *      Ultimate Member Course Dashboard Profile Tab       *
  ***********************************************************/

 // Add a Course Dashboard tab to show LeardDash Profile
 add_filter('um_profile_tabs', 'coursedash_tab', 500);
 function coursedash_tab( $tabs ) {
     $tabs['coursedash'] = array(
         'name' => 'Course Dashboard',
         'icon' => 'um-faicon-list-alt',
         'custom' => true
     );
     return $tabs;
 }

 // Tell the tab to display LearnDash Profile
 add_action('um_profile_content_coursedash_default', 'um_profile_content_coursedash_default');
 function um_profile_content_coursedash_default( $args ) {
     echo do_shortcode('[ld_profile]');
 }


 /***********************************************************
  *     Ultmate Member Educator Dashboard Functionality     *
  ***********************************************************/

 // Add Educator Dashboard Tab
 add_filter('um_profile_tabs', 'edudash_tab', 1000);
 function edudash_tab( $tabs ) {
    $user_has_affiliation = get_user_meta(get_current_user_id(), "residency_us_em", true);
    if (current_user_can('administrator') ||
        (current_user_can('educator_access') && $user_has_affiliation) ) {
        $tabs['edudash'] = array(
                            'name' => 'Educator Dashboard',
                            'icon' => 'um-faicon-bar-chart',
                            'custom' => true
                        );
    return $tabs;
    }

    return $tabs;

 }

// Conditionally load the JS
add_action('wp_enqueue_scripts', 'load_admin_dashboard_js');
function load_admin_dashboard_js() {
    if ($_SERVER['QUERY_STRING'] === 'profiletab=edudash') {
        wp_enqueue_script(
            'EducatorDashboard',
            plugins_url('educator-dashboard/EducatorDashboard.js', __FILE__),
            array('jquery', 'jquery-ui-datepicker'),
            '',
            true
        );
    }
}


 // Tell the tab what to display
 add_action('um_profile_content_edudash_default', 'um_profile_content_edudash_default');
 function um_profile_content_edudash_default( $args ) {
    include_once( plugin_dir_path( __FILE__ ) . './educator-dashboard/educator-dashboard.php' );
 }

 ?>
