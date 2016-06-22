<?php get_header(); ?>
<div id="main-content"><?php while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('au-about'); ?>>
        <section id="au-content" class="group">
            <h3>The ALiEMU Content</h3>
            <div id="GroupASub1" class="subgroup">
                <h4>Group A Sub 1</h4>
            </div>
            <div id="GroupASub2" class="subgroup">
                <h4>Group A Sub 2</h4>
            </div>
        </section>


    </article><?php endwhile; ?>
</div>
<?php get_footer(); ?>
