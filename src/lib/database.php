<?php
/**
 * Functions involved with database setup or maintenance
 *
 * @package ALiEMU
 */

namespace ALIEMU\Database;

defined( 'ABSPATH' ) || exit;

/**
 * Responsible for creating all custom tables
 */
function create_tables() : void {
	$db_version = get_option( 'aliemu_db_version' );

	if ( $db_version || version_compare( $db_version, ALIEMU_DB_VERSION, '<' ) ) {
		create_user_groups_table();
		update_option( 'aliemu_db_version', ALIEMU_DB_VERSION );
	}
}
add_action( 'init', __NAMESPACE__ . '\create_tables' );

/**
 * Create / update the user_groups table
 */
function create_user_groups_table() : void {
	global $wpdb;

	$table_name      = $wpdb->prefix . 'user_groups';
	$charset_collate = $wpdb->get_charset_collate();

	/**
	 * Ignoring below for the following reasons:
	 * - Our database will never be big enough to make querying $wpdb->users
	 *   an issue.
	 * - There is no need for $wpdb->prepare here as we do not have dangerous
	 *   placeholders.
	 * - There is no need for caching the response here because this response is one
	 *   that should fundamentally not be cached.
	 */
	// @codingStandardsIgnoreStart
	$sql = "
		CREATE TABLE IF NOT EXISTS $table_name (
			PRIMARY KEY (id),
			id        BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			owner_id  BIGINT(20) UNSIGNED NOT NULL,
			member_id BIGINT(20) UNSIGNED NOT NULL,
			INDEX owner_id  (owner_id),
			INDEX member_id (member_id),
			FOREIGN KEY (owner_id)
				REFERENCES $wpdb->users(ID)
				ON DELETE CASCADE,
			FOREIGN KEY (member_id)
				REFERENCES $wpdb->users(ID)
				ON DELETE CASCADE,
			CONSTRAINT owner_id_member_id_unique
				UNIQUE KEY (owner_id, member_id)
		)
		ENGINE=INNODB
		$charset_collate;
	";

	if ( ! $wpdb->query( $sql ) ) {
		wp_die( esc_html( $wpdb->last_error ) );
	}
	// @codingStandardsIgnoreEnd
}
