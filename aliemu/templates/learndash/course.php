<?php

if (!defined('ABSPATH')) exit(1);

/**
 * Displays a course
 *
 * Available Variables
 * $course_id 		            : (int) ID of the course
 * $course 		                : (object) Post object of the course
 * $course_settings             : (array) Settings specific to current course
 *
 * $courses_options             : Options/Settings as configured on Course Options page
 * $lessons_options             : Options/Settings as configured on Lessons Options page
 * $quizzes_options             : Options/Settings as configured on Quiz Options page
 *
 * $user_id 		            : Current User ID
 * $logged_in 		            : User is logged in
 * $current_user 	            : (object) Currently logged in user object
 *
 * $course_status 	            : Course Status
 * $has_access 	                : User has access to course or is enrolled.
 * $materials 		            : Course Materials
 * $has_course_content		    : Course has course content
 * $lessons 		            : Lessons Array
 * $quizzes 		            : Quizzes Array
 * $lesson_progression_enabled 	: (true/false)
 * $has_topics		            : (true/false)
 * $lesson_topics	            : (array) lessons topics
 *
 * @since 2.1.0
 *
 * @package LearnDash\Course
 */


/**
 * Display course status
 */
if ($logged_in): ?>
    <div class="course-status">
        <span>
            <strong><?php printf(_x('%s Status:', 'Course Status Label', 'learndash'), LearnDash_Custom_Label::get_label('course')); ?></strong> <?php echo $course_status; ?>
        </span>
        <?php  if (!empty($course_certficate_link)): ?>
            <a href='<?php echo esc_attr($course_certficate_link); ?>' class="btn btn--primary" target="_blank"><?php echo apply_filters('ld_certificate_link_label', __('Print Certificate', 'learndash'), $user_id, $post->ID); ?></a>
        <?php endif; ?>
    </div>

    <?php
    /**
     * Filter to add custom content after the Course Status section of the Course template output.
     * @since 2.3
     * See https://bitbucket.org/snippets/learndash/7oe9K for example use of this filter.
     */
    echo apply_filters('ld_after_course_status_template_container', '', learndash_course_status_idx($course_status), $course_id, $user_id);
    ?>

<?php endif; ?>

<?php echo $content; ?>

<?php if (!$has_access): ?>
    <?php echo learndash_payment_buttons($post); ?>
<?php endif; ?>

<?php if ($has_course_content): ?>
    <?php
    $show_course_content = true;
    if (!$has_access):
        if ($course_meta['sfwd-courses_course_disable_content_table'] == 'on'):
            $show_course_content = false;
        endif;
    endif;

    if ($show_course_content): ?>
        <div id="learndash_course_content">
            <h1 id="learndash_course_content_title">
                <?php printf(_x('%s Content', 'Course Content Label', 'learndash'), LearnDash_Custom_Label::get_label('course')); ?>
            </h1>

            <?php
            /**
             * Display lesson list
             */
            if (!empty($lessons)): ?>

                <div class="content-table">
                    <div class="content-table__row content-table__row--header">
                        <div class="content-table__cell">Lessons</div>
                        <div class="content-table__cell">Status</div>
                    </div>
                    <?php foreach ($lessons as $lesson): ?>
                        <div class="content-table__row">
                            <div class="content-table__cell content-table__cell--full-width">
                                <a class="content-table__link" href='<?php echo esc_attr($lesson['permalink']); ?>'><?php echo $lesson['post']->post_title; ?></a>
                            </div>
                            <div class="content-table__cell content-table__cell--padded">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/<?php echo $lesson['status']; ?>.svg" height="40px" width="40px" role="presentation"/>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>


            <?php
            /**
             * Display quiz list
             */
            if (!empty($quizzes)): ?>
                <div class="content-table">
                    <div class="content-table__row content-table__row--header">
                        <div class="content-table__cell">Quizzes</div>
                        <div class="content-table__cell">Status</div>
                    </div>
                    <?php foreach($quizzes as $quiz): ?>
                        <div class="content-table__row">
                            <div class="content-table__cell content-table__cell--full-width">
                                <a class="content-table__link" href='<?php echo esc_attr($quiz['permalink']); ?>'><?php echo $quiz['post']->post_title; ?></a>
                            </div>
                            <div class="content-table__cell content-table__cell--padded">
                                <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/<?php echo $quiz['status']; ?>.svg" height="40px" width="40px" role="presentation"/>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

        </div>
    <?php endif; ?>
<?php endif; ?>
