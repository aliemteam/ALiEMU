<?php get_header(); ?>
<div id="main-content"><?php while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('category-air-pro'); ?>>
        <div class="au-card">
            <div class="au-heading">
                <h1>Approved Instructional Resources Professional (AIR-Pro) series</h1>
            </div>
            <div class="au-content">
                <div class="au-text">
                    <div>
                        Welcome to the Approved Instructional Resources Professional (AIR-Pro) series! This series screens and grades open access blog posts and podcasts in the field of emergency medicine (EM) to identify high quality, social media-based, educational resources for senior EM residents. Unlike the AIR-Series, this series targets more advanced practitioners and is no longer limited to content published with the past 12 months. This series fulfills Individualized Interactive Instruction (III), or asynchronous online learning, conference needs. Below are the AIR-Pro blocks listed in reverse chronological order along with their suggested number of III conference hour credit. If you are a program director and wish to track your residents’ progress, please sign up for our Educator Dashboard access.
                    </div>
                </div>
                <div class="au-image">
                    <img src="https://www.aliemu.com/wp-content/uploads/2016/06/airpro-badge.png"/>
                </div>
            </div>
        </div>
        <div class="au-links-row">
            <a href="#year-2016">2016</a>
            <a href="#year-2015">2015</a>
        </div>
        <div class="au-year-row" id="year-2016">
            <div class="au-year">
                <h1>2016</h1>
            </div>
            <div class="au-course-boxes">
                <?php echo do_shortcode('[ld_course_list category_name="air-pro" tag="2016"]'); ?>
            </div>
        </div>
        <div class="au-year-row" id="year-2015">
            <div class="au-year">
                <h1>2015</h1>
            </div>
            <div class="au-course-boxes">
                <?php echo do_shortcode('[ld_course_list category_name="air-pro" tag="2015"]'); ?>
            </div>
        </div>
    </article><?php endwhile; ?>
</div>
<?php get_footer(); ?>
