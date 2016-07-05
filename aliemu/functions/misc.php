<?php

/**
 * Remove emojis
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');


/**
 * Toastr notification for Residents who do not have a grad year saved.
 *
 * @param  [mixed[]] $post WordPress post object
 * @return [mixed[]]       The post +/- the added js notification
 */
function program_toast($post) {
    global $current_user;
    if (!$_SERVER["REQUEST_URI"] === "/user/$current_user->user_login/") return $post;

    $grad_year_is_set = get_user_meta($current_user->ID, 'au_graduation_year', true);
    $is_a_resident = get_user_meta($current_user->ID, 'role', true) == 'em-resident';
    if (!$grad_year_is_set && $is_a_resident) { ?>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                toastr.options.positionClass  = 'toast-top-full-width';
                toastr.options.progressBar = true;
                toastr.options.hideDuration = 250;
                toastr.error(
                    'You have not yet set your graduation year. ' +
                    'To ensure you receive credit from your institution, please set this as soon as possible.'
                );
            });
        </script>
    <?php }
    return $post;
}
add_filter('the_content', 'program_toast');
