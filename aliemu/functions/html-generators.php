<?php

function sorted_course_list($end_year, $category) {
    $current_year = intval(get_gmt_from_date(null, 'Y'));
    $year = $current_year;
    ?>
    <div class="content-area course-list">
        <div class="course-list__year-links">
            <?php while ($year >= $end_year): ?>
                <a href="#year-<?php echo $year; ?>" aria-label="in page link to <?php echo $year; ?>"><?php echo $year--; ?></a>
            <?php endwhile; $year = $current_year; ?>
        </div>
        <?php while($year >= $end_year): ?>
            <div id="year-<?php echo $year; ?>" class="course-list__single-year-container">
                <div class="course-list__year-heading"><?php echo $year; ?></div>
                <div class="course-boxes course-boxes--scroll">
                    <?php echo do_shortcode("[ld_course_list category_name='$category' tag='$year']"); ?>
                </div>
            </div>
            <?php $year--; ?>
        <?php endwhile; ?>
    </div>
    <?php
}

function aliemu_team_member($name, $img, $title, $role, $twitter) {
    ?>
    <div class="team-member">
        <div class="team-member__photo">
            <img src="/wp-content/themes/aliemu/assets/team/<?php echo $img; ?>" alt="Photograph of <?php echo $name; ?>"/>
        </div>
        <div class="team-member__info">
            <div class="team-member__name">
                <?php if ($twitter): ?>
                    <div>
                        <a href="https://twitter.com/<?php echo $twitter; ?>" class="et_pb_font_icon et_pb_twitter_icon" aria-label="View Twitter profile"></a>
                    </div>
                <?php endif; ?>
                <?php echo $name; ?>
            </div>
            <div><?php echo $title; ?></div>
            <div><?php echo $role; ?></div>
        </div>
    </div>
    <?php
}
