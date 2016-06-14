<?php


add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');
function theme_enqueue_scripts() {
    // CSS
    wp_enqueue_style('parent-style', get_template_directory_uri().'/style.css');
    wp_enqueue_script('nav-helper',
        get_stylesheet_directory_uri().'/js/nav-helper.js',
        false, false, true);
}

add_action('user_register', 'requested_dashboard_access');
function requested_dashboard_access($id) {
    if (isset($_POST['au_requested_educator_access']) && $_POST['au_requested_educator_access'][0] === 'Yes') {
        $formid = $_POST['form_id'];
        $username = $_POST['user_login-' . $formid];

        $headers = array(
            'Content-Type: text/html',
            'charset=UTF-8',
        );
        $messageData = array(
            "First Name" => $_POST['first_name-' . $formid],
            "Last Name" => $_POST['last_name-' . $formid],
            "Email Address" => $_POST['user_email-' . $formid],
            "Program" => $_POST['residency_us_em'],
            "Role" => $_POST['role'] == 'em-resident' ? 'Resident' : 'Faculty',
            "Graduation Year" => $_POST['au_graduation_year-' . $formid],
            "Bio" => $_POST['description']
        );

        $message = "<div style='font-size: 16px; font-family: sans;'>"
                 .      "<p>User '{$username}' has requested dashboard access.</p>"
                 .      "<h3>User Information</h3>"
                 .      "<table>";

        foreach ($messageData as $key => $value) {
            $message .= "<tr>"
                     .      "<td style='min-width: 200px; font-weight: bold;'>{$key}</td>"
                     .      "<td>{$value}</td>"
                     .  "</tr>";
        }
        $message .= "</table><p>Please confirm or reject as soon as possible. Thanks!</p></div>";

        wp_mail(array('mlin@aliem.com', 'cgaafary@gmail.com', 'dereksifford@gmail.com'), 'User Requesting Dashboard Access', $message, $headers);
    }
}

add_action('slack_email_hook', 'slack_contact');
function slack_contact($data) {
    slack_message('messages/contact-form', $data);
}

add_action('comment_post', 'slack_comment');
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
    for ($i = 0; $i < 5; $i++) {
        $response = wp_remote_post("http://104.131.189.237:5000/aliemu/$route", array(
            'body' => array(
                'data' => json_encode($data),
            )
        ));
        if (!is_wp_error($response)) break;
    }
}

function console_log( $data ){
  echo '<script>';
  echo 'console.log('. json_encode( $data ) .')';
  echo '</script>';
}
