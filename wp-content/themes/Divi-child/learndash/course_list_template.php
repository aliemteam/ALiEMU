<?php
    $post_id = get_the_id();
	$course_options = get_post_meta($post_id, '_sfwd-courses', true);
	$au_meta = get_post_meta( $post_id, '_au-meta', true );
	$au_recommended_iii_hours = $au_meta['au-recommended_hours'];
	$au_recommended_iii_hours .= ($au_recommended_iii_hours == 1 ? ' hour' : ' hours');
    $category = get_the_category();

    if (!$category) return;

    $category = $category[0]->cat_name;

    ?>

    <div class="au-coursebox">
        <article id="post-<?php echo $post_id; ?>" <?php post_class('thumbnail course'); ?> >
            <div <?php post_class(array('thumbnail course', 'au-courseheader')); ?>>
                <div class="au-timer">
                    <h2> <?php echo $au_recommended_iii_hours; ?> </h2>
                </div>
            </div>

            <div class="au-coursebody">
                <div class="coursebox-flex"><h3><?php echo $category; ?></h3></div>
                <div class="coursebox-flex"><h1><?php the_title(); ?></h1></div>
                <div class="coursebox-flex"><p><?php echo $course_options['sfwd-courses_course_short_description']; ?></p></div>
                <div class="coursebox-flex"> <a href="<?php the_permalink(); ?>">View Block</a> </div>
            </div>
        </article>
    </div>

    <?php
