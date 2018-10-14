<?php
/**
 * Course hours field for Course endpoint
 *
 * @package ALIEMU
 */

namespace ALIEMU\API\Courses;

defined( 'ABSPATH' ) || exit;

require_once ALIEMU_ROOT_PATH . '/lib/rest-api/fields/class-field.php';

use ALIEMU\API\Field;

/**
 * Course progress field implementation
 */
class Hours_Field extends Field {
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->obj_type   = ALIEMU_POST_TYPES['course'];
		$this->field_name = 'hours';
	}

	/**
	 * JSON schema describing the field.
	 *
	 * @var $schema
	 */
	protected $schema = [
		'type'        => 'number',
		'description' => 'The recommended number of CE hours for the course.',
		'context'     => [ 'view', 'embed', 'edit' ],
	];

	/**
	 * GET callback method for the field.
	 *
	 * @param WP_Post         $course  The Course object.
	 * @param string          $field The field name.
	 * @param WP_REST_Request $req The request instance.
	 */
	public function get_callback( $course, $field, $req ) {
		// Ignoring because this is only an issue on WordPress VIP
		// sites and won't affect us in any real measurable way.
		// @codingStandardsIgnoreLine
		$meta = get_post_meta( $course['id'], '_sfwd-courses', true );
		$hours = $meta[ $this->obj_type . '_recommendedHours' ];
		return $hours ? floatval( $hours ) : 0;
	}
}
