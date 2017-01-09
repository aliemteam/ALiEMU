<?php

function au_capsule_shortcode($atts, $content = null) {
    $a = shortcode_atts([
        'heading' => 'CAPSULE',
    ], $atts);
    extract($a);
    $bodyClass = $heading === 'CAPSULE'
        ? 'capsule-box__body capsule-box__body--capsule'
        : 'capsule-box__body';
    ?>
        <div class="capsule-box">
            <div class="capsule-box__heading"><?php echo $heading; ?></div>
            <div class="<?php echo $bodyClass; ?>">
                <?php echo do_shortcode($content); ?>
            </div>
        </div>
    <?php
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
