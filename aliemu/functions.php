<?php

/**
 * Globals
 */
$ROOT_URI = get_stylesheet_directory_uri();
$TEMPLATE_URI = get_template_directory_uri();

// function convertFields($content) {
//     global $wpdb;
//
//     $old_fields = $wpdb->get_results("
//         SELECT *
//         FROM `wp_postmeta`
//         WHERE `meta_key` = '_au-meta'
//     ");
//
//     foreach($old_fields as $k => $v) {
//         $hours = unserialize($v->meta_value)['au-recommended_hours'];
//         $query = $wpdb->get_results("
//             SELECT `meta_value`
//             FROM `wp_postmeta`
//             WHERE `meta_key` = '_sfwd-courses'
//             AND `post_id` = $v->post_id
//         ");
//         $ldMeta = unserialize($query[0]->meta_value);
//         $ldMeta['sfwd-courses_recommendedHours'] = $hours;
//         update_post_meta($v->post_id, '_sfwd-courses', $ldMeta);
//     }
//
//     $wpdb->delete('wp_postmeta', ['meta_key' => '_au-meta']);
//
//     return $content;
// }
// add_filter('the_content', 'convertFields');

require_once(dirname(__FILE__) . '/features/index.php');
require_once(dirname(__FILE__) . '/functions/index.php');
