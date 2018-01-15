<?php

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Globals
 */
define( 'ALIEMU_VERSION', '1.7.0' );
define( 'ROOT_URI', get_stylesheet_directory_uri() );

require_once __DIR__ . '/lib/class-scriptloader.php';
require_once __DIR__ . '/lib/ultimate-member.php';
require_once __DIR__ . '/lib/learndash.php';
require_once __DIR__ . '/lib/misc.php';
require_once __DIR__ . '/lib/shortcodes.php';
require_once __DIR__ . '/lib/slack.php';
