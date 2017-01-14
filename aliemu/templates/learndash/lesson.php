<?php
/**
 * Displays a lesson.
 *
 * Available Variables
 *
 * $course_id 		            : (int) ID of the course
 * $course 		                : (object) Post object of the course
 * $course_settings             : (array) Settings specific to current course
 * $course_status 	            : Course Status
 * $has_access 	                : User has access to course or is enrolled.
 *
 * $courses_options             : Options/Settings as configured on Course Options page
 * $lessons_options             : Options/Settings as configured on Lessons Options page
 * $quizzes_options             : Options/Settings as configured on Quiz Options page
 *
 * $user_id 		            : (object) Current User ID
 * $logged_in 		            : (true/false) User is logged in
 * $current_user 	            : (object) Currently logged in user object
 *
 * $quizzes 		            : (array) Quizzes Array
 * $post 			            : (object) The lesson post object
 * $topics 		                : (array) Array of Topics in the current lesson
 * $all_quizzes_completed       : (true/false) User has completed all quizzes on the lesson Or, there are no quizzes.
 * $lesson_progression_enabled 	: (true/false)
 * $show_content	            : (true/false) true if lesson progression is disabled or if previous lesson is completed.
 * $previous_lesson_completed 	: (true/false) true if previous lesson is completed
 * $lesson_settings             : Settings specific to the current lesson.
 *
 * @since 2.1.0
 *
 * @package LearnDash\Lesson
 */
if (@$lesson_progression_enabled && ! @$previous_lesson_completed): ?>
    <p id="learndash_complete_prev_lesson">
        <?php
            $previous_item = learndash_get_previous($post);
            if ((!empty($previous_item)) && ($previous_item instanceof WP_Post)) {
                if ($previous_item->post_type == 'sfwd-quiz') {
                    echo sprintf(_x('Please go back and complete the previous <a class="learndash-link-previous-incomplete" href="%s">%s</a>.', 'placeholders: quiz URL, quiz label', 'learndash'), get_permalink($previous_item->ID), LearnDash_Custom_Label::label_to_lower('quiz'));

                }
                else if ($previous_item->post_type == 'sfwd-topic') {
                    echo sprintf(_x('Please go back and complete the previous <a class="learndash-link-previous-incomplete" href="%s">%s</a>.', 'placeholders: topic URL, topic label', 'learndash'), get_permalink($previous_item->ID), LearnDash_Custom_Label::label_to_lower('topic'));
                }
                else {
                    echo sprintf(_x('Please go back and complete the previous <a class="learndash-link-previous-incomplete" href="%s">%s</a>.', 'placeholders: lesson URL, lesson label', 'learndash'), get_permalink($previous_item->ID), LearnDash_Custom_Label::label_to_lower('lesson'));
                }
            }
            else {
                echo sprintf(_x('Please go back and complete the previous %s.', 'placeholder lesson', 'learndash'), LearnDash_Custom_Label::label_to_lower('lesson'));
            }
        ?>
    </p>
    <?php add_filter('comments_array', 'learndash_remove_comments', 1, 2); ?>
<?php endif;
if ($show_content):

    echo $content;

    /**
     * Lesson Topics
     */
    if (! empty($topics)): ?>
        <div id="learndash_lesson_topics_list">
            <div id='learndash_topic_dots-<?php echo esc_attr($post->ID); ?>' class="learndash_topic_dots type-list">
                <strong><?php printf(_x('%s %s', 'Lesson Topics Label', 'learndash'), LearnDash_Custom_Label::get_label('lesson'), LearnDash_Custom_Label::get_label('topics')); ?></strong>
                <ul>
                    <?php $odd_class = ''; ?>

                    <?php foreach ($topics as $key => $topic): ?>

                        <?php $odd_class = empty($odd_class) ? 'nth-of-type-odd' : ''; ?>
                        <?php $completed_class = empty($topic->completed) ? 'topic-notcompleted' : 'topic-completed'; ?>

                        <li class='<?php echo esc_attr($odd_class); ?>'>
                            <span class="topic_item">
                                <a class='<?php echo esc_attr($completed_class); ?>' href='<?php echo esc_attr(get_permalink($topic->ID)); ?>' title='<?php echo esc_attr($topic->post_title); ?>'>
                                    <span><?php echo $topic->post_title; ?></span>
                                </a>
                            </span>
                        </li>

                    <?php endforeach; ?>

                </ul>
            </div>
        </div>
    <?php endif;


    /**
     * Show Quiz List
     */
    if (! empty($quizzes)): ?>
        <div class="content-table">
            <div class="content-table__row content-table__row--header">
                <div class="content-table__cell">Quizzes</div>
                <div class="content-table__cell">Status</div>
            </div>
            <?php foreach ($quizzes as $quiz): ?>
                <div class="content-table__row">
                    <div class="content-table__cell">
                        <a href='<?php echo esc_attr($quiz['permalink']); ?>'><?php echo $quiz['post']->post_title; ?></a>
                    </div>
                    <div class="content-table__cell">
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/<?php echo $quiz['status']; ?>.svg" height="40px" width="40px" />
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif;


    /**
     * Display Lesson Assignments
     */
    if (lesson_hasassignments($post)): ?>
        <?php $assignments = learndash_get_user_assignments($post->ID, $user_id); ?>

        <div id="learndash_uploaded_assignments">
            <h2><?php _e('Files you have uploaded', 'learndash'); ?></h2>
            <table>
                <?php if (! empty($assignments)): ?>
                    <?php foreach($assignments as $assignment): ?>
                        <tr>
                            <td>
                                <a href='<?php echo esc_attr(get_post_meta($assignment->ID, 'file_link', true)); ?>' target="_blank"><?php echo __('Download', 'learndash') . ' ' . get_post_meta($assignment->ID, 'file_name', true); ?></a>
                                <br />
                                <span class="learndash_uploaded_assignment_points"><?php echo learndash_assignment_points_awarded($assignment->ID); ?></span>
                            </td>
                            <td><a href='<?php echo esc_attr(get_permalink($assignment->ID)); ?>'><?php _e('Comments', 'learndash'); ?></a></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </table>
        </div>
    <?php endif;

    /**
     * Display Mark Complete Button
     */
    if ($all_quizzes_completed && $logged_in) {
        echo learndash_mark_complete($post);
    }

endif; ?>

<p id="learndash_next_prev_link">
    <?php
    echo learndash_previous_post_link();
    /*
     * See details for filter 'learndash_show_next_link' https://bitbucket.org/snippets/learndash/5oAEX
     *
     * @since version 2.3
     */
    if (apply_filters('learndash_show_next_link', learndash_is_lesson_complete($user_id, $post->ID), $user_id, $post->ID)) {
        echo '&nbsp;' . learndash_next_post_link();
    }
    ?>
</p>
