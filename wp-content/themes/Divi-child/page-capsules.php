<?php get_header(); ?>
<div id="main-content"><?php while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('category-capsules'); ?>>
        <div class="au-card">
            <div class="au-heading">
                <h1>Capsules: Practical Pharmacology for the Emergency Medicine Practitioner</h1>
            </div>
            <div class="au-content">
                <div class="au-text">
                    <div>
                        Welcome to the <a href="/about/#au-about-capsules">Capsules series</a>! This series is a free, online e-curriculum of high-quality, current, and practical pharmacology knowledge for the EM practitioner. About once a month a new course block is released with lessons and brief quizzes to complete. All modules are written by two pharmacist team members and then peer-reviewed by a separate pharmacist and physician. The Capsules series’ primary focus is bringing EM pharmacology education to the bedside. Our expert team distills complex pharmacology principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner.
                    </div>
                </div>
                <div class="au-image">
                    <img src="https://www.aliemu.com/wp-content/uploads/2016/06/capsules-badge.png"/>
                </div>
            </div>
        </div>
        <div class="au-course-boxes au-no-scroll">
            <?php echo do_shortcode('[ld_course_list category_name="capsules"]'); ?>
        </div>
    </article><?php endwhile; ?>
</div>
<?php get_footer(); ?>
