<?php
/**
 * Adds ALiEMU Shortcodes
 *
 * @since 1.0.0
 * @version 0.0.1
 * @author Chris Gaafary
 */

// Capsules CAPSULE Shortcode
function capsule_shortcode($atts, $content = null) {
    $content = do_shortcode($content);
    return "
        <div class='lesson-box'>
            <h2 class='lesson-heading'>CAPSULE</h2>
            <div class='lesson-body'>
                <h4>$content</h4>
            </div>
        </div>
    ";
}
add_shortcode('capsule', 'capsule_shortcode');


//Capsules Lesson Box Shortcode
function capsules_lessonbox_shortcode($atts, $content = null) {
    $shortcode = shortcode_atts(array(
        'header' => '',
    ), $atts);
    extract($shortcode);
    $content = do_shortcode($content);
    return "
        <div class='lesson-box'>
            <h2 class='lesson-heading'>$header</h2>
            <div class='lesson-body'>
                $content
            </div>
        </div>
    ";
}
add_shortcode('capsules-lessonbox', 'capsules_lessonbox_shortcode');


/**
 * Shortcode which GETs and returns the recommended III hours for certificates.
 * @return string The recommended hours
 */
function au_course_hours() {
    $course_id = @$_GET['course_id'];
    if (empty($course_id)) return '';
    $meta = get_post_meta($course_id, '_au-meta', true);
    return $meta['au-recommended_hours'];
}
add_shortcode('course-hours', 'au_course_hours');
