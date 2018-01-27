<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ALiEMU
 */

get_header(); ?>

<section id="content" class="content-area">
	<main role="main">

	<?php if ( have_posts() ) : ?>
		<header class="page-header">
			<?php
				the_archive_title( '<h1 class="page-title">', '</h1>' );
				the_archive_description( '<div class="archive-description">', '</div>' );
			?>
		</header><!-- .page-header -->

		<?php

		while ( have_posts() ) {
			the_post();

			/*
			* Include the Post-Format-specific template for the content.
			* If you want to override this in a child theme, then include a file
			* called content-___.php (where ___ is the Post Format name) and that will be used instead.
			*/
			get_template_part( 'templates/partials/content', get_post_format() );
		}

		the_posts_navigation();

	else :

		get_template_part( 'templates/partials/content', 'none' );

	endif;

	?>
	</main>
	<?php get_sidebar(); ?>
</section>
<?php

get_footer();
