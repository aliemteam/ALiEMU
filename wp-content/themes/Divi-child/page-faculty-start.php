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
                            <div class="au-info-text"><p>ALiEMU can best be thought of as our open-access, on-demand, online school of e-courses for anyone practicing Emergency Medicine worldwide. We ultimately envision serving as a platform where educators can submit e-courses, whereupon each will undergo expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. Only high-quality, vetted courses relevant to the EM community will be published as an on-demand course on ALiEMU.</p></div>
                        </div>
                    </div>
                </div>
                <div id="row-3">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Click a series to learn more</h1></div>
                            <div class="au-series-logos">
                                <div><a href="/air"><img src="/wp-content/uploads/2016/06/air-button.png"></a></div>
                                <div><a href="/air-pro"><img src="/wp-content/uploads/2016/06/airpro-button.png"></a></div>
                                <div><a href="/capsules"><img src="/wp-content/uploads/2016/06/capsules-button.png"></a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
