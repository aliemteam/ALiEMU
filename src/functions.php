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
define( 'ALIEMU_ROOT', __DIR__ );
define( 'ALIEMU_ROOT_URI', get_template_directory_uri() );

require_once __DIR__ . '/lib/setup-theme.php';
require_once __DIR__ . '/lib/class-scriptloader.php';
require_once __DIR__ . '/lib/ultimate-member.php';
require_once __DIR__ . '/lib/learndash.php';
require_once __DIR__ . '/lib/shortcodes.php';
require_once __DIR__ . '/lib/slack.php';

