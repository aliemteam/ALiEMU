<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ALiEMU
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<section id="comments">
	<div class="comments-area">
		<h2 class="comments-title"><?php esc_html_e( 'Join the discussion', 'aliemu' ); ?></h2>

		<?php comment_form(); ?>

		<?php if ( have_comments() ) : ?>

			<?php the_comments_navigation(); ?>

			<ol class="comment-list">
				<?php
					wp_list_comments(
						[
							'style'      => 'ol',
							'short_ping' => true,
							'type'       => 'comment',
						]
					);
				?>
			</ol>

			<?php the_comments_navigation(); ?>

			<?php if ( ! comments_open() ) : ?>
				<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'aliemu' ); ?></p>
			<?php endif; ?>

		<?php endif; ?>

	</div>
</section>
