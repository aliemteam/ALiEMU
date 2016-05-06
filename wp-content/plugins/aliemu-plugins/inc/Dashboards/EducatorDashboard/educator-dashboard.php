<?php
/**
 * Adds Educator Dashboard Functionality
 *
 * @since 1.0.0
 * @version 0.1.1
 * @author Chris Gaafary
 */


/**
 * Holds all the logic required for the Educator dashboard
 *
 * @author Derek P Sifford
 * @package ALiEMU Plugins\Dashboards
 * @since 1.0.1
 * @version 0.1.1
 */
class AU_Educator_Dashboard {

	public $current_user;
	public $courses;
	public $course_meta;
	public $lessons;
	public $unique_categories;
	public $user_meta;
	private $categories;
	private $user_data;
	private $skipped_usermeta = array(
		'_badgeos_can_notify_user',
		'_enable_new_pm',
		'_hide_online_status',
		'_notifications_prefs',
		'_pm_who_can',
		'_profile_progress',
		'_um_pm_last_send',
		'_um_pm_msgs_sent',
		'admin_color',
		'closedpostboxes_dashboard',
		'closedpostboxes_groups',
		'closedpostboxes_page',
		'closedpostboxes_sfwd-courses',
		'closedpostboxes_sfwd-lessons',
		'closedpostboxes_sfwd-quiz',
		'closedpostboxes_sfwd-topic',
		'closedpostboxes_toplevel_page_ultimatemember',
		'closedpostboxes_um_form',
		'closedpostboxes_um_role',
		'closedpostboxes_wpfront-user-role-editor-add-new',
		'comment_shortcuts',
		'cover_photo',
		'credly_user_enable',
		'credly_user_id',
		'dismissed_wp_pointers',
		'full_name',
		'managenav-menuscolumnshidden',
		'managetablepress_listcolumnshidden',
		'meta-box-order_dashboard',
		'meta-box-order_page',
		'meta-box-order_sfwd-courses',
		'meta-box-order_sfwd-lessons',
		'meta-box-order_sfwd-topic',
		'meta-box-order_um_form',
		'meta-box-order_um_role',
		'metaboxhidden_dashboard',
		'metaboxhidden_groups',
		'metaboxhidden_nav-menus',
		'metaboxhidden_page',
		'metaboxhidden_sfwd-courses',
		'metaboxhidden_sfwd-lessons',
		'metaboxhidden_sfwd-quiz',
		'metaboxhidden_sfwd-topic',
		'metaboxhidden_toplevel_page_ultimatemember',
		'metaboxhidden_um_form',
		'metaboxhidden_um_role',
		'metaboxhidden_wpfront-user-role-editor-add-new',
		'nav_menu_recently_edited',
		'nickname',
		'profile_privacy',
		'q_eud_exports',
		'rich_editing',
		'reset_pass_hash',
		'screen_layout_page',
		'screen_layout_sfwd-courses',
		'screen_layout_sfwd-lessons',
		'screen_layout_sfwd-topic',
		'screen_layout_um_form',
		'screen_layout_um_role',
		'session_tokens',
		'show_admin_bar_front',
		'show_welcome_panel',
		'um-notifyme',
		'use_ssl',
		'wp_capabilities',
		'wp_dashboard_quick_press_last_post_id',
		'wp_r_tru_u_x',
		'wp_tablepress_user_options',
		'wp_user-settings',
		'wp_user-settings-time',
		'wp_user_level',
	);

	function __construct() {
		$this->current_user      = wp_get_current_user();
		$this->courses 			 = $this->get_courses();
		$this->course_meta       = $this->get_course_meta($this->courses);
		$this->lessons			 = $this->get_lessons();
		$this->categories		 = $this->get_course_categories($this->courses);
		$this->unique_categories = $this->encode_unique_categories($this->categories);
		$this->user_data         = $this->get_current_users();
		$this->user_meta         = $this->get_current_users_meta($this->user_data);
	}

	/**
	 * "Getter" function for users within the current user's institution
	 *
	 * @author Derek P Sifford
	 * @since 0.0.1
	 *
	 * @return mixed[] Associative array of users within the current user's Institution
	 */
	private function get_current_users() {
		$users = get_users(array(
			'meta_key' => 'residency_us_em',
			'meta_value' => $this->current_user->residency_us_em,
			'fields' => 'all_with_meta'
		));
		foreach ($users as $key => $value) {
			unset($value->data->user_pass);
		}
		return $users;
	}

