<?php
/**
 * Abstract class for REST endpoint field extensions.
 *
 * @package ALIEMU
 */

namespace ALIEMU\API;

defined( 'ABSPATH' ) || exit;

/**
 * Main fields class
 */
abstract class Field {
	/**
	 * The base object type being extended.
	 *
	 * @var $obj_type string
	 */
	protected $obj_type;

	/**
	 * The name of the property being added to the base object.
	 *
	 * @var $field_name string
	 */
	protected $field_name;

	/**
	 * JSON schema describing the field.
	 *
	 * @var $schema
	 */
	protected $schema = null;

	/**
	 * Registers the field with the REST API
	 */
	final public function register() : void {
		register_rest_field(
			$this->obj_type,
			$this->field_name,
			[
				'get_callback'    => [ $this, 'get_callback' ],
				'update_callback' => method_exists( $this, 'update_callback' )
					? [ $this, 'update_callback' ]
					: null,
				'schema'          => $this->schema,
			]
		);
	}

	/**
	 * GET callback method for the field.
	 *
	 * @param mixed[]         $obj  The object being extended.
	 * @param string          $field The field name.
	 * @param WP_REST_Request $req The request instance.
	 */
	abstract public function get_callback( $obj, $field, $req );
}
