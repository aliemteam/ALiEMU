<?php
$user = wp_get_current_user();
$assets = get_stylesheet_directory_uri() . '/assets';
get_header();
?>
<div id="main-content" class="au-homepage">
<?php while (have_posts()) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="entry-content">
        <div id="particles"></div>
        <div id="row-1">
            <div class="au-container">
                <div class="au-logo">
                    <img src="<?php echo $assets; ?>/aliemu-logo-horizontal.svg" alt="logo" />
                </div>
                <div class="au-splash">
                    <?php if (!is_user_logged_in()): ?>
                        <div class="au-general">
                            <div>
                                <h1>General Members</h1>
                            </div>
                            <div>
                                <a href="#row-4">Register Here</a>
                            </div>
                        </div>
                        <div class="au-faculty">
                            <div>
                                <h1>EM Residency Program Directors</h1>
                            </div>
                            <div>
                                <a href="/faculty-start">Register Here</a>
                            </div>
                        </div>
                        <div class="au-login">
                            <div>
                                <a href="#row-2" id="login">Learn More</a>
                            </div>
                        </div>
                    <?php else: ?>
                        <div class="au-general">
                            <div>
                                <h1 class="au-loggedin">Welcome back, <?php echo $user->first_name; ?></h1>
                            </div>
                            <div>
                                <a href="/user">My Profile</a>
                                <a href="/logout-2">Logout</a>
                            </div>
                        </div>
                        <div class="au-series-logos au-alt-logos">
                            <!-- <div>
                                <a href="/capsules"><img src="<?php echo $assets; ?>/capsules-logo.svg" alt="Capsules Button"/></a>
                            </div> -->
                            <div>
                                <a href="/air"><img src="<?php echo $assets; ?>/air-logo.svg" alt="AIR Button"/></a>
                            </div>
                            <div>
                                <a href="/air-pro"><img src="<?php echo $assets; ?>/air-pro-logo.svg" alt="AIR-Pro Button"/></a>
                            </div>
                            <div>
                                <a href="/capsules"><img src="<?php echo $assets; ?>/capsules-logo.svg" alt="Capsules Button"/></a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <?php if (!is_user_logged_in()): ?>
            <!-- Row 2 -->
            <div id="row-2">
                <div class="au-container">
                    <div class="au-info-card">
                        <div class="au-info-header">
                            <h1>What is ALiEMU?</h1>
                        </div>
                        <div class="au-info-text">
                            ALiEMU is an open-access, on-demand, online school of e-courses for anyone practicing Emergency Medicine worldwide. We serve as a platform where educators can submit e-courses, whereupon each will undergo expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. Only high-quality, vetted courses relevant to the EM community are published as an on-demand course on ALiEMU. <a href="/about" aria-label="Click here to learn more">Click here</a> to learn more about ALiEMU and the courses offered.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Row 3 -->
            <div id="row-3">
                <div class="au-container">
                    <div class="au-info-card">
                        <div class="au-info-header">
                            <h1>Click a series to learn more</h1>
                        </div>
                        <div class="au-series-logos">
                            <!-- <div>
                                <a href="/capsules"><img src="<?php echo $assets; ?>/capsules-logo.svg" alt="Capsules Button"/></a>
                            </div> -->
                            <div>
                                <a href="/air"><img src="<?php echo $assets; ?>/air-logo.svg" alt="AIR Button"/></a>
                            </div>
                            <div>
                                <a href="/air-pro"><img src="<?php echo $assets; ?>/air-pro-logo.svg" alt="AIR-Pro Button"/></a>
                            </div>
                            <div>
                                <a href="/capsules"><img src="<?php echo $assets; ?>/capsules-logo.svg" alt="Capsules Button"/></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Row 4 -->
            <div id="row-4">
                <div class="au-container">
                    <div class="au-info-card">
                        <div class="au-info-header">
                            <h1>General Registration</h1>
                        </div>
                        <div class="au-info-text">
                            We welcome learners from every discipline and training level to register and take our courses. Emergency Medicine Faculty with appointments at U.S. Emergency Medicine residency programs should register through our <a href="/faculty-start">faculty registration</a> for access to our Educator Dashboard.
                        </div>
                        <div class="au-info-text">
                            <?php echo do_shortcode('[ultimatemember form_id=52]'); ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</article>
<?php endwhile; ?>
</div>
<?php get_footer();
