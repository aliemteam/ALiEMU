<?php

defined( 'ABSPATH' ) || exit;

/**
 * Sends message to slack when dashboard access is requested.
 *
 * @param  string $id User ID.
 * @return void
 */
function requested_dashboard_access( $id ) {
	if ( ! isset( $_POST['au_requested_educator_access'] ) || ! 'Yes' === $_POST['au_requested_educator_access'][0] ) {
		return;
	}

	$formid   = $_POST['form_id'];
	$username = $_POST[ "user_login-$formid" ];

	$message_data = [
		'id'       => $id,
		'name'     => $_POST[ "first_name-$formid" ] . ' ' . $_POST[ "last_name-$formid" ],
		'username' => $username,
		'email'    => $_POST[ "user_email-$formid" ],
		'program'  => $_POST['residency_us_em'],
		'role'     => 'em-resident' === $_POST['role'] ? 'Resident' : 'Faculty',
		'bio'      => $_POST['description'],
	];

	slack_message( 'aliemu/messages/dashboard-access', $message_data );
}
add_action( 'user_register', 'requested_dashboard_access' );

/**
 * Routes all comments to Slack
 *
 * @param  string $comment_id The comment ID.
 * @return void
 */
function slack_comment( $comment_id ) {
	$comment  = get_comment( $comment_id );
	$post     = get_post( $comment->comment_post_ID );
	$category = get_the_category( $post->ID )[0]->slug;

	switch ( $category ) {
		case 'capsules':
			$endpoint = 'capsules/messages/comments';
			break;
		case 'air':
			$endpoint = 'airseries/messages/comments';
			break;
		case 'air-pro':
			$endpoint = 'airseries-pro/messages/comments';
			break;
		default:
			$endpoint = 'aliemu/messages/comments';
			break;
	}

	slack_message(
		$endpoint, [
			'name'     => $comment->comment_author,
			'email'    => $comment->comment_author_email,
			'content'  => $comment->comment_content,
			'postUrl'  => $post->guid,
			'postName' => $post->post_title,
		]
	);
}
add_action( 'comment_post', 'slack_comment' );

/**
 * Master handler for posting messages to Slack.
 *
 * Tries a total of five times to send the message to slack. If the message is
 *  posted successfully (eg, if the HTTP response is 200), then functoin exits.
 *
 * @param  string $route Enpoint to hit.
 * @param  array  $data   Associative array of data to send.
 * @return void
 */
function slack_message( $route, $data ) {
	// Don't message slack when developing / testing.
	if ( WP_DEBUG ) {
		return;
	}
	$key = get_option( 'ALIEM_API_KEY' );
	for ( $i = 0; $i < 5; $i++ ) {
		$response = wp_remote_post(
			"https://aliem-slackbot.now.sh/$route", [
				'headers' => [
					'ALIEM_API_KEY' => $key,
				],
				'body'    => [
					'data' => wp_json_encode( $data ),
				],
			]
		);
		if ( ! is_wp_error( $response ) ) {
			break;
		}
	}
}
