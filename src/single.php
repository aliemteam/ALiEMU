<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package ALiEMU
 */

get_header();

?>
<section id="content" class="content-area">
	<main role="main">
		<?php
		if ( have_posts() ) :
			the_post();
			get_template_part( 'templates/partials/content', get_post_type() );
			the_post_navigation();
			endif;
		?>
	</main>
	<?php get_sidebar(); ?>
</section>

<?php rewind_posts(); ?>

<?php
if ( have_posts() && ( comments_open() || get_comments_number() ) ) :
	the_post();
	comments_template();
endif;

get_footer();
