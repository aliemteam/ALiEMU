<?php

if (!defined('ABSPATH')) exit(1);

function init_custom_tabs($tabs) {
    $meta = get_user_meta(get_current_user_id(), "residency_us_em", true);

    // Course Progress Tab -- Show for all users.
    $tabs['progress'] = [
        'name' => 'My Progress',
        'icon' => 'um-faicon-bar-chart',
        'custom' => true,
    ];

    // Educator Dashboard Tab -- Only show if user has "educator_access" role
    $hasEducatorAccess = !empty($meta) && current_user_can('educator_access');
    if (current_user_can('administrator') || $hasEducatorAccess) {
        $tabs['edudash'] = [
            'name' => 'Educator Dashboard',
            'icon' => 'um-faicon-bar-chart',
            'custom' => true,
        ];
    }

    return $tabs;
}
add_filter('um_profile_tabs', 'init_custom_tabs', 1000);

// Educator dashboard tab
function render_educator_dashboard_tab() {
    require_once(dirname(__FILE__) . '/educator-dashboard/index.php');
}
add_action('um_profile_content_edudash', 'render_educator_dashboard_tab');

// User course progress tab
function render_user_progress_tab() {
    echo do_shortcode('[ld_profile]');
}
add_action('um_profile_content_progress', 'render_user_progress_tab');
