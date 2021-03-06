<?php
/**
 * Responsible for all database upgrader tasks.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Database\Upgrades;

defined( 'ABSPATH' ) || exit;

/**
 * Upgrader function for v2.0.1.
 */
function upgrade_2_0_1() {
	$add_groups_table = function() {
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
		// phpcs:disable
		$sql = "
			CREATE TABLE IF NOT EXISTS $table_name (
				PRIMARY KEY (id),
				id        BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
				owner_id  BIGINT(20) UNSIGNED NOT NULL,
				member_id BIGINT(20) UNSIGNED NOT NULL,
				tags	  JSON,
				INDEX owner_id  (owner_id),
				INDEX member_id (member_id),
				FOREIGN KEY (owner_id)
					REFERENCES $wpdb->users(ID)
					ON DELETE CASCADE,
				FOREIGN KEY (member_id)
					REFERENCES $wpdb->users(ID)
					ON DELETE CASCADE,
				CONSTRAINT owner_id_member_id_unique
					UNIQUE KEY (owner_id, member_id),
				CHECK (JSON_VALID(tags))
			)
			ENGINE=INNODB
			$charset_collate;
		";

		if ( ! $wpdb->query( $sql ) ) {
			wp_die( esc_html( $wpdb->last_error ) );
		}
		// phpcs:enable
	};

	$update_institution_meta_key = function() {
		global $wpdb;

		// phpcs:disable
		$success = $wpdb->update(
			$wpdb->usermeta,
			[
				'meta_key' => 'institution',
			],
			[
				'meta_key' => 'residency_us_em',
			],
			[ '%s' ],
			[ '%s' ]
		);
		// phpcs:enable

		if ( false === $success ) {
			wp_die( esc_html( $wpdb->last_error ) );
		}
	};

	$add_groups_table();
	$update_institution_meta_key();
}

// vim: set fdm=marker: .
