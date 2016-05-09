<?php
/*
 * Plugin Name: ALiEMU Plugins
 * Plugin URI: http://www.aliemu.com
 * Description: Various pluggable addons for ALiEMU
 * Version: 1.0.3
 * Author: Chris Gaafary
 * Author URI: http://www.aliemu.com
 */

require_once (dirname(__FILE__) . '/inc/learndash-course-grid.php');
require_once (dirname(__FILE__) . '/inc/meta-fields.php');
require_once (dirname(__FILE__) . '/inc/dashboards/dashboards.php');
require_once (dirname(__FILE__) . '/inc/shortcodes.php');
require_once (dirname(__FILE__) . '/inc/toastr-actions.php');

/**
 * Adds the 'educator_access' role to WordPress roles.
 *
 * @author Chris Gaafary
 * @since 1.0.2
 */
function add_roles_on_plugin_activation() {
  add_role(
    'educator_access',
    __( 'Educator Access' ),
    array(
        'read'         => true,  // true allows this capability
        'edit_posts'   => false,
        'delete_posts' => false, // Use false to explicitly deny
    )
  );

}
register_activation_hook( __FILE__, 'add_roles_on_plugin_activation');
