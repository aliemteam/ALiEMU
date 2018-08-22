<?php
/**
 * Functions involved with database setup or maintenance
 *
 * @package ALiEMU
 */

namespace ALIEMU\Database;

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/upgrade.php';

/**
 * Responsible for creating all custom tables
 */
function upgrade() : void {
	if ( ALIEMU_VERSION === get_option( 'aliemu_version' ) ) {
		return;
	}

	$upgrader_func = __NAMESPACE__ . '\Upgrades\upgrade_' . str_replace( '.', '_', ALIEMU_VERSION );

	if ( function_exists( $upgrader_func ) ) {
		$upgrader_func();
	}

	update_option( 'aliemu_version', ALIEMU_VERSION );
}
add_action( 'init', __NAMESPACE__ . '\upgrade' );

foreach ( glob( __DIR__ . '/queries-*.php' ) as $queries_file ) {
	require_once $queries_file;
}