	/**
	 * "Getter" function for metadata of current users
	 *
	 * @author Derek P Sifford
	 * @since 0.0.1
	 *
	 * @param  mixed[] $users_array Associative array of users within current user's institution
	 *
	 * @return mixed[] Associative array of metadata with keys the same as the
	 *                 keys of the current_user array.
	 */
	private function get_current_users_meta($users_array) {
		$meta = array();
		$need_to_unserialize = array(
			'_badgeos_achievements',
			'_badgeos_active_achievements',
			'_badgeos_triggered_triggers',
			'_sfwd-quizzes',
			'_sfwd-course_progress',
		);

		foreach ($users_array as $key => $value) {
			$meta[$key] = get_user_meta($users_array[$key]->data->ID);
			$completed_courses = array();
			$accessed_courses= array();

			foreach ($meta[$key] as $k => $v) {

				// Skip stuff that we don't need
				if (in_array($k, $this->skipped_usermeta)
				||  preg_match('/^learndash_group_users_/', $k)
				||  preg_match('/^learndash_group_leaders_/', $k)) {
					unset($meta[$key][$k]);
					continue;
				}

				// Turn all keys to camelCase
				$camel_key = preg_replace_callback(
					'/(?<!^)[-_]\w/',
					function($matches) {
        				return strtoupper($matches[0][1]);
					},
					$k
				);

				// Remove "private" underscores
				$camel_key = preg_replace('/^[_]/', '', $camel_key);

				// Unserialize data that needs it
				if (in_array($k, $need_to_unserialize)) {

					// Remove sfwd because it makes absolutely zero sense.
					if ($k == '_sfwd-course_progress' || $k == '_sfwd-quizzes') {
						$camel_key = strtolower(substr($camel_key, 4, 1)) . substr($camel_key, 5);
					}

					$meta[$key][$camel_key] = unserialize($meta[$key][$k][0]);
					unset($meta[$key][$k]);
					continue;
				}

				// Reshape the completed courses data
				if (preg_match('/^course_completed_/', $k)) {
					preg_match('/(^course_completed_)(\d+)/', $k, $matches);
					$completed_courses[intval($matches[2])] = intval($meta[$key][$k][0]);
					unset($meta[$key][$k]);
					continue;
				}

				if (preg_match('/course_\d+_access_from/', $k)) {
					preg_match('/(course_(\d+)_access_from)/', $k, $matches);
					$accessed_courses[intval($matches[2])] = intval($meta[$key][$k][0]);
					unset($meta[$key][$k]);
					continue;
				}

				// Parse graduation year, lastLogin, and badgeosPoints as integers
				if ($k == 'au_graduation_year'
				||  $k == '_um_last_login'
				||  $k == '_badgeos_points') {
					$meta[$key][$camel_key] = intval($meta[$key][$k][0]);
					unset($meta[$key][$k]);
					continue;
				}

				// Reshape em_resident to boolean
				if ($k == 'em_resident') {
					$meta[$key][$camel_key] = $meta[$key][$k][0] == 'Yes' ? true : false;
					unset($meta[$key][$k]);
					continue;
				}

				// Reshape User Agreement to boolean
				if ($k == 'user_agreement') {
					$meta[$key][$camel_key] = $meta[$key][$k][0] == 'I Agree' ? true : false;
					unset($meta[$key][$k]);
					continue;
				}

				// $meta[$key][$k] = $meta[$key][$k][0];
				$meta[$key][$camel_key] = $meta[$key][$k][0];

				if ($k != $camel_key) {
					unset($meta[$key][$k]);
				}
			}
			$meta[$key]['ID'] = intval($users_array[$key]->data->ID);
			$meta[$key]['displayName'] = $users_array[$key]->data->display_name;
			$meta[$key]['email'] = $users_array[$key]->data->user_email;
			$meta[$key]['username'] = $users_array[$key]->data->user_login;
			$meta[$key]['registerDate'] = $users_array[$key]->data->user_registered;
			$meta[$key]['courseCompleted'] = $completed_courses;
			$meta[$key]['courseAccessed'] = $accessed_courses;
		}
		return $meta;
	}

	/**
	 * "Getter" function for course metadata
	 *
	 * @author Derek P Sifford
	 * @since 0.0.2
	 *
	 * @param  mixed[] $posts Associative array of course post objects
	 *
	 * @return mixed[] Associative array of metadata
	 */
	private function get_course_meta($courses) {
		$meta = array();
		foreach ($courses as $key => $value) {
			$this_meta = get_metadata('post', $key );
			$meta[$key]['recommendedHours'] = intval(unserialize($this_meta['_au-meta'][0])['au-recommended_hours']);
			// $meta[$key]['learnDashMeta'] = unserialize($this_meta['_sfwd-courses'][0]);
			$learndash_meta = unserialize($this_meta['_sfwd-courses'][0]);

			foreach($learndash_meta as $k => $v) {
				$camel_key = preg_replace_callback(
					'/(?<!^)[-_]\w/',
					function($matches) {
        				return strtoupper($matches[0][1]);
					},
					$k
				);
				$camel_key = preg_replace_callback(
    				'/^(sfwdCourses\w(ourse\w)?)/',
					function($match) {
						return strtolower($match[0][strlen($match[0])-1]);
					}, $camel_key
				);
				$meta[$key][$camel_key] = $v;
			}

		}
		return $meta;
	}

