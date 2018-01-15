<?php
get_header();
$assets = get_stylesheet_directory_uri() . '/assets';
?>
<div id="main-content">
<div class="container">
<?php
while ( have_posts() ) :
	the_post();
?>

<article id="post-<?php the_ID(); ?>">
	<div class="card">
		<h1 class="card__heading">ALiEM In-Training Exam Prep Course: 250 Test Questions</h1>
		<div class="card__content card__content--split">
			<div>
				<p>One of the projects resulting from the 2016-17 <a href="https://www.aliem.com/aliem-chief-resident-incubator/" target="_blank" rel="noopener noreferrer">ALiEM Chief Resident Incubator</a> class was the publication of an <a href="https://www.aliem.com/2016/06/aliem-in-training-exam-prep-book-published/" target="_blank" rel="noopener noreferrer">iBook/PDF</a> to prepare EM residents for the In-Training Exam (ITE) for EM boards. The 5 question sets of 50 questions each are presented in this course for self-learning and potential Individualized Interactive Instruction (III) asynchronous conference credit.</p>

				<h2>Contributors</h2>
				<p>
					<strong>Editors:</strong> Michael Gottlieb, MD; Rochelle Zarzar, MD; Philippe Bierny, BA<br />
					<strong>Associate Editors:</strong> Michael Gottlieb, MD; Rochelle Zarzar, MD; Philippe Bierny, BA
				</p>

				<!-- <h2>iBook Citation</h2> -->
				<div style="padding: 20px; background: #f5f5f5; margin-right: 20px;"><strong>iBook:</strong> Gottlieb M, Zarzar R, Bierny P, eds. <i>ALiEM In-Training Exam Prep: Emergency Medicine (Question Sets #1-5)</i>. 2nd ed. San Francisco, CA: ALiEM Publishing; 2016.</div>
			</div>
			<div>
				<img src="/wp-content/uploads/2018/01/ALiEM-In-Training-Exam-Prep-Quiz-Sets-1-5-2nd-ed-cover-231x300.png" />
			</div>
		</div>
	</div>
	<div class="content-area course-list course-list--transparent">
		<div class="course-boxes">
			<?php echo do_shortcode( '[ld_course_list category_name="In Training Exam Prep"]' ); ?>
		</div>
	</div>
</article>

<?php endwhile; ?>
</div>
</div>
<?php
get_footer();
