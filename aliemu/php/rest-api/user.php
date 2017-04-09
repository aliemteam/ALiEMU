<?php

register_rest_field( 'user',
    'meta',
    array(
        'get_callback'    => array('AU_Rest_User_Fields', 'get'),
        'update_callback' => null,
        'schema'          => null,
    )
);

class AU_Rest_User_Fields {
    public static function get($user, $field_name, $request) {
        // Authentication check
        if (!$request->get_header('X-WP-Nonce') && !current_user_can('administrator')) return [];

        $meta = get_user_meta($user['id']);
        $payload = [
            'completedCourses' => [],
            'graduationYear' => null,
            'lastActivity' => null,
            'group' => [
                'id' => null,
                'members' => [],
            ],
        ];

        foreach ($meta as $key => $value) {

            // Match completed courses
            if (preg_match('/(^course_completed_)(\d+)/', $key, $matches)) {
                $course_id = intval($matches[2]);
                $payload['completedCourses'][$course_id] = [
                    'date' => (int) $value[0] * 1000,
                    'hours' => self::parse_course_hours($course_id),
                ];
            }

            // Match graduation year
            if ($key === 'au_graduation_year') {
                $payload['graduationYear'] = (int) $value[0];
            }

            // Match last activity
            if ($key === '_um_last_login') {
                $payload['lastActivity'] = (int) $value[0] * 1000;
            }

            // Match residency FIXME: Will need to change this to group number eventually
            if ($key === 'residency_us_em') {
                $payload['group']['id'] = $value[0];
                $payload['group']['members'] = self::get_group_members($user['id'], $value, 'residency_us_em');
            }
        }

        return $payload;

    }
    private static function parse_course_hours($course_id) {
        $meta = get_post_meta($course_id, '_sfwd-courses', true);
        return (int) $meta['sfwd-courses_recommendedHours'];
    }
    private static function get_group_members($user_id, $group_id, $group_key) {
        $users = get_users([
            'exclude' => $user_id,
            'meta_key' => $group_key,
            'meta_value' => $group_id,
            'fields' => 'ID',
        ]);
        return array_map('intval', $users);
    }
}