	/**
	 * Helper function to unserialize a specific meta field.
	 *
	 * @author Derek P Sifford
	 * @since 0.0.1
	 *
	 * @param  string  $meta_key        The key name of the data we're interested in
	 * @param  mixed[] $user_meta_array Associative array containing the user meta
	 *
	 * @return mixed[] Array containing the unserialized meta field for each user.
	 *                 The keynames of the array are the same as the user_data array.
	 */
	private function unserialize_the_meta($meta_key, $user_meta_array) {
		$output = array();
		foreach ($user_meta_array as $key => $value) {
			$output[$key] = unserialize($user_meta_array[$key][$meta_key][0]);
		}
		return $output;
	}

	/**
	 * Method that generates a multidimensional array in the form of...
	 *   ```php
	 *   array(
	 *   	$unique_category_1 => array(
	 *   		$course_ID_1,
	 *   		$course_ID_2
	 *   	),
	 *   	$unique_category_2 => array(
	 *   		$course_ID_3,
	 *   		$course_ID_4
	 *   	)
	 *   );
	 *   ```
	 * @author Derek P Sifford
	 * @since 0.1.1
	 *
	 * @param  string[] $categories Array of categories - Key = CourseID, Value = Category
	 *
	 * @return array[string[]] Multidimensional array in the format shown above.
	 */
	private function encode_unique_categories($categories) {
		$unique_holder = array_unique($categories);
		$payload = array();
		foreach($unique_holder as $unique) {
			$payload[$unique] = array();
		}
		foreach($categories as $key => $value) {
			$payload[$value][$key] = $key;
		}
		return $payload;
	}

	/**
	 * Helper function to retrieve a list categories for all courses
	 *
	 * @author Derek P Sifford
	 * @since 0.0.3
	 *
	 * @param  mixed[] $courses Associative array of all courses (WordPress "Post" Objects)
	 *
	 * @return string[] Associative array of course categories indexed by post ID.
	 */
	private static function get_course_categories($courses) {
		$categories = array();
		foreach ($courses as $key => $value) {
			$categories[$key] = get_the_category($key)[0]->name;
		}
		return $categories;
	}

	/**
	 * Retrieves an array containing all courses and relevant information
	 *
	 * @author Derek P Sifford
	 * @since 0.1.0
	 *
	 * @return mixed[] Array of arrays containing course information; Key = Course ID
	 */
	private static function get_courses() {
		global $wpdb;

		$course_query = $wpdb->get_results("
			SELECT ID
			FROM $wpdb->posts
			WHERE post_type = 'sfwd-courses'
		");

		$course_holder = array();

		foreach($course_query as $course) {
			$raw_course = get_post($course->ID);
			$course_holder[$course->ID] = array(
				"ID" => $raw_course->ID,
				"postAuthor" => intval($raw_course->post_author),
				"postDate" => $raw_course->post_date,
				"postModified" => $raw_course->post_modified,
				"postTitle" => $raw_course->post_title,
			);
		}
		return $course_holder;
	}

	/**
	 * Retrieves an array containing all lessons and relevant information
	 *
	 * @author Derek P Sifford
	 * @since 0.1.0
	 *
	 * @return mixed[] Array of arrays containing lesson information; Key = lesson ID
	 */
	private static function get_lessons() {
		global $wpdb;

		$lesson_query = $wpdb->get_results("
			SELECT ID
			FROM $wpdb->posts
			WHERE post_type = 'sfwd-lessons'
		");

		$lesson_holder = array();

		foreach ($lesson_query as $lesson) {
			$raw_lesson = get_post($lesson->ID);
			$lesson_holder[$lesson->ID] = array(
				"ID" => intval($lesson->ID),
				"menuOrder" => $raw_lesson->menu_order,
				"postAuthor" => intval($raw_lesson->post_author),
				"postDate" => $raw_lesson->post_date,
				"postModified" => $raw_lesson->post_modified,
				"postTitle" => $raw_lesson->post_title,
			);
		}

		return $lesson_holder;

	}

}

$au_dashboard = new AU_Educator_Dashboard();

wp_localize_script(
	'EducatorDashboard',
	'AU_EducatorData',
	array(
		'users' => $au_dashboard->user_meta,
		'currentUser' => array(
			'ID' => $au_dashboard->current_user->ID,
			'meta' => $au_dashboard->user_meta[$au_dashboard->current_user->ID],
		),
		'courseData' => array(
			'courseMeta' => $au_dashboard->course_meta,
			'courses' => $au_dashboard->courses,
			'lessons' => $au_dashboard->lessons,
			'categories' => $au_dashboard->unique_categories,
		)
	)
);

?>

<div id="educator-dashboard"></div>
