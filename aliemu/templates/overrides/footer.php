<?php $assets = get_stylesheet_directory_uri() . '/assets'; ?>
<?php if (!is_page_template('page-template-blank.php')): ?>
    <footer class="footer">
        <?php get_sidebar('footer'); ?>
        <div class="footer__sponsors">
            <a href="http://www.cordem.org/" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo $assets; ?>/cord-logo-small.svg" alt="CORD" height="50px" />
            </a>
            <div class="footer__tagline">ALiEMU wouldn't be possible without the support of our sponsors</div>
            <a href="http://www.theteachingcourse.com/" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo $assets; ?>/teaching-course-logo.svg" alt="The Teaching Course" height="50px">
            </a>
        </div>
        <div class="footer__bottom">
            <div class="et-social-icon et-social-facebook">
                <a class="icon" href="https://www.facebook.com/academiclifeinem" target="_blank" rel="noopener noreferrer"></a>
            </div>
            <div class="et-social-icon et-social-twitter">
                <a class="icon" href="https://twitter.com/aliemteam" target="_blank" rel="noopener noreferrer"></a>
            </div>
            <div class="et-social-icon et-social-google-plus">
                <a class="icon" href="https://plus.google.com/+Academiclifeinem/posts" target="_blank" rel="noopener noreferrer"></a>
            </div>
            <div class="et-social-icon et-social-rss">
                <a class="icon" href="https://aliem.com/?feed=rss2" target="_blank" rel="noopener noreferrer"></a>
            </div>
        </div>
    </footer>
<?php endif; ?>
</div>
<?php wp_footer(); ?>
</body>
</html>
