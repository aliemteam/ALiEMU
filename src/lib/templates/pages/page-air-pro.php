<?php
get_header();
$assets = get_stylesheet_directory_uri() . '/assets';
?>
<div id="main-content">
<div class="container">
<?php while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'category-air-pro' ); ?>>
	<div class="card">
		<div class="card__heading category-air-pro">Approved Instructional Resources Professional (AIR-Pro)</div>
		<div class="card__content card__content--split">
			<div>
				Welcome to the <a href="/about/#about-air-pro">Approved Instructional Resources Professional (AIR-Pro) series</a>! This series curates and grades open access blog posts and podcasts in the field of emergency medicine (EM) to identify high quality, social media-based, educational resources for senior EM residents. Unlike the AIR Series, this series targets more advanced practitioners and is no longer limited to content published within the previous 12 months. This series fulfills <a href="/about/#about-content">Individualized Interactive Instruction (III)</a>, or asynchronous online learning, conference needs. Below are the AIR-Pro blocks along with their suggested number of III conference hour credit. If you are a Program Director and wish to track your residents’ progress, please request Educator Dashboard access.
			</div>
			<div>
				<img src="<?php echo $assets; ?>/air-pro-logo.svg" alt="AIR-Pro Logo" width="200px"/>
			</div>
		</div>
	</div>
	<?php sorted_course_list( 2015, 'air-pro' ); ?>
</article>
<?php endwhile; ?>
</div>
</div>
<?php get_footer();
