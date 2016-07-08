<?php

/**
 * Sends message to slack when dashboard access is requested.
 * @param  string $id User ID
 * @return void
 */
function requested_dashboard_access($id) {
    if (!isset($_POST['au_requested_educator_access']) || !$_POST['au_requested_educator_access'][0] === 'Yes') return;

    $formid = $_POST['form_id'];
    $username = $_POST["user_login-$formid"];

    $messageData = [
        "id" => $id,
        "name" => $_POST["first_name-$formid"] . ' ' . $_POST["last_name-$formid"],
        "username" => $username,
        "email" => $_POST["user_email-$formid"],
        "program" => $_POST['residency_us_em'],
        "role" => $_POST['role'] == 'em-resident' ? 'Resident' : 'Faculty',
        "bio" => $_POST['description']
    ];

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
    slack_message('messages/comments', [
        'name' => $comment->comment_author,
        'email' => $comment->comment_author_email,
        'content' => $comment->comment_content,
        'postUrl' => $post->guid,
        'postName' => $post->post_title,
    ]);
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
    $key = get_option('ALIEM_API_KEY');
    for ($i = 0; $i < 5; $i++) {
        $response = wp_remote_post("https://aliem-slackbot.herokuapp.com/aliemu/$route", [
            'headers' => [
                'ALIEM_API_KEY' => $key,
            ],
            'body' => [
                'data' => json_encode($data),
            ],
        ]);
        if (!is_wp_error($response)) break;
    }
}
