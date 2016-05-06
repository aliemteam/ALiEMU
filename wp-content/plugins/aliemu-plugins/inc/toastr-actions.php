<?php
/**
 * Logic for all toastr notifications
 *
 * @author Derek P Sifford
 * @package ALiEMU Plugins\Toastr
 * @since 1.0.2
 * @version 0.0.1
 */


/**
 * Instantiates the toastr scripts
 */
function add_toastr() {
    wp_register_script( 'toastr', ('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js'), false, '2.1.2', true );
    wp_register_style( 'toastr-css', ('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css'), false, '2.1.2' );
    wp_enqueue_script( 'toastr' );
    wp_enqueue_style( 'toastr-css' );
}
add_action('wp_enqueue_scripts', 'add_toastr');


/**
 * Toastr notification for Residents who do not have a grad year saved.
 *
 * @author Derek P Sifford
 * @since 0.0.1
 *
 * @param  [mixed[]] $post The current WordPress post object
 * @return [mixed[]]       The post +/- the added js notification
 */
function program_toast($post) {
    global $current_user;
    $grad_year_is_set = get_user_meta($current_user->ID, 'au_graduation_year', true);
    $is_a_resident = get_user_meta($current_user->ID, 'role', true);
    // $is_a_resident = get_user_meta($current_user->ID, 'residency_us_em', true);

    if ($_SERVER["REQUEST_URI"] === "/user/$current_user->user_login/" &&
        !$grad_year_is_set && $is_a_resident == 'em-resident') {
        ?>

        <script type="text/javascript">
            jQuery(document).ready(function($) {
                toastr.options.positionClass = 'toast-top-full-width';
                toastr.options.progressBar = true;
                toastr.options.hideDuration = 250;
                toastr.error(
                    'You have not yet set your graduation year.\n' +
                    'To ensure you receive credit from your institution, please set this as soon as possible.'
                );
            });
        </script>

        <?php
    }

    return $post;

}
add_filter('the_content', 'program_toast');
