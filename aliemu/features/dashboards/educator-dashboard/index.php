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
class EducatorDashboard {

	public $current_user;
	public $courses;
	public $course_meta;
	public $lessons;
	public $unique_categories;
	public $user_meta;
	private $categories;
	private $user_data;
	private $skipped_usermeta = [
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
	];

	function __construct() {
		$this->current_user      = wp_get_current_user();
		$this->courses 			 = $this->getCourses();
		$this->course_meta       = $this->getCourseMeta($this->courses);
		$this->lessons			 = $this->getLessons();
		$this->categories		 = $this->getCourseCategories($this->courses);
		$this->unique_categories = $this->encodeUniqueCategories($this->categories);
		$this->user_data         = $this->getCurrentUsers();
		$this->user_meta         = $this->getCurrentUsersMeta($this->user_data);
	}

	/**
	 * "Getter" function for users within the current user's institution
	 *
	 * @author Derek P Sifford
	 * @since 0.0.1
	 *
	 * @return mixed[] Associative array of users within the current user's Institution
	 */
	private function getCurrentUsers() {
		$graduatedUsers = get_users([
			'meta_key' => 'au_graduation_year',
			'meta_value' => date('Y'),
			'meta_compare' => '<',
			'exclude' => $this->current_user->ID,
			'fields' => 'ID'
		]);

		$users = get_users([
			'meta_key' => 'residency_us_em',
			'meta_value' => $this->current_user->residency_us_em,
			'fields' => 'all_with_meta',
			'exclude' => $graduatedUsers
		]);
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
	private function getCurrentUsersMeta($users_array) {
		$meta = [];
		$need_to_unserialize = [
			'_badgeos_achievements',
			'_badgeos_active_achievements',
			'_badgeos_triggered_triggers',
			'_sfwd-quizzes',
			'_sfwd-course_progress',
		];

		foreach ($users_array as $key => $value) {
			$meta[$key] = get_user_meta($users_array[$key]->data->ID);
			$completed_courses = [];
			$accessed_courses= [];

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
	private function getCourseMeta($courses) {
		$meta = [];
		foreach ($courses as $key => $value) {
			$thisMeta = get_metadata('post', $key );
			$meta[$key]['recommendedHours'] = @intval(unserialize($thisMeta['_au-meta'][0])['au-recommended_hours']);
			$learndashMeta = @unserialize($thisMeta['_sfwd-courses'][0]);

            if (!$learndashMeta) continue;

			foreach($learndashMeta as $k => $v) {
				$camelKey = preg_replace_callback(
					'/(?<!^)[-_]\w/',
					function($matches) {
        				return strtoupper($matches[0][1]);
					},
					$k
				);
				$camelKey = preg_replace_callback(
    				'/^(sfwdCourses\w(ourse\w)?)/',
					function($match) {
						return strtolower($match[0][strlen($match[0])-1]);
					}, $camelKey
				);
				$meta[$key][$camelKey] = $v;
			}

		}
		return $meta;
	}

	/**
	 * Method that generates a multidimensional array in the form of...
	 *   ```php
	 *   [
	 *   	$unique_category_1 => [
	 *   		$course_ID_1,
	 *   		$course_ID_2
	 *   	],
	 *   	$unique_category_2 => [
	 *   		$course_ID_3,
	 *   		$course_ID_4
	 *   	]
	 *   ];
	 *   ```
	 * @author Derek P Sifford
	 * @since 0.1.1
	 *
	 * @param  string[] $categories Array of categories - Key = CourseID, Value = Category
	 *
	 * @return array[string[]] Multidimensional array in the format shown above.
	 */
	private function encodeUniqueCategories($categories) {
		$uniqueHolder = array_unique($categories);
		$payload = [];
		foreach($uniqueHolder as $unique) {
			$payload[$unique] = [];
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
	private static function getCourseCategories($courses) {
		$categories = [];
		foreach ($courses as $key => $value) {
            $category = get_the_category($key);
            if (!$category) continue;
            $categories[$key] = $category[0]->name;
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
	private static function getCourses() {
		global $wpdb;

		$courseQuery = $wpdb->get_results("
			SELECT ID
			FROM $wpdb->posts
			WHERE post_type = 'sfwd-courses'
		");

		$courseHolder = [];

		foreach($courseQuery as $course) {
			$lessonQuery = $wpdb->get_results("
				SELECT post_id
				FROM $wpdb->postmeta
				WHERE meta_key = 'course_id'
				AND meta_value = $course->ID
			");
			$lessons = [];
			foreach ($lessonQuery as $key => $val) {
				array_push($lessons, $val->post_id);
			}
			$c = get_post($course->ID);
			$courseHolder[$course->ID] = [
				"ID" => $c->ID,
				"postAuthor" => intval($c->post_author),
				"postDate" => $c->post_date,
				"postModified" => $c->post_modified,
				"postTitle" => $c->post_title,
				"lessons" => $lessons,
			];
		}
		return $courseHolder;
	}

	/**
	 * Retrieves an array containing all lessons and relevant information
	 *
	 * @author Derek P Sifford
	 * @since 0.1.0
	 *
	 * @return mixed[] Array of arrays containing lesson information; Key = lesson ID
	 */
	private static function getLessons() {
		global $wpdb;

		$lessonQuery = $wpdb->get_results("
			SELECT ID
			FROM $wpdb->posts
			WHERE post_type = 'sfwd-lessons'
		");

		$lessonHolder = [];

		foreach ($lessonQuery as $lesson) {
			$l = get_post($lesson->ID);
			$lessonHolder[$lesson->ID] = [
				"ID" => intval($lesson->ID),
				"menuOrder" => $l->menu_order,
				"postAuthor" => intval($l->post_author),
				"postDate" => $l->post_date,
				"postModified" => $l->post_modified,
				"postTitle" => $l->post_title,
			];
		}

		return $lessonHolder;

	}

}

$au_dashboard = new EducatorDashboard();

wp_localize_script(
	'EducatorDashboard',
	'AU_EducatorData',
	[
		'users' => $au_dashboard->user_meta,
		'currentUser' => [
			'ID' => $au_dashboard->current_user->ID,
			'meta' => $au_dashboard->user_meta[$au_dashboard->current_user->ID],
		],
		'courseData' => [
			'courseMeta' => $au_dashboard->course_meta,
			'courses' => $au_dashboard->courses,
			'lessons' => $au_dashboard->lessons,
			'categories' => $au_dashboard->unique_categories,
		]
	]
);
wp_enqueue_script('EducatorDashboard');

?>

<div id="educator-dashboard"></div>
