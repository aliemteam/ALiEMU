<?php

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
