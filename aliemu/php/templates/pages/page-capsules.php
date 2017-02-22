<?php
get_header();
$assets = get_stylesheet_directory_uri() . '/assets';
?>
<div id="main-content">
<div class="container">
<?php while (have_posts()) : the_post(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class('category-capsules'); ?>>
    <div class="card">
        <div class="card__heading category-capsules">Capsules: Practical Pharmacology for the Emergency Medicine Practitioner</div>
        <div class="card__content card__content--split">
            <div>
                Welcome to the <a href="/about/#about-capsules">Capsules Series</a>! This series is a free, online e-curriculum of high-quality, current, and practical pharmacology knowledge for the EM practitioner. About once a month a new course block is released with lessons and brief quizzes to complete. All modules are written by two pharmacist team members and then peer-reviewed by a separate pharmacist and physician. The Capsules series’ primary focus is bringing EM pharmacology education to the bedside. Our expert team distills complex pharmacology principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner.
            </div>
            <div>
                <img src="<?php echo $assets; ?>/capsules-logo.svg" alt="Capsules Logo" width="200px"/>
            </div>
        </div>
    </div>
    <div class="content-area course-list">
        <div class="course-boxes">
            <?php echo do_shortcode('[ld_course_list category_name="capsules"]'); ?>
        </div>
    </div>
</article>

<?php endwhile; ?>
</div>
</div>
<?php get_footer();
