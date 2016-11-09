<?php
/**
 * Adds ALiEMU Shortcodes
 *
 * @since 1.0.0
 * @version 0.0.1
 * @author Chris Gaafary
 */

function au_capsule_shortcode($atts, $content = null) {
    $a = shortcode_atts([
        'heading' => 'CAPSULE',
    ], $atts);
    extract($a);
    $content = ($heading === 'CAPSULE')
        ? '<h4>' . do_shortcode($content) . '</h4>'
        : do_shortcode($content);
    return "
        <div class='lesson-box'>
            <h2 class='lesson-heading'>$heading</h2>
            <div class='lesson-body'>
                $content
            </div>
        </div>
    ";
}
add_shortcode('capsule', 'au_capsule_shortcode');

/**
 * Shortcode which GETs and returns the recommended III hours for certificates.
 * @return string The recommended hours
 */
function au_course_hours() {
    $course_id = @$_GET['course_id'];
    if (empty($course_id)) return '';
    $meta = get_post_meta($course_id, '_sfwd-courses', true);
    return $meta['sfwd-courses_recommendedHours'];
}
add_shortcode('course-hours', 'au_course_hours');
