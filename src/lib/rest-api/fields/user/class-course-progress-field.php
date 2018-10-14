<?php
/**
 * Course Progress REST field for Users
 *
 * @package ALIEMU
 */

namespace ALIEMU\API\Users;

defined( 'ABSPATH' ) || exit;

require_once ALIEMU_ROOT_PATH . '/lib/rest-api/fields/class-field.php';

use ALIEMU\API\Field;
use function ALIEMU\Database\Queries\get_user_course_progress;

/**
 * Course progress field implementation
 */
class Course_Progress_Field extends Field {
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->obj_type   = 'user';
		$this->field_name = 'course_progress';
	}

	/**
	 * JSON schema describing the field.
	 *
	 * @var $schema
	 */
	protected $schema = [
		'type'        => 'array',
		'description' => 'Array of objects describing progress of courses that a user has interacted with.',
		'items'       => [
			'type'                 => 'object',
			'additionalProperties' => false,
			'properties'           => [
				'status'             => [
					'type'        => 'string',
					'description' => 'Enum describing the status of the course.',
					'enum'        => [
						'COMPLETED',
						'STARTED',
					],
				],
				'id'                 => [
					'type'        => 'integer',
					'description' => 'The course ID.',
				],
				'steps_total'        => [
					'type'        => 'integer',
					'description' => 'Total number of steps the course has.',
				],
				'steps_completed'    => [
					'type'        => 'integer',
					'description' => 'Total number of steps the user has completed.',
				],
				'activity_started'   => [
					'oneOf'       => [
						[
							'type'   => 'string',
							'format' => 'date-time',
						],
						[
							'type' => 'null',
						],
					],
					'description' => 'Either a parsable date-time of when the activity was started or null of it doesn\'t exist.',
				],
				'activity_completed' => [
					'oneOf'       => [
						[
							'type'   => 'string',
							'format' => 'date-time',
						],
						[
							'type' => 'null',
						],
					],
					'description' => 'Either a parsable date-time of when the activity was completed or null of it doesn\'t exist.',
				],
				'activity_updated'   => [
					'type'        => 'string',
					'format'      => 'date-time',
					'description' => 'A parsable date-time of when the activity was last updated.',
				],
				'hours_awarded'      => [
					'type'        => 'integer',
					'description' => 'Number of hours awarded for the current course, or 0 if the course is not yet completed.',
				],
			],
			'required'             => [
				'activity_completed',
				'activity_started',
				'activity_updated',
				'hours_awarded',
				'id',
				'status',
				'steps_completed',
				'steps_total',
			],
		],
	];

	/**
	 * GET callback method for the field.
	 *
	 * @param WP_User         $user  The User object.
	 * @param string          $field The field name.
	 * @param WP_REST_Request $req The request instance.
	 */
	public function get_callback( $user, $field, $req ) {
		$progress = get_user_course_progress( $user['id'] );
		return $progress;
	}
}
