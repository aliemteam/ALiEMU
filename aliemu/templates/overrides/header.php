<!DOCTYPE html>
<!--[if IE 6]>
<html id="ie6" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 7]>
<html id="ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html id="ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<meta charset="utf-8" />
<?php elegant_description(); ?>
<?php elegant_keywords(); ?>
<?php elegant_canonical(); ?>

<?php do_action( 'et_head_meta' ); ?>

<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />

<?php $template_directory_uri = get_template_directory_uri(); ?>
<!--[if lt IE 9]>
<script src="<?php echo esc_url( $template_directory_uri . '/js/html5.js"' ); ?>" type="text/javascript"></script>
<![endif]-->

<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<div id="page-container">
<?php if (is_page_template('page-template-blank.php')) return; ?>

<header id="main-header" class="header">
    <a href="/" class="header__logo">
         <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/aliemu-logo-horizontal.svg" alt="ALiEMU Logo" height="30px" />
    </a>
    <nav class="nav-container">
    <?php
        wp_nav_menu(
            array(
                'theme_location' => 'primary-menu',
                'container' => '',
                'fallback_cb' => '',
                'menu_class' => 'nav',
                'menu_id' => 'top-menu',
            )
        );
    ?>
    </nav>
    <!-- NOTE: Removed this for now until we can address why the search field doesn't work properly
    <div id="et_top_search">
        <span id="et_search_icon"></span>
    </div> -->
    <?php do_action( 'et_header_top' ); ?>
    <!-- NOTE: Same as above
    <div class="et_search_outer">
        <div class="container et_search_form_container">
            <form role="search" method="get" class="et-search-form" action="/">
                <input type="search" class="et-search-field" placeholder="Search..." value="" name="s" title="Search for:" />
            </form>
            <span class="et_close_search_field"></span>
        </div>
    </div> -->
</header>
<?php
    $slide_nav = '';
    $slide_nav = wp_nav_menu( array( 'theme_location' => 'primary-menu', 'container' => '', 'fallback_cb' => '', 'echo' => false, 'items_wrap' => '%3$s' ) );
    $slide_nav .= wp_nav_menu( array( 'theme_location' => 'secondary-menu', 'container' => '', 'fallback_cb' => '', 'echo' => false, 'items_wrap' => '%3$s' ) );
?>
<ul class="et_mobile_menu mobile-menu--hidden">
    <?php echo $slide_nav; ?>
</ul>
