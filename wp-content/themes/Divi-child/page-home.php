<?php get_header(); ?>
<div id="main-content" class="au-homepage">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <div id="particles"></div>
                <div id="row-1">
                    <div class="au-container">
                        <div class="au-logo">
                            <img src="/wp-content/uploads/2016/06/ALiEMU-logo-long.png" alt="" />
                        </div>
                        <div class="au-splash">
                            <div class="au-general">
                                <div><h1>General Members</h1></div>
                                <div><a href="#row-4">Register Here</a></div>
                            </div>
                            <div class="au-faculty">
                                <div><h1>EM Residency Faculty</h1></div>
                                <div><a href="/faculty-start">Register Here</a></div>
                            </div>
                            <div class="au-login">
                                <div><a href="/login" id="login">Login</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-2">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>What is ALiEMU?</h1></div>
                            <div class="au-info-text"><p>ALiEMU can best be thought of as our open-access, on-demand, online school of e-courses for anyone practicing Emergency Medicine worldwide. We ultimately envision serving as a platform where educators can submit e-courses, whereupon each will undergo expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. Only high-quality, vetted courses relevant to the EM community will be published as an on-demand course on ALiEMU. <a href="/about">Click here</a> to learn more about ALiEMU and the courses offered.</p></div>
                        </div>
                    </div>
                </div>
                <div id="row-3">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Click a series to learn more</h1></div>
                            <div class="au-series-logos">
                                <div><a href="/about/#au-about-air"><img src="/wp-content/uploads/2016/06/air-button.png"></a></div>
                                <div><a href="/about/#au-about-air-pro"><img src="/wp-content/uploads/2016/06/airpro-button.png"></a></div>
                                <div><a href="/about/#au-about-capsules"><img src="/wp-content/uploads/2016/06/capsules-button.png"></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-4">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>General Registration</h1></div>
                            <div class="au-info-text"><p>We welcome learners from every discipline and training level to register and take our courses. Emergency Medicine Faculty with appointments at U.S. Emergency Medicine residency programs should register through our <a href="/faculty-start">faculty registration</a> for access to our Educator Dashboard.</p></div>
                            <div class="au-info-text"><?php echo do_shortcode('[ultimatemember form_id=52]'); ?></div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
