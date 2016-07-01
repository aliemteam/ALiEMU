<?php
/*
 * Plugin Name: ALiEMU Plugins
 * Plugin URI: http://www.aliemu.com
 * Description: Various pluggable addons for ALiEMU
 * Version: 1.0.3
 * Author: Chris Gaafary
 * Author URI: http://www.aliemu.com
 */


require_once (dirname(__FILE__) . '/inc/dashboards/dashboards.php');
require_once (dirname(__FILE__) . '/inc/shortcodes.php');
require_once (dirname(__FILE__) . '/inc/toastr-actions.php');


/**
 * Load stylesheets (highest priority)
 * @since 1.0.3
 */
function au_load_styles() {
    wp_enqueue_style('aliemu_master', plugins_url('/inc/styles/styles.css', __FILE__));
}
add_action( 'wp_enqueue_scripts', 'au_load_styles', 500 );

/**
 * Unloads wpProQuiz stylesheet, because it causes too many problems.
 * The developer used `!important` tags on every one of his selectors.
 * @since 1.0.3
 */
function au_unload_bad_styles() {
    wp_dequeue_style('wpProQuiz_front_style');
}
add_action( 'wp_enqueue_scripts', 'au_unload_bad_styles', 500 );

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
