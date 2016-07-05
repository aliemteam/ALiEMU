<?php

/**
 * Globals
 */
$ROOT_URI = get_stylesheet_directory_uri();

/**
 * Master function to enqueue all scripts / styles
 * @return void
 */
function theme_enqueue_scripts() {
    global $current_user, $ROOT_URI;
    $REQUEST_URI = $_SERVER["REQUEST_URI"];
    $QUERY_STRING = $_SERVER['QUERY_STRING'];

    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', $ROOT_URI  . '/style.css', array('parent-style'));

    wp_enqueue_script('nav-helper', $ROOT_URI . '/js/nav-helper.js', false, false, true);
    wp_dequeue_style('wpProQuiz_front_style');

    // Only on home page
    if (is_front_page() || is_page('faculty-start')) {
        wp_enqueue_script('particlesjs', 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js');
        wp_enqueue_script('particles-home', $ROOT_URI . '/js/particles-home.js', array('particlesjs'), false, true);
    }

    if (is_page('about')) {
        wp_enqueue_style('bootstrap-nav-css', $ROOT_URI .'/styles/vendor/side-nav.css');
        wp_enqueue_script('about-nav', $ROOT_URI . '/js/about-nav.js', array('jquery'), false, true);
    }

    // Only on "Profile" pages
    if ($REQUEST_URI === "/user/$current_user->user_login/") {
        wp_enqueue_script('toastr', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js', false, '2.1.2', true);
        wp_enqueue_style('toastr-css', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css', false, '2.1.2');
    }

    // Only on "Educator Dashboard" page
    if ($QUERY_STRING === 'profiletab=edudash') {
        wp_enqueue_script('EducatorDashboard', $ROOT_URI . '/features/dashboards/educator-dashboard/EducatorDashboard.js', false, false, true);
    }

}
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');

require_once(dirname(__FILE__) . '/features/index.php');
require_once(dirname(__FILE__) . '/functions/index.php');
