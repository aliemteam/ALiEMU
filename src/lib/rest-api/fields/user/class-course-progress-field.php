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
		'type'                 => 'object',
		'description'          => 'The user\'s current course progress.',
		'additionalProperties' => false,
		'context'              => [ 'edit' ],
		'properties'           => [
			'completed' => [
				'type'        => 'array',
				'description' => 'An array of completed course IDs.',
				'items'       => [
					'type' => 'integer',
				],
				'uniqueItems' => true,
			],
			'started'   => [
				'type'        => 'array',
				'description' => 'An array of objects describing courses started but not yet completed.',
				'items'       => [
					'type'                 => 'object',
					'description'          => 'An object describing the progress of a course not yet completed.',
					'additionalProperties' => false,
					'properties'           => [
						'id'                => [
							'type'        => 'integer',
							'description' => 'The course ID.',
						],
						'lessons_completed' => [
							'type'        => 'array',
							'description' => 'An array of completed lesson IDs.',
							'items'       => [
								'type' => 'integer',
							],
						],
						'topics_completed'  => [
							'type'        => 'array',
							'description' => 'An array of completed topic IDs.',
							'items'       => [
								'type' => 'integer',
							],
						],
						'total_steps'       => [
							'type'        => 'integer',
							'description' => 'Total number of lessons and topics in this course.',
						],
					],
					'required'             => [
						'id',
						'lessons_completed',
						'topics_completed',
						'total_steps',
					],
				],
			],
		],
		'required'             => [
			'completed',
			'in_progress',
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
		// Ignoring because this is only an issue on WordPress VIP
		// sites and won't affect us in any real measurable way.
		// @codingStandardsIgnoreLine
		$meta = get_user_meta( $user['id'], '_sfwd-course_progress', true );
		$progress = [
			'completed' => [],
			'started'   => [],
		];

		if ( ! $meta ) {
			return $progress;
		}

		// reversing the array so that it is sorted in descending order by last activity.
		foreach ( array_reverse( $meta, true ) as $id => $data ) {
			if ( (int) $data['completed'] >= (int) $data['total'] ) {
				$progress['completed'][] = (int) $id;
			} else {
				$progress['started'][] = [
					'id'                => (int) $id,
					'lessons_completed' => array_keys( $data['lessons'] ),
					'topics_completed'  => array_keys( $data['topics'] ),
					'total_steps'       => (int) $data['total'],
				];
			}
		}

		return $progress;
	}
}
