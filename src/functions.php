<?php
/**
 * ALiEMU functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Globals
 */
define( 'ALIEMU_VERSION', wp_get_theme()->get( 'Version' ) );
define( 'ALIEMU_DB_VERSION', '0.1.0' );
define( 'ALIEMU_ROOT_PATH', __DIR__ );
define( 'ALIEMU_ROOT_URI', get_template_directory_uri() );
define(
	'ALIEMU_POST_TYPES', [
		'course'      => 'sfwd-courses',
		'lesson'      => 'sfwd-lessons',
		'quiz'        => 'sfwd-quiz',
		'topic'       => 'sfwd-topic',
		'lesson'      => 'sfwd-lessons',
		'certificate' => 'sfwd-certificates',
	]
);

require_once __DIR__ . '/lib/database.php';
require_once __DIR__ . '/lib/setup-theme.php';
require_once __DIR__ . '/lib/class-script-loader.php';
require_once __DIR__ . '/lib/class-structured-data.php';
require_once __DIR__ . '/lib/rest-api/index.php';
