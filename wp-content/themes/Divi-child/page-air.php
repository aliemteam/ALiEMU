<?php get_header(); ?>
<div id="main-content">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="au-container">
    <div class="au-heading">
          <h1>ALiEM Approved Instructional Resources (AIR)</h1>
    </div>
    <div class="au-content">
      <div class="au-text">
        <div>Welcome to the Approved Instructional Resources (AIR) series! This series screens and grades open access blog posts and podcasts in the field of emergency medicine (EM) over the past 12 months to identify high quality, social media-based, educational resources for EM residents. This series is one of the most popular initiatives used by over 80 U.S. EM residency programs to fulfill their Individualized Interactive Instruction (III), or asynchronous online learning, conference needs. Below are the AIR blocks listed in reverse chronological order along with their suggested number of III conference hour credit. If you are a program director and wish to track your residents’ progress, please sign up for our Educator Dashboard access.</div>
      </div>
      <div class="au-image"><img src="https://www.aliemu.com/wp-content/uploads/2016/06/air-badge.png"/></div>
    </div>
  </div>
  <div class="links-row">
      <a href="#year-2016">2016</a>
      <a href="#year-2015">2015</a>
      <a href="#year-2014">2014</a>
  </div>
  <div class="year-row" id="year-2016">
      <div class="au-year">
          <h1>2016</h1>
      </div>
      <div class="course-boxes">
          <?php echo do_shortcode('[ld_course_list category_name="air" tag="2016"]'); ?>
      </div></div>
<div class="year-row" id="year-2015">
      <div class="au-year">
          <h1>2015</h1>
      </div>
      <div class="course-boxes">
          <?php echo do_shortcode('[ld_course_list category_name="air" tag="2015"]'); ?>
      </div></div>
<div class="year-row" id="year-2014">
      <div class="au-year">
          <h1>2014</h1>
      </div>
      <div class="course-boxes">
          <?php echo do_shortcode('[ld_course_list category_name="air" tag="2014"]'); ?>
      </div>
  </div></div>
        </article>
    <?php endwhile; ?>
<?php get_footer(); ?>
