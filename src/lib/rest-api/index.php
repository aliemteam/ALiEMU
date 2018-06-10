<?php
/**
 * Main entrypoint for registering REST routes
 *
 * @package ALiEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init', function() {
		$controllers = [
			'Courses_Controller'     => __DIR__ . '/endpoints/class-courses-controller.php',
			'Lessons_Controller'     => __DIR__ . '/endpoints/class-lessons-controller.php',
			'Quizzes_Controller'     => __DIR__ . '/endpoints/class-quizzes-controller.php',
			'Topics_Controller'      => __DIR__ . '/endpoints/class-topics-controller.php',
			'User_Groups_Controller' => __DIR__ . '/endpoints/class-user-groups-controller.php',
		];

		foreach ( $controllers as $classname => $path ) {
			require_once $path;
			$class      = __NAMESPACE__ . '\\' . $classname;
			$controller = new $class();
			$controller->register_routes();
		}

		$fields = [
			'Users\Course_Progress_Field' => __DIR__ . '/fields/user/class-course-progress-field.php',
			'Users\Institution_Field'     => __DIR__ . '/fields/user/class-institution-field.php',
		];

		foreach ( $fields as $classname => $path ) {
			require_once $path;
			$class = __NAMESPACE__ . '\\' . $classname;
			$field = new $class();
			$field->register();
		}
	}
);

require_once __DIR__ . '/fields/comment/prepare.php';
require_once __DIR__ . '/fields/user/prepare.php';

