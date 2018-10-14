<?php
/**
 * Institution REST field for Users
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
class Institution_Field extends Field {
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->obj_type   = 'user';
		$this->field_name = 'institution';
	}

	/**
	 * JSON schema describing the field.
	 *
	 * @var $schema
	 */
	protected $schema = [
		'type'        => 'string',
		'description' => 'The user\'s self-defined institutional affiliation.',
		'context'     => [ 'view', 'embed', 'edit' ],
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
		return get_user_meta( $user['id'], 'institution', true );
	}

	/**
	 * POST callback method for the field.
	 *
	 * @param string          $value The updated value.
	 * @param WP_User         $user The user to be updated.
	 * @param string          $field The name of the field.
	 * @param WP_REST_Request $req The request instance.
	 */
	public function update_callback( $value, $user, $field, $req ) {
		// Ignoring because this is only an issue on WordPress VIP
		// sites and won't affect us in any real measurable way.
		// @codingStandardsIgnoreLine
		update_user_meta( $user->ID, 'institution', $value );
		return null;
	}
}
