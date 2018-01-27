<?php
/**
 * Template Name: Category Overview
 *
 * @package ALiEMU
 */

get_header();

?>

<section id="content" class="content-area">
	<main role="main">

	<?php

	while ( have_posts() ) {
		the_post();
		get_template_part( 'templates/partials/content', 'page' );
		get_template_part( 'templates/partials/course-list' );
	}

	?>

	</main>
</section>

<?php

get_footer();
