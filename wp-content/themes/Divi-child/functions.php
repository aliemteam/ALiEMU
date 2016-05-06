<?php


add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');
function theme_enqueue_scripts()
{
    // CSS
    wp_enqueue_style('parent-style', get_template_directory_uri().'/style.css');
    wp_enqueue_style('child-style',
        get_stylesheet_directory_uri().'/style.css',
        array('parent-style')
    );
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
