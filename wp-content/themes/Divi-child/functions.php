<?php

// add_filter('the_content', 'deleteme');
// function deleteme($content) {
//     $a = rest_url();
//     for ($i=0; $i < 20; $i++) {
//         $content .= "<br>" . $a . "<br>";
//     }
//     return $content;
// }
// NOTE: HTTP Base URL = localhost:3000/wp-json/

/**
 * Remove emojis
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');


/**
 * Master function to enqueue all scripts / styles
 * @return void
 */
function theme_enqueue_scripts() {
    wp_enqueue_style('parent-style', get_template_directory_uri().'/style.css');
    wp_enqueue_script('nav-helper', get_stylesheet_directory_uri().'/js/nav-helper.js', false, false, true);

    // Only on home page
    if (is_front_page()) {
        wp_enqueue_script('particlesjs', 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js');
        wp_enqueue_script('particles-home', get_stylesheet_directory_uri().'/js/particles-home.js', array('particlesjs'), false, true);
    }
}
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');


function requested_dashboard_access($id) {
    if (!isset($_POST['au_requested_educator_access']) || !$_POST['au_requested_educator_access'][0] === 'Yes') return;

    $formid = $_POST['form_id'];
    $username = $_POST['user_login-' . $formid];

    $messageData = array(
        "name" => $_POST['first_name-' . $formid] . ' ' . $_POST['last_name-' . $formid],
        "username" => $username,
        "email" => $_POST['user_email-' . $formid],
        "program" => $_POST['residency_us_em'],
        "role" => $_POST['role'] == 'em-resident' ? 'Resident' : 'Faculty',
        "bio" => $_POST['description']
    );

    slack_message('messages/dashboard-access', $messageData);
}
add_action('user_register', 'requested_dashboard_access');


/**
 * Routes contact form messages to Slack
 * @param  array $data  Associative array with message data.
 * @return void
 */
function slack_contact($data) {
    slack_message('messages/contact-form', $data);
}
add_action('slack_email_hook', 'slack_contact');


/**
 * Routes all comments to Slack
 * @param  string $commentId The comment ID.
 * @return void
 */
function slack_comment($commentId) {
    $comment = get_comment($commentId);
    $post = get_post($comment->comment_post_ID);
    slack_message('messages/comments', array(
        'name' => $comment->comment_author,
        'email' => $comment->comment_author_email,
        'content' => $comment->comment_content,
        'postUrl' => $post->guid,
        'postName' => $post->post_title,
    ));
}
add_action('comment_post', 'slack_comment');


/**
 * Master handler for posting messages to Slack.
 *
 * Tries a total of five times to send the message to slack. If the message is
 *  posted successfully (eg, if the HTTP response is 200), then functoin exits.
 * @param  string $route Enpoint to hit.
 * @param  array $data   Associative array of data to send.
 * @return void
 */
function slack_message($route, $data) {
    $key = getenv('ALIEM_API_KEY');
    for ($i = 0; $i < 5; $i++) {
        $response = wp_remote_post("https://aliem-slackbot.herokuapp.com/aliemu/$route", array(
            'headers' => array(
                'ALIEM_API_KEY' => $key,
            ),
            'body' => array(
                'data' => json_encode($data),
            ),
        ));
        if (!is_wp_error($response)) break;
    }
}


/**
 * Ultimate Member Profile Display Name Integration
 * @param  string $authorName The author's name.
 * @param  object $comment     WordPress comment object.
 * @return string
 */
function wpdiscuz_um_author($authorName, $comment) {
    if ($comment->user_id) {
        $column = 'display_name'; // Other options: 'user_login', 'user_nicename', 'nickname', 'first_name', 'last_name'
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
