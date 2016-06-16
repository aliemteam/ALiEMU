<?php get_header(); ?>
<div id="main-content">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <div id="particles"></div>
                <div id="row-1">
                  <div class="au-main-container">
                    <div class="au-logo">
                        <img src="/wp-content/uploads/2016/06/ALiEMU-logo-long.png" alt="" />
                    </div>
                    <div class="au-splash">
                      <div class="au-login">
                        <a href="#">Register</a>
                        <a href="#">Login</a>
                      </div>
                      <div class="au-faculty">
                        <div><h1>Emergency Medicine Faculty</h1></div>
                        <div><a href="#">Start Here</a></div>
                      </div>
                      <div class="au-learn-more">
                        <div><a href="#row-2" id="learn-more">Learn More</a></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="row-2">
                    <div class="au-container">
                        <div class="au-splash">
                            <div class="au-info-card">
                                <div class="au-info-header"><h1>What is ALiEMU?</h1></div>
                                <div class="au-info-text"><p>ALiEMU can best be thought of as our open-access, on-demand, online school of e-courses for anyone practicing Emergency Medicine worldwide. We ultimately envision serving as a platform where educators can submit e-courses, whereupon each will undergo expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. Only high-quality, vetted courses relevant to the EM community will be published as an on-demand course on ALiEMU.</p></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="au-sponsors">
                    <div>
                        <a href="http://www.cordem.org/" target="_blank"><img src="https://www.aliemu.com/wp-content/uploads/2016/06/CORD-EM-transp.png"></a>
                    </div>
                    <div>
                        <a href="http://www.theteachingcourse.com/" target="_blank"><img src="https://www.aliemu.com/wp-content/uploads/2016/06/Teaching-Course-Logo.png"></a>
                    </div>
                </div>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
