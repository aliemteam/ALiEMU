<?php

defined('ABSPATH') || exit;

add_filter( 'um_profile_tabs', function( $tabs ) {
	$meta = get_user_meta( get_current_user_id(), "residency_us_em", true );

	// Course Progress Tab -- Show for all users.
	$tabs['progress'] = [
		'name' => 'My Progress',
		'icon' => 'um-faicon-bar-chart',
		'custom' => true,
	];

	// Educator Dashboard Tab -- Only show if user has "educator_access" role
	$hasEducatorAccess = !empty( $meta ) && current_user_can( 'educator_access' );
	if ( current_user_can( 'administrator' ) || $hasEducatorAccess ) {
		$tabs['edudash'] = [
			'name' => 'Educator Dashboard',
			'icon' => 'um-faicon-bar-chart',
			'custom' => true,
		];
	}

	return $tabs;
}, 1000 );

// Educator dashboard tab
add_action( 'um_profile_content_edudash', function() { echo "<div id='educator-dashboard'></div>"; } );

// User course progress tab
add_action( 'um_profile_content_progress', function() { echo do_shortcode('[ld_profile]'); } );
