<?php get_header(); ?>
<div id="main-content" class="au-homepage">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <div id="particles"></div>
                <?php
                    if ( !is_user_logged_in()) {
                        echo( '<div id="row-1">
                                    <div class="au-container">
                                        <div class="au-logo">
                                            <img src="/wp-content/uploads/2016/06/ALiEMU-logo-long.png" alt="" />
                                        </div>
                                        <div class="au-splash">
                                            <div class="au-general">
                                                <div><h1>General Members</h1></div>
                                                <div><a href="/register">Register Here</a></div>
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
                                </div>');
                    } else {
                        echo ('
                                <div id="row-2">
                                    <div class="au-container">
                                        <div class="au-info-card">
                                            <div class="au-info-header"><h1>Welcome to ALiEMU</h1></div>
                                            <div class="au-info-text"><p>Thank you for registering for ALiEMU! ALiEMU is a learning management system that provides open-access, on-demand, and online e-courses for anyone practicing Emergency Medicine (EM) worldwide. With our 2016 launch, we are hosting content created or collected by the ALiEM team. We ultimately envision a robust platform for EM educators to submit and host their own e-courses, whereupon each will have undergone expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. <a href="/about">Click here</a> to learn more about ALiEMU and the courses offered.</p></div>
                                        </div>
                                    </div>
                                </div>
                                <div id="row-3">
                                    <div class="au-container">
                                        <div class="au-info-card">
                                            <div class="au-info-header"><h1>Choose a series start a course block</h1></div>
                                            <div class="au-series-logos">
                                                <div><a href="/air"><img src="/wp-content/uploads/2016/06/air-button.png"></a></div>
                                                <div><a href="/air-pro"><img src="/wp-content/uploads/2016/06/airpro-button.png"></a></div>
                                                <div><a href="/capsules"><img src="/wp-content/uploads/2016/06/capsules-button.png"></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                ');
                    }
                    ?>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
