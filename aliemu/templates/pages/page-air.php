<?php
get_header();
$assets = get_stylesheet_directory_uri() . '/assets';
?>
<div id="main-content">
<div class="container">
<?php while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'category-air' ); ?>>
	<div class="card">
		<div class="card__heading category-air">ALiEM Approved Instructional Resources (AIR)</div>
		<div class="card__content card__content--split">
			<div>
				Welcome to the <a href="/about/#about-air">Approved Instructional Resources (AIR) series</a>! This series curates and grades open-access blog posts and podcasts in the field of emergency medicine (EM) over the previous 12 months to identify high quality, social media-based, educational resources for EM residents. This series is one of the most popular initiatives used by U.S. EM residency programs to to fulfill their <a href="/about/#about-content">Individualized Interactive Instruction (III)</a>, or asynchronous online learning, conference needs. Below are the AIR blocks along with their suggested number of III conference hour credit. If you are a Program Director and wish to track your residents’ progress, please request Educator Dashboard access.
			</div>
			<div>
				<img src="<?php echo $assets; ?>/air-logo.svg" alt="AIR Logo" width="200px"/>
			</div>
		</div>
	</div>
	<?php sorted_course_list( 2014, 'air' ); ?>
</article>
<?php endwhile; ?>
</div>
</div>
<?php get_footer();
