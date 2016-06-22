<?php get_header(); ?>
<div id="main-content" class="au-faculty-start">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <div id="particles"></div>
                <div id="row-1">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Attention</h1></div>
                            <div class="au-info-text"><p>This page is intended for those with faculty appointments at U.S. Emergency Medicine residency programs. We welcome all learners to use and learn from ALiEMU, however we have built features that are only intended for U.S. Emergency Medicine faculty accounts. If you are are not a faculty representative at a U.S. Emergency Medicine residency program, then <a href="">click here</a> to return to the general registration page. We hope to offer our special educator features to international residency programs in the future.</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
