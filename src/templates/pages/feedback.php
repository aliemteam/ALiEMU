<?php
/**
 * Template for the Contact Us page.
 *
 * @package ALiEMU
 */

// This passes all validations. The only reason the ignore was placed here was to avoid having to
// put "Input var okay." on literally every line containing $_POST.
// @codingStandardsIgnoreStart
if (
	isset(
		$_POST['contact-name'],
		$_POST['contact-email'],
		$_POST['contact-message'],
		$_POST['_wpnonce']
	)
	&& ! empty( $_POST['g-recaptcha-response'] )
	&& wp_verify_nonce( sanitize_key( $_POST['_wpnonce'] ), 'contact-form-nonce' ) ) {

	$name    = sanitize_text_field( wp_unslash( $_POST['contact-name'] ) );
	$email   = sanitize_text_field( wp_unslash( $_POST['contact-email'] ) );
	$message = sanitize_textarea_field( wp_unslash( $_POST['contact-message'] ) );

	if ( $name && $email && $message ) {
		slack_message(
			'aliemu/messages/contact-form', [
				'name'    => $name,
				'email'   => $email,
				'message' => stripslashes( wp_strip_all_tags( $message ) ),
			]
		);
		unset( $_POST );
		header( 'Location: ' . $_SERVER['PHP_SELF'] . '/feedback' );
		die;
	}
}
// @codingStandardsIgnoreEnd

get_header(); ?>

<section id="content" class="content-area">
	<main role="main">
		<article class="contact-form">
			<form class="card" method="post">
				<div style="text-align: center; margin: auto; margin-bottom: 20px; margin-top: 20px">
					<h1>We &hearts; feedback!</h1>
					Please contact us regarding anything you think we can do better.
				</div>
				<?php wp_nonce_field( 'contact-form-nonce' ); ?>
				<div class="contact-form__row">
					<div class="contact-form__item">
						<label for="contact-name">Full Name:</label>
						<input class="um-form-field" type="text" id="contact-name" name="contact-name" required>
					</div>
					<div class="contact-form__item">
						<label for="contact-email">Email Address:</label>
						<input type="email" id="contact-email" name="contact-email" required>
					</div>
				</div>
				<div class="contact-form__row">
					<div class="contact-form__item">
						<label for="contact-message">Message:</label>
						<textarea style="width: 100%;" id="contact-message" name="contact-message" rows="8" required></textarea>
					</div>
				</div>
				<div class="contact-form__row contact-form__row_submit">
					<div id="recaptcha" class="g-recaptcha" data-sitekey="6LdukgsUAAAAAF02dhTydX8M6l1fLEiQO6eC1xGC" data-callback="_auEnableSubmit"></div>
					<div id="submit-btn" style="display: none;">
						<input type="submit" class="btn btn--primary" value="Send">
					</div>
				</div>
			</form>
		</article>
	</main>
</section>

<?php get_footer(); ?>
<script type="text/javascript">function _auEnableSubmit() {if (grecaptcha.getResponse().length === 0) return;var s = document.getElementById('submit-btn');s.style.display = '';}</script>
<?php
