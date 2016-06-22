<?php get_header(); ?>
<div id="main-content" class="au-faculty-start">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="entry-content">
                <div id="particles"></div>
                <div id="row-2">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Attention</h1></div>
                            <div class="au-info-text"><p>This page is intended for those with faculty appointments at U.S. Emergency Medicine residency programs. We welcome all learners to use and learn from ALiEMU, however we have built features that are only intended for U.S. Emergency Medicine faculty accounts. If you are are not a faculty representative at a U.S. Emergency Medicine residency program, then <a href="">click here</a> to return to the general registration page. We hope to offer our special educator features to international residency programs in the future.</p></div>
                        </div>
                    </div>
                </div>
                <div id="row-3">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Welcome</h1></div>
                            <div class="au-info-text">
                                <p>Welcome to ALiEMU! We are proud to provide a free service to your program’s educational efforts with an innovative platform aimed at enhancing the content and tracking of Individualized Interactive Instruction (III) for your learners. In order to begin using the interface as a supplement to your curriculum, please follow the steps below to:</p>
                                <ol>
                                    <li><a href="#row-6">Register</a> for a special faculty account.</li>
                                    <li>Gain access to the Educator Dashboard</li>
                                    <li>Learn how to export module completion data of your trainees</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-4">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>What is III?</h1></div>
                            <div class="au-info-text">
                                <p>In 2008, the Residency Review Committee (RRC) in Emergency Medicine as well as the Accreditation Council for Graduate Medical Education (ACGME) endorsed a change in the education hours requirements for residencies. Previously, five hours of educational conference time was required per week. The new recommendation allows residencies to decrease their conference time to four hours per week with an additional one hour of documented asynchronous learning outside the classroom. This series abides by the CORD and ACGME’s requirements for III. Upon request, all EM program directors will have access to our master read-only list of residents who complete the quiz. In addition, faculty on our Executive Board will engage with residents in the blog comment section for questions and comments that arise during reading.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-5">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>How does this count for III credit?</h1></div>
                            <div class="au-info-text">
                                <p>Per the ACGME and EM RRC [PDF, pg 4-5], III credit depends on fulfilling all 4 of the following criteria, and this is how we address them:</p>
                                <ol>
                                    <li>The program director must monitor resident participation. – We give read-access to PDs.</li>
                                    <li>There must be an evaluation component. – We include quizzes for each block.</li>
                                    <li>There must be faculty oversight. – We have faculty not only screening the content for accuracy and value, but also monitoring the blog comments section if there are questions to reply in a timely fashion.</li>
                                    <li>The activity must be monitored for effectiveness. – We have an internal QI process as well as a post-block survey to incorporate learner feedback.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-6">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Establishing a Faculty Account</h1></div>
                            <div class="au-info-text">
                                <div>
                                    <p>We welcome anyone and everyone from different skill levels, countries, and disciplines to learn on ALiEMU. At the time of this writing, ALiEMU officially supports Educator Dashboard usage to perform resident tracking ONLY for U.S. Emergency Medicine allopathic and osteopathic residency programs. This allows for easier progress tracking for III credit. We have a separate registration page specifically for faculty accounts. To access this registration page, click the Register a Faculty Account button below.</p>
                                    <p>For privacy reasons, only faculty members and those approved by the Residency Program Director (PD) will be granted access to the Educator Dashboard. Please only check the box for Require access to the Educator Dashboard if you are a faculty or staff member at your currently affiliated residency program. We request some basic biographical information in the box that follows in order to confirm your relationship to the residency program you’ve selected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="row-6">
                    <div class="au-container">
                        <div class="au-info-card">
                            <div class="au-info-header"><h1>Faculty Registration Form</h1></div>
                            <div class="au-info-text">
                                <?php echo do_shortcode('[ultimatemember form_id=3434]'); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    <?php endwhile; ?>
</div>
<?php get_footer(); ?>
