<?php

/**
 * Remove emojis
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/**
 * Load / unload styles from tinymce
 */
function aliemu_editor_styles($styles) {
    $css = array_filter(explode(',', $styles), function($style) {
        return ! preg_match('/Divi/', $style);
    });
    $css[] = 'https://fonts.googleapis.com/css?family=Roboto:300%2C400%2C400i%2C500%2C700&amp;subset=cyrillic%2Cgreek';
    $css[] = get_stylesheet_directory_uri() . '/editor.css';
    return join(',', $css);
}
add_filter('mce_css', 'aliemu_editor_styles');

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
