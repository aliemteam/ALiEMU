<?php

/**
 * Remove emojis
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');


/**
 * Master function to enqueue all scripts / styles
 * @return void
 */
function theme_enqueue_scripts() {
    wp_enqueue_style('parent-style', get_template_directory_uri().'/style.css');
    wp_enqueue_script('nav-helper', get_stylesheet_directory_uri().'/js/nav-helper.js', false, false, true);

    // Only on home page
    if (is_front_page() || is_page('faculty-start')) {
        wp_enqueue_script('particlesjs', 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js');
        wp_enqueue_script('particles-home', get_stylesheet_directory_uri().'/js/particles-home.js', array('particlesjs'), false, true);
    }

    if (is_page('about')) {
        wp_enqueue_style('bootstrap-nav-css', get_stylesheet_directory_uri().'/side-nav.css');
        wp_enqueue_script('about-nav', get_stylesheet_directory_uri().'/js/about-nav.js', array('jquery'), false, true);
    }
}
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');

require_once(dirname(__FILE__) . '/functions/divi.php');
require_once(dirname(__FILE__) . '/functions/learndash.php');
require_once(dirname(__FILE__) . '/functions/plugins.php');
require_once(dirname(__FILE__) . '/functions/slack.php');
