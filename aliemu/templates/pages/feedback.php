<?php

if (wp_verify_nonce($_POST['_wpnonce'], 'contact-form-nonce') && $_POST['g-recaptcha-response'] !== '') {
    $name = $_POST['contact-name'];
    $email = $_POST['contact-email'];
    $message = $_POST['contact-message'];
    if ($name && $email && $message) {
        slack_message('aliemu/messages/contact-form', [
            'name' => $name,
            'email' => $email,
            'message' => stripslashes(wp_strip_all_tags($message)),
        ]);
        unset($_POST);
        header('Location: ' . $_SERVER['PHP_SELF'] . '/feedback');
        die;
    }
}

get_header();
?>
<div id="main-content">
    <div class="au-team-header">
        <h1>Contact Us</h1>
    </div>
    <div class="contact-form">
        <form method="post">
            <?php wp_nonce_field('contact-form-nonce'); ?>
            <div class="contact-form__row">
                We love feedback! Please contact us regarding anything you think we can do better.
            </div>
            <div class="contact-form__row">
                <div class="contact-form__item">
                    <input type="text" aria-label="Name" placeholder="Name" name="contact-name" required>
                </div>
                <div class="contact-form__item">
                    <input type="email" aria-label="Email Address" placeholder="Email Address" name="contact-email" required>
                </div>
            </div>
            <div class="contact-form__row">
                <div class="contact-form__item">
                    <textarea style="width: 100%;" aria-label="Message" placeholder="Message" name="contact-message" rows="8" required></textarea>
                </div>
            </div>
            <div class="contact-form__row contact-form__row_submit">
                <div id="recaptcha" class="g-recaptcha" data-sitekey="6LdukgsUAAAAAF02dhTydX8M6l1fLEiQO6eC1xGC" data-callback="_auEnableSubmit"></div>
                <div id="submit-btn" style="display: none;">
                    <input type="submit">
                </div>
            </div>
        </form>
    </div>
</div>
<?php
get_footer();
?>
<script type="text/javascript">function _auEnableSubmit() {if (grecaptcha.getResponse().length === 0) return;var s = document.getElementById('submit-btn');s.style.display = '';}</script>
<?php
