<?php
get_header();
$assets = get_stylesheet_directory_uri() . '/assets';
?>
<div id="main-content">
<div class="container">
<?php while ( have_posts() ) : the_post(); ?>

<article id="post-<?php the_ID(); ?>">
	<div class="card">
		<div class="card__heading">ALiEM In-Training Exam Prep Course: 250 Test Questions</div>
		<div class="card__content card__content--split">
			<div>
				One of the projects resulting from the 2016-17 <a href="https://www.aliem.com/aliem-chief-resident-incubator/" target="_blank" rel="noopener noreferrer">ALiEM Chief Resident Incubator</a> class was the publication of an <a href="https://www.aliem.com/2016/06/aliem-in-training-exam-prep-book-published/" target="_blank" rel="noopener noreferrer">iBook/PDF</a> to prepare EM residents for the In-Training Exam (ITE) for EM boards. The 5 question sets of 50 questions each are presented in this course for self-learning and potential Individualized Interactive Instruction (III) asynchronous conference credit.
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
<?php get_footer();
