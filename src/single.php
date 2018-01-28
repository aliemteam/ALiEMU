<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package ALiEMU
 */

get_header(); ?>

<?php if ( have_posts() ) : ?>
	<?php the_post(); ?>
	<section id="content" class="content-area">
		<main role="main">
			<?php get_template_part( 'templates/partials/content', get_post_type() ); ?>
			<?php the_post_navigation(); ?>
		</main>
		<?php get_sidebar(); ?>
	</section>

	<?php
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
	?>

<?php else : ?>
	<section id="content" class="content-area">
		<main role="main"></main>
	</section>
<?php endif; ?>

<?php

get_footer();
