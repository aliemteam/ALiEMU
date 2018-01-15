<?php get_header(); ?>
<link rel="stylesheet" href="<?= ROOT_URI . '/templates/pages/page-about.css' ?>" />
<div id="main-content">
<?php while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'au-about' ); ?>>
	<div class="flex-container about">

	<?php // Nav Bar  ?>
	<div class="about__sidebar">
		<nav id="magic-sidebar" class="bs-docs-sidebar affix">
			<ul class="au-nav bs-docs-sidenav">
				<li><a href="#about-content">The ALiEMU Content</a></li>
				<li><a href="#about-iii-courses">ALiEMU Courses Eligible for III or Asynchronous Learning Credit</a></li>
				<li>
					<a href="#about-air">AIR Series</a>
					<ul class="au-nav">
						<li><a href="#about-air-intro">What is the AIR Series?</a></li>
						<li><a href="#about-air-labels">What are the definitions of the AIR-Approved and Honorable Mention labels?</a></li>
					</ul>
				</li>
				<li>
					<a href="#about-air-pro">AIR-Pro Series</a>
					<ul class="au-nav">
						<li><a href="#about-air-pro-intro">What is the AIR-Pro Series?</a></li>
						<li><a href="#about-air-pro-creation">Why create the AIR-Pro Series?</a></li>
						<li><a href="#about-air-pro-posts">How are the highest quality blog posts and podcasts identified?</a></li>
						<li><a href="#about-air-pro-different">How is the scoring different from the AIR Series?</a></li>
						<li><a href="#about-air-pro-labels">What are the definitions of the AIR-Pro Approved and Honorable Mention labels?</a></li>
					</ul>
				</li>
				<li>
					<a href="#about-capsules">Capsules Series</a>
					<ul class="au-nav">
						<li><a href="#about-capsules-intro">What is the Capsules series?</a></li>
						<li><a href="#about-capsules-creation">Why create the Capsules series?</a></li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>

	<?php // Main Content ?>
	<div class="about__body">
		<section id="about-content" class="card">
			<div class="card__heading">
				The ALiEMU Content
			</div>
			<div class="card__content">
				<p>ALiEMU is a learning management system that provides open-access, on-demand, and online e-courses for anyone practicing Emergency Medicine (EM) worldwide. With our 2016 launch, we are hosting content created or collected by the ALiEM team. We ultimately envision a robust platform for EM educators to submit and host their own e-courses, whereupon each will have undergone expert peer review and receive instructional design assistance to optimize online content delivery and learner retention.</p>
				<p>Educational institutions and organizations are increasingly awarding course completion credit and competency certificates for e-courses. Specifically, the Council of Residency Directors (CORD) in EM and the Accreditation Council for Graduate Medical Education (ACGME), have sought to broaden the types of educational experiences available to residents. Previous to 2008, five hours of synchronous educational conference time was required for U.S. EM residents per week for didactics. However, through recognition of the importance of asynchronous learning, the ACGME now  (<a href="https://www.acgme.org/Portals/0/PFAssets/ProgramRequirements/110_emergency_medicine_07012015.pdf">ACGME PDF</a>) allows residencies to replace up to 20% of their traditional conference time with asynchronous learning outside the classroom. This asynchronous learning opportunity has been termed Individualized Interactive Instruction (III).</p>
				<p>More specifically, to obtain III credit, the four below criteria must be met, which is inherent to the foundation of ALiEMU.</p>
				<table>
					<thead>
						<tr>
						   <td>Item</td>
						   <td>III Criteria</td>
						   <td>ALiEMU Justification</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>The program director must monitor resident participation.</td>
							<td>A custom Educator Dashboard has been created in ALiEMU which allows program directors (PD) and associate/assistant PDs to track their residents’ progress.</td>
						</tr>
						<tr>
							<td>2</td>
							<td>There must be an evaluation component.</td>
							<td>At the conclusion of each block, there is a quiz to assess competency.</td>
						</tr>
						<tr>
							<td>3</td>
							<td>There must be faculty oversight.</td>
							<td>Course instructors, who are automatically emailed whenever there is a new comment in the comments section of each block, reply in a timely fashion to the learner.</td>
						</tr>
						<tr>
							<td>4</td>
							<td>The activity must be monitored for effectiveness.</td>
							<td>There is an ongoing, internal quality improvement process as well as a post-block survey to incorporate learner feedback.</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<?php // ALiEMU Courses Eligible for III or Asynchronous Learning Credit ?>
		<section id="about-iii-courses" class="card">
			<div class="card__heading">
				ALiEMU Courses Eligible for III or Asynchronous Learning Credit
			</div>
			<div class="card__content">
				<ol>
					<li>Capsules Series: Practical Pharmacology for the Emergency Medicine Practitioner</li>
					<li>Approved Instructional Resources (AIR) Series</li>
					<li>Approved Instructional Resources Professional (AIR-Pro) Series</li>
				</ol>
			</div>
		</section>

		<?php // AIR Series ?>
		<section id="about-air" class="card">
			<div class="card__heading">
				AIR Series
			</div>
			<div class="card__content">
				<div id="about-air-intro" class="au-subgroup">
					<h4>What is the AIR Series?</h4>
					<p>We created the AIR series because we have observed residencies struggle in evaluating and recommending blog posts and podcasts that are appropriate and high quality for resident education. The AIR series attempts to address this need by having our team of diverse, expert educators from across the U.S. (AIR Executive Board) collectively vet these open-access social media resources.</p>
					<ul>
						<li>Best Evidence in Emergency Medicine (BEEM) Score</li>
						<li>Content Accuracy</li>
						<li>Educational Utility</li>
						<li>Evidence Based Medicine</li>
						<li>Referenced</li>
					</ul>
				</div>
				<div id="about-air-labels" class="au-subgroup">
					<h4>What are the definitions of the AIR-Approved and Honorable Mention labels?</h4>
					<p>There are two tiers of AIR labels. The “AIR-Approved” label is awarded to posts scoring ≥30 points (out of 35 total) on our grading instrument. The “Honorable Mention” label is awarded to posts flagged and collectively recognized by Executive Board members as worthwhile to highlight, despite the content scoring < 30 points. At a minimum, these need to have scored ≥ 27 points and still reflect accurate, appropriately referenced, and unbiased content. Quiz content is generated evaluating both AIR-Approved and Honorable Mention posts.</p>
				</div>
			</div>
		</section>

		<?php // AIR-Pro Series ?>
		<section id="about-air-pro" class="card">
			<div class="card__heading">
				AIR-Pro Series
			</div>
			<div class="card__content">
				<div id="about-air-pro-intro">
					<h4>What is the AIR-Pro Series?</h4>
					<p>The AIR-Pro series was conceived by Dr. Fareen Zaver et al. to answer more advanced level concepts, while continuing to follow the AIR series model of providing a credible method to identify quality blogs and podcasts. The AIR-Pro series serves as a resource for U.S. EM residents to obtain Individualized Interactive Instruction (III) conference credit.</p>
				</div>
				<div id="about-air-pro-creation">
					<h4>Why create the AIR-Pro Series?</h4>
					<p>We created this series because the AIR-Series has clearly filled a niche for III credit at over 80 U.S. EM residency programs. Many programs however still struggle to identify more appropriate content for more senior residents, beyond the AIR series content. Following <a href="https://en.wikipedia.org/wiki/Zone_of_proximal_development">Vygotsky’s zone of proximal development</a> educational theory, this series provides more advanced content to help the senior resident stretch his/her knowledge base beyond foundational content.</p>
					<p>To do this, we searched educational blogs and podcasts and included any date of publication unlike the AIR series which only search for the most recent posts on content.</p>
				</div>
				<div id="about-air-pro-posts">
					<h4>How are the highest quality blog posts and podcasts identified?</h4>
					<p>For each major subject category, 5 EM Chief Residents from across the country propose 3-5 advanced clinical questions. Using <a href="http://www.foamsearch.net/">FOAMsearch.net</a>, an exhaustive comprehensive search is performed, finding all posts answering the clinical questions. These relevant posts are scored by 8 reviewers on the AIR-Pro Board, using a revised version of the AIR Series scoring instrument. The <a href="https://docs.google.com/spreadsheets/d/1Z1rjt8pyEZYKt2ZXcW70XohmmzUUGsgFjL2RctOyO-E/edit?usp=sharing">AIR-Pro scoring instrument</a> includes five measurement outcomes, each using a Likert 7-point scale:</p>
					<ul>
						<li>Recency</li>
						<li>Content Accuracy</li>
						<li>Educational Utility for the Senior Resident</li>
						<li>Evidence Based Medicine</li>
						<li>Referenced</li>
					</ul>
				</div>
				<div id="about-air-pro-different">
					<h4>How is the scoring different from the AIR Series?</h4>
					<p>There are 3 areas where the two series differ.</p>
					<ol>
						<li>On the scoring instrument, we replaced the Best Evidence in Emergency Medicine (BEEM) domain with Recency.</li>
						<li>The AIR-Pro series curates blogs and podcasts without a timeframe limit, unlike the AIR series which only includes posts within the previous 12 months. Based on our experience with the AIR Series, we observed that many high-quality, advanced-level blogs and podcasts were older than 12 months. AIR’s time cut-off was created partly to avoid impractically long lists of blog posts and podcasts to review each month. Because the AIR-Pro Series concentrates on very focused questions, we removed this timeframe cut off and instead just reward more recently published posts with a higher Recency score.</li>
						<li>On the scoring instrument, the Educational Utility domain specifically targets senior residents and not just residents in general in order to identify more advanced level educational content.</li>
					</ol>
					<p>
						<?php // FIXME: This should be in assets ?>
						<img src="/wp-content/uploads/2016/06/AIR-vs-AIR-Pro-Series.png" alt="AIR vs AIR-Pro" />
					</p>
				</div>
				<div id="about-air-pro-labels">
					<h4>What are the definitions of the AIR-Pro Approved and Honorable Mention labels?</h4>
					<p>There are two tiers of AIR labels. The “AIR-Approved” label is awarded to posts scoring ≥28 points (out of 35 total) on our <a href="https://docs.google.com/spreadsheets/d/1Z1rjt8pyEZYKt2ZXcW70XohmmzUUGsgFjL2RctOyO-E/edit?usp=sharing">AIR-Pro scoring instrument</a>, which is slightly different from the <a href="https://docs.google.com/spreadsheets/d/1Ou7YAjopZy2ncRV-oUYr3A08pwfR0MQrzEWIRxH5P34/edit?usp=sharing">AIR Series scoring instrument</a>. To decrease the repetitive nature of posts relating to these advanced concepts, we did not always include every post found that met the score of ≥28 points. The “Honorable Mention” label is awarded to posts flagged and collectively recognized by Board members as worthwhile to highlight, despite the content scoring < 30 points. At a minimum, these need to have scored ≥26 points and still reflect accurate, appropriately referenced, and unbiased content. Quiz content is generated evaluating both AIR-Approved and Honorable Mention posts.</p>
				</div>
			</div>
		</section>

		<?php // Capsules ?>
		<section id="about-capsules" class="card">
			<div class="card__heading">
				Capsules
			</div>
			<div class="card__content">
				<div id="about-capsules-intro">
					<h4>What is the Capsules series?</h4>
					<p>The Capsules series is a free, online e-curriculum of high-quality, current, and practical pharmacology knowledge for the EM practitioner. About once a month a new course block is released, which has lessons to read about (or watch) and brief quizzes to complete. All modules are written by two pharmacist team members and then peer-reviewed by a separate pharmacist and physician. The Capsules series’ primary focus is bringing EM pharmacology education to the bedside. Our expert team distills complex pharmacology principles into easy-to-apply concepts. It’s our version of what-you-need-to-know as an EM practitioner.</p>
				</div>
				<div id="about-capsules-creation" class="au-subgroup">
					<h4>Why create the Capsules series?</h4>
					<p>The Capsules series was conceived in response to an observed deficiency of EM pharmacology information in Free Open Access Meducation (FOAM) resources, as perceived by learners.</p>
					<?php // FIXME: This should be in assets ?>
					<p>
						<img src="https://pbs.twimg.com/media/B4FjicsCEAAPYDE.png" alt="twitter poll" />
					</p>
					<p>The above graphic details the results of a Twitter-based poll by @FOAMmedstudent. Pharmacology education was listed as the #2 most needed resource in the open-access arena of social media. Thus in 2015, the ALiEMU Capsules series was launched. Although the primary purpose of the series is to provide a longitudinal curriculum on EM pharmacology, a secondary goal is to help U.S. EM residency programs address ACGME III and milestone needs. This series allows residents to claim III conference credit for their asynchronous learning as well as provides residency programs with a means to measure residents on the ACGME milestone of Pharmacotherapy (PC5).</p>
				</div>
			</div>
		</section>
	</div>
	</div>
</article>
</div>
<?php endwhile;
get_footer();
