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
		'context'              => [ 'view', 'embed', 'edit' ],
		'properties'           => [
			'completed' => [
				'type'        => 'array',
				'description' => 'An array of objects describing completed courses.',
				'items'       => [
					'type'                 => 'object',
					'description'          => 'An object describing a completed course',
					'additionalProperties' => false,
					'properties'           => [
						'id'    => [
							'type'        => 'integer',
							'description' => 'The course ID.',
						],
						'hours' => [
							'type'        => 'integer',
							'description' => 'The associated III hours.',
						],
						'date'  => [
							'type'        => 'date-time',
							'description' => 'Date of completion.',
						],
					],
					'required'             => [
						'id',
						'date',
						'hours',
					],
				],
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
				$completed_date = $this->course_completion_date( $user['id'], $id );

				// Bug in learndash (shocker!) that caused some users to show completed for a course when it actually is not.
				if ( '1970-01-01T00:00:00+00:00' !== $completed_date ) {
					$course                  = get_post_meta( $id, '_sfwd-courses', true );
					$progress['completed'][] = [
						'id'    => (int) $id,
						'hours' => (int) $course['sfwd-courses_recommendedHours'] ?? 0,
						'date'  => $completed_date,
					];
				}
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

	/**
	 * Returns the activity_completed timestamp for a given course and user.
	 *
	 * @param int $user_id The user ID.
	 * @param int $course_id The course ID.
	 * @return int Timestamp
	 */
	private function course_completion_date( int $user_id, int $course_id ) : string {
		global $wpdb;
		$key = join( '_', [ 'course_completion_date', $user_id, $course_id ] );

		$timestamp = get_transient( $key );
		if ( ! $timestamp ) {
			$query = $wpdb->prepare(
				"
						  SELECT activity_completed
						    FROM {$wpdb->prefix}learndash_user_activity
						   WHERE post_id = %d
						     AND user_id = %d
						     AND activity_status = 1
							 AND activity_type = 'course'
							 AND activity_completed > 0
						ORDER BY activity_completed DESC
					",
				$course_id,
				$user_id
			);
			// Ignoring because we're caching the result here in a transient
			// @codingStandardsIgnoreLine
			$timestamp = (int) $wpdb->get_var( $query );
			$timestamp = date( 'c', $timestamp );
			set_transient( $key, $timestamp, DAY_IN_SECONDS );
		}

		return $timestamp;
	}
}
