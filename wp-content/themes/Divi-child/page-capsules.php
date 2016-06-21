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
                        Welcome to the <a href="">Capsules: Practical Pharmacology for the Emergency Medicine Practitioner!</a> The Capsules series was conceived in response to a perceived deficiency of EM pharmacology information in Free Open Access Meducation (FOAM) resources. Led by creator Dr. Bryan Hayes, the Capsules series’ primary focus is bringing EM pharmacology education to the bedside by distilling complex principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner. Our secondary aim is to provide U.S. EM residency programs with an objective method for evaluating residents at each level of the Pharmacotherapy milestone as outlined by ACGME. We have assembled an outstanding team of pharmacists from around the country to create and review each module. In addition, we have several outstanding physician colleagues to peer-review each module after review by our pharmacist team. If you’re not already familiar with Capsules, then <a href="">click here</a> for the full description of what it is and why we created it.
                    </div>
                </div>
                <div class="au-image">
                    <img src="https://www.aliemu.com/wp-content/uploads/2016/06/air-badge.png"/>
                </div>
            </div>
        </div>
        <div class="au-course-boxes au-no-scroll">
            <?php echo do_shortcode('[ld_course_list category_name="capsules"]'); ?>
        </div>
    </article><?php endwhile; ?>
</div>
<?php get_footer(); ?>
