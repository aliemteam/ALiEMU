<?php

/**
 * Adds "Course Short Description" field to the block meta.
 * @param  [type] $post_args [description] // FIXME: Chris what type is this?
 * @return [type]            [description]
 */
function learndash_course_grid_post_args($posts) {
    foreach($posts as $key => $post) {
		if($post["post_type"] !== "sfwd-courses") continue;

        $extraFields = [
            'course_short_description' => [
                'name' => 'Course Short Description',
                'type' => 'textarea',
                'help_text' => 'A short description of the course to show on course list generated by course list shortcode.',
            ],
            'recommendedHours' => [
                'name' => 'Recommended III Hours',
                'type' => 'text',
                'help_text' => 'The amount of hours that you recommend students claim for this course.',
            ],
        ];

        $posts[$key]["fields"] = $posts[$key]["fields"] + $extraFields;
	}
	return $posts;
}
add_filter("learndash_post_args", "learndash_course_grid_post_args", 10, 1);