<?php

add_filter("the_content", "learndash_course_grid_css");
function learndash_course_grid_css($content) {
	if(strpos($content, "[ld_course_list") === false) {
		return $content;
	}

	return $content;
}

add_filter("learndash_post_args", "learndash_course_grid_post_args", 10, 1);
function learndash_course_grid_post_args($post_args) {
	foreach($post_args as $key => $post_arg) {
		if($post_arg["post_type"] == "sfwd-courses") {
			$course_short_description = array(
                                              'name' => __('Course Short Description', 'learndash_course_grid'),
                                              'type' => 'textarea',
                                              'help_text' => __('A short description of the course to show on course list generated by course list shortcode.', 'learndash_course_grid'),
                                            );
			$post_args[$key]["fields"] = array("course_short_description" => $course_short_description) + $post_args[$key]["fields"];
		}
	}
	return $post_args;
}

add_filter( 'learndash_template', 'learndash_course_grid_course_list', 99, 5);
function learndash_course_grid_course_list($filepath, $name, $args, $echo, $return_file_path) {

	if($name != "course_list_template") {
		return $filepath;
	}

	$post_id = get_the_id();
	$course_options = get_post_meta($post_id, '_sfwd-courses', true);
	$au_meta = get_post_meta( $post_id, '_au-meta', true );
	$au_recommended_iii_hours = $au_meta['au-recommended_hours'];
	$au_recommended_iii_hours .= ($au_recommended_iii_hours == 1 ? ' hour' : ' hours');

	?>

	<div class="au-coursebox">
		<article id="post-<?php echo $post_id; ?>" <?php post_class('thumbnail course'); ?> >
			<div <?php post_class(array('thumbnail course', 'au-courseheader')); ?>>
				<div class="au-timer">
					<h2> <?php echo $au_recommended_iii_hours; ?> </h2>
				</div>
			</div>

			<div class="au-coursebody">
				<div class="coursebox-flex"><h3><?php echo get_the_category()[0]->cat_name; ?></h3></div>
				<div class="coursebox-flex"><h1><?php the_title(); ?></h1></div>
				<div class="coursebox-flex"><p><?php echo $course_options['sfwd-courses_course_short_description']; ?></p></div>
				<div class="coursebox-flex"> <a href="<?php the_permalink(); ?>">View Block</a> </div>
			</div>
		</article><!-- #post-## -->
	</div>

	<?php

}
