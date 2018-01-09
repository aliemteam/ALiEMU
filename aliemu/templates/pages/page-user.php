<?php get_header(); ?>
<div id="main-content">
	<div class="container">
		<div id="content-area" class="clearfix">
			<div id="left-area">
				<?php while ( have_posts() ) : the_post(); ?>
					<article id="post-<?php the_ID(); ?>" >
						<div class="entry-content"> <?php the_content(); ?> </div>
					</article>
				<?php endwhile; ?>
			</div>
			<?php get_sidebar(); ?>
		</div>
	</div>
</div>
<?php get_footer(); ?>
