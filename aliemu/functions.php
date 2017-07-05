<?php

namespace ALIEMU;

if (!defined('ABSPATH')) exit(1);

/**
 * Globals
 */
define('ALIEMU_VERSION', '1.3.2');
define('ROOT_URI', get_stylesheet_directory_uri());

require_once(__DIR__ . '/lib/script-loader/index.php');
require_once(__DIR__ . '/lib/ultimate-member.php');
require_once(__DIR__ . '/lib/learndash.php');
require_once(__DIR__ . '/lib/misc.php');
require_once(__DIR__ . '/lib/shortcodes.php');
require_once(__DIR__ . '/lib/slack.php');
