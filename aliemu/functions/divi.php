<?php

if (!defined('ABSPATH')) exit(1);

/**
 * Adds class 'et_full_width_page' to all pages that aren't category capsules
 *   to remove the sidebar.
 * @param  array[string] $classes  Array of classes
 * @return array[string] Array of classes
 */
function remove_sidebar_when_unneeded($classes) {
    global $post;
    if (!$post) return $classes;

    $category = get_the_category($post->ID);
    if (!$category) return $classes;

    if ($category[0]->slug !== 'capsules') {
        $classes[] = 'et_full_width_page';
    }

    return $classes;
}
add_filter('body_class', 'remove_sidebar_when_unneeded');

// Stub unnecessary Divi functions
function et_gf_attach_font() { return null; }
function et_gf_enqueue_fonts() { return null; }
function et_get_google_fonts() { return null; }
function et_divi_fonts_url() { return null; }
function et_sync_custom_css_options() { return null; }

function remove_divi_actions() {
    remove_action('wp_head', 'et_divi_add_customizer_css');
    remove_action( 'wp_head', ['ET_Core_PageResource', 'head_late_output_cb'], 103 );
}
add_action('after_setup_theme', 'remove_divi_actions', 999);
