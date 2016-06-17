<?php

if (!is_page_template('page-template-blank.php')) : ?>

	<footer id="main-footer">
		<?php get_sidebar('footer'); ?>

        <div id="footer-sponsors">
            <div class="footer-sponsors-container">
                <a href="http://www.cordem.org/" target="_blank"><img src="/wp-content/uploads/2016/06/cordemlogo-color.png"></a>
                <a href="http://www.theteachingcourse.com/" target="_blank"><img src="/wp-content/uploads/2016/06/teachingcourse-logo-color.png"></a>
            </div>
        </div>
		<div id="footer-bottom">
            <div class="footer-bottom-container">
                <div id="footer-info">Designed by Chris Gaafary</div>
                <div id="footer-social-icons">
                    <div class="et-social-icon et-social-facebook">
                        <a href="https://www.facebook.com/pages/Academic-Life-in-Emergency-Medicine/242608792433177" class="icon"></a>
                    </div>
                    <div class="et-social-icon et-social-twitter">
                        <a href="https://twitter.com/aliemteam" class="icon"></a>
                    </div>
                    <div class="et-social-icon et-social-google-plus">
                        <a href="https://plus.google.com/+Academiclifeinem/posts" class="icon"></a>
                    </div>
                    <div class="et-social-icon et-social-rss">
                        <a href="http://aliem.com/?feed=rss2" class="icon"></a>
                    </div>
                </div>
            </div>
		</div>
	</footer> <!-- #main-footer -->


</div> <!-- #et-main-area -->
<?php endif; // ! is_page_template( 'page-template-blank.php' ) ?>
</div> <!-- #page-container -->
<?php wp_footer(); ?>
</body>
</html>
