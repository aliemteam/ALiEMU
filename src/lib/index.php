<?php
/**
 * Responsible for requiring all lib files.
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/database/index.php';
require_once __DIR__ . '/rest-api/index.php';

foreach ( glob( __DIR__ . '/*.php' ) as $_file ) {
	require_once $_file;
}

foreach ( glob( __DIR__ . '/theme/*.php' ) as $_file ) {
	require_once $_file;
}

foreach ( glob( __DIR__ . '/plugins/*.php' ) as $_file ) {
	require_once $_file;
}

unset( $_file );
