<?php

if (!defined('ABSPATH')) exit(1);

/**
 * Remove emojis
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/**
 * Stubs or removes unnecessary Divi functions / actions
 */
add_action('after_setup_theme', function() {
    remove_action('wp_head', 'et_divi_add_customizer_css');
    remove_action('wp_head', ['ET_Core_PageResource', 'head_late_output_cb'], 103);
}, 999);
function et_divi_fonts_url() { return null; }

/**
 * Adds class 'et_full_width_page' to all pages that aren't category capsules
 *   to remove the sidebar.
 * @param  array[string] $classes  Array of classes
 * @return array[string] Array of classes
 */
add_filter('body_class', function($classes) {
    global $post;
    if (!$post) return $classes;

    $category = get_the_category($post->ID);
    if (!$category) return $classes;

    if ($category[0]->slug !== 'capsules') {
        $classes[] = 'et_full_width_page';
    }

    return $classes;
});

/**
 * Load / unload styles from tinymce
 */
add_filter('mce_css', function($styles) {
    $css = array_filter(explode(',', $styles), function($style) {
        return ! preg_match('/Divi/', $style);
    });
    $css[] = 'https://fonts.googleapis.com/css?family=Roboto:300%2C400%2C400i%2C500%2C700&amp;subset=cyrillic%2Cgreek';
    $css[] = ROOT_URI . '/editor.css';
    return join(',', $css);
});

/**
 * Ultimate Member Profile Display Name Integration
 * @param  string $authorName The author's name.
 * @param  object $comment     WordPress comment object.
 * @return string
 */
function wpdiscuz_um_author($authorName, $comment) {
    if ($comment->user_id) {
        $column = 'display_name';
        if (class_exists('UM_API')) {
            um_fetch_user($comment->user_id);
            $authorName = um_user($column);
            um_reset_user();
            return $authorName;
        }
        $authorName = get_the_author_meta($column, $comment->user_id);
    }
    return $authorName;
}
add_filter('wpdiscuz_comment_author', 'wpdiscuz_um_author', 10, 2);


/**
 * Ultimate Member Profile URL Integration
 * @param  string $profileUrl The user's profile URL?
 * @param  object $user        WordPress user object.
 * @return string
 */
function wpdiscuz_um_profile_url($profileUrl, $user) {
    if ($user && class_exists('UM_API')) {
        um_fetch_user($user->ID);
        $profileUrl = um_user_profile_url();
    }
    return $profileUrl;
}
add_filter('wpdiscuz_profile_url', 'wpdiscuz_um_profile_url', 10, 2);

/**
 * Toastr notification for Residents who do not have a grad year saved.
 *
 * @param  [string] $post WordPress post content
 * @return [string]       The post +/- the added js notification
 */
function program_toast($post) {
    global $current_user;
    if ($_SERVER["REQUEST_URI"] !== "/user/$current_user->user_login/") return $post;

    $grad_year_is_set = get_user_meta($current_user->ID, 'au_graduation_year', true);
    $is_a_resident = get_user_meta($current_user->ID, 'role', true) == 'em-resident';
    if ((!$grad_year_is_set || $grad_year_is_set == '') && $is_a_resident) {
        $post .= "
        <script type='text/javascript'>
            jQuery(document).ready(function($) {
                toastr.options.positionClass  = 'toast-top-full-width';
                toastr.options.progressBar = true;
                toastr.options.hideDuration = 250;
                toastr.error(
                    'You have not yet set your graduation year. ' +
                    'To ensure you receive credit from your institution, please set this as soon as possible.'
                );
            });
        </script>";
    }
    return $post;
}
add_filter('the_content', 'program_toast');


/**
 * HTML-Generating Helper Functions
 */

function sorted_course_list($end_year, $category) {
    $current_year = intval(get_gmt_from_date(null, 'Y'));
    $year = $current_year;
    ?>
    <div class="content-area course-list">
        <div class="course-list__year-links">
            <?php while ($year >= $end_year): ?>
                <a href="#year-<?php echo $year; ?>" aria-label="in page link to <?php echo $year; ?>"><?php echo $year--; ?></a>
            <?php endwhile; $year = $current_year; ?>
        </div>
        <?php while($year >= $end_year): ?>
            <div id="year-<?php echo $year; ?>" class="course-list__single-year-container">
                <div class="course-list__year-heading"><?php echo $year; ?></div>
                <div class="course-boxes course-boxes--scroll">
                    <?php echo do_shortcode("[ld_course_list category_name='$category' tag='$year']"); ?>
                </div>
            </div>
            <?php $year--; ?>
        <?php endwhile; ?>
    </div>
    <?php
}

function aliemu_team_member($name, $img, $title, $role, $twitter) {
    ?>
    <div class="team-member">
        <div class="team-member__photo">
            <img src="/wp-content/themes/aliemu/assets/team/<?php echo $img; ?>" alt="Photograph of <?php echo $name; ?>"/>
        </div>
        <div class="team-member__info">
            <div class="team-member__name">
                <?php if ($twitter): ?>
                    <div>
                        <a href="https://twitter.com/<?php echo $twitter; ?>" class="et_pb_font_icon et_pb_twitter_icon" aria-label="View Twitter profile"></a>
                    </div>
                <?php endif; ?>
                <?php echo $name; ?>
            </div>
            <div><?php echo $title; ?></div>
            <div><?php echo $role; ?></div>
        </div>
    </div>
    <?php
}
