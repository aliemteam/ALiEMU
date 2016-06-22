<?php get_header(); ?>
<div id="main-content"><?php while (have_posts()) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('au-about'); ?>>
        <!-- Nav Bar -->
        <nav class="au-about-nav">
            <ul id="about-sidebar">
                <!-- ALiEMU Content -->
                <li>
                    <a href="#au-content">The ALiEMU Content</a>
                </li>
                <!-- ALiEMU Courses Eligible for III or Asynchronous Learning Credit -->
                <li>
                    <a href="#au-content">ALiEMU Courses Eligible for III or Asynchronous Learning Credit</a>
                </li>
                <!-- Capsules -->
                <li>
                    <a href="#au-about-capsules">Capsules Series</a>
                        <ul>
                            <li><a href="#au-capsules-intro">What is the Capsules series?</a></li>
                            <li><a href="#au-capsules-design">Design</a></li>
                        </ul>
                </li>
            </ul>
        </nav>
        <!-- Main Content -->
            <div class="au-about-body">
                <!-- The ALiEMU Content -->
                <section id="au-about-content" class="au-group">
                    <h3>The ALiEMU Content</h3>
                    <p>This is the text copy</p>
                </section>
                <!-- ALiEMU Courses Eligible for III or Asynchronous Learning Credit -->
                <section id="au-about-iii-courses" class="au-group">
                    <h3>ALiEMU Courses Eligible for III or Asynchronous Learning Credit</h3>
                    <ol>
                        <li>Capsules Series: Practical Pharmacology for the Emergency Medicine Practitioner</li>
                        <li>Approved Instructional Resources (AIR) Series</li>
                        <li>Approved Instructional Resources Professional (AIR-Pro) Series</li>
                    </ol>
                </section>
                <!-- Capsules -->
                <section id="au-about-capsules" class="au-group">
                    <h3>Capsules</h3>
                    <div id="au-capsules-intro" class="au-subgroup">
                        <h4>What is the Capsules series?</h4>
                        <p>The Capsules series was conceived in response to a perceived deficiency of EM pharmacology information in Free Open Access Meducation (FOAM) resources. Led by creator Dr. Bryan Hayes, the Capsules series’ primary focus is bringing EM pharmacology education to the bedside by distilling complex principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner. Our secondary aim is to provide U.S. EM residency programs with an objective method for evaluating residents at each level of the Pharmacotherapy milestone (PC5) as outlined by ACGME. We have assembled an outstanding team of pharmacists from around the country to create and review each module. In addition, we have several outstanding physician colleagues who provideto peer-review of eacheach module after review by our pharmacist team. If you’re not already familiar with Capsules, then click here for the full description of what it is and why we created it.</p>
                    </div>
                    <div id="au-capsules-design" class="au-subgroup">
                        <h4>Design</h4>
                        <p>The Capsules series will be composed of separate course modules. Each course module will be broken into multiple lessons which can further be separated into topics. A quiz will be provided at the end of each lesson or topic to reinforce key learning points. All modules are written by two pharmacist team members and then peer-reviewed by a separate pharmacist and physician. In addition, the quizzes will be structured with questions assessing levels 1-4 of the ACGME EM milestones. We are hopeful they may be adapted by EM residency programs as an evaluation method.</p>
                        <p>By breaking down modules into smaller chunks, we allow learners to save their progress and learn on their own time. We also built this platform to be “mobile first” so that learners have a great experience on any device.</p>
                        <p>We have assembled an outstanding team of pharmacists from around the country to create and review each module. In addition, we have several highly-respected physician colleagues to peer-review each module after review by our pharmacist team.</p>
                    </div>
                </section>
                <!-- Capsules -->
                <section id="au-about-iii-courses" class="au-group">
                    <h3>Capsules</h3>
                    <div id="au-capsules-intro" class="au-subgroup">
                        <h4>What is the Capsules series?</h4>
                        <p>The Capsules series was conceived in response to a perceived deficiency of EM pharmacology information in Free Open Access Meducation (FOAM) resources. Led by creator Dr. Bryan Hayes, the Capsules series’ primary focus is bringing EM pharmacology education to the bedside by distilling complex principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner. Our secondary aim is to provide U.S. EM residency programs with an objective method for evaluating residents at each level of the Pharmacotherapy milestone (PC5) as outlined by ACGME. We have assembled an outstanding team of pharmacists from around the country to create and review each module. In addition, we have several outstanding physician colleagues who provideto peer-review of eacheach module after review by our pharmacist team. If you’re not already familiar with Capsules, then click here for the full description of what it is and why we created it.</p>
                    </div>
                    <div id="au-about-capsules-design" class="au-subgroup">
                        <h4>Design</h4>
                        <p>The Capsules series will be composed of separate course modules. Each course module will be broken into multiple lessons which can further be separated into topics. A quiz will be provided at the end of each lesson or topic to reinforce key learning points. All modules are written by two pharmacist team members and then peer-reviewed by a separate pharmacist and physician. In addition, the quizzes will be structured with questions assessing levels 1-4 of the ACGME EM milestones. We are hopeful they may be adapted by EM residency programs as an evaluation method.</p>
                        <p>By breaking down modules into smaller chunks, we allow learners to save their progress and learn on their own time. We also built this platform to be “mobile first” so that learners have a great experience on any device.</p>
                        <p>We have assembled an outstanding team of pharmacists from around the country to create and review each module. In addition, we have several highly-respected physician colleagues to peer-review each module after review by our pharmacist team.</p>
                    </div>
                </section>
            </div>


    </article><?php endwhile; ?>
</div>
<?php get_footer(); ?>
