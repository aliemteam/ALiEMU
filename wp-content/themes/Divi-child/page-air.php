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
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae hic minima itaque suscipit neque ullam, necessitatibus iusto ab, atque quam impedit recusandae. Ut quisquam neque eius sint? Commodi, voluptate, earum.</div>
        <div>Consequuntur perspiciatis enim voluptatum cum delectus nostrum quos cumque corporis, fuga. Deserunt, dignissimos pariatur velit numquam! Accusamus repellendus itaque deleniti quos quisquam minus quibusdam incidunt, mollitia obcaecati! Natus, quae minima.</div>
        <div>Perferendis amet cupiditate aperiam sequi omnis vero nemo rem cumque iste possimus aut molestiae a harum maxime eos, est voluptate id mollitia deleniti, beatae veritatis accusamus. Tenetur reprehenderit, laudantium nobis.</div>
        <div>Aut excepturi assumenda deleniti ea nemo hic quia eius nesciunt adipisci, temporibus, nisi vitae voluptas quam animi facere maxime quod dolores aliquam odio consectetur est placeat modi. Illo, dicta quaerat!</div>
      </div>
      <div class="au-image"><img src="http://www.placehold.it/400x400"/></div>
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
