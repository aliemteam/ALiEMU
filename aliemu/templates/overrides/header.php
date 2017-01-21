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
        <svg
           xmlns="http://www.w3.org/2000/svg"
           width="155px"
           height="30px"
           viewBox="0 0 1301.4608 254.09863"
           version="1.1">
           <title id="aliemu-logo">ALiEMU Logo - Click here to navigate to homepage</title>
          <g
             groupmode="layer"
             id="layer2"
             label="vector"
             transform="translate(-1.0063591,-7.6953816)">
            <g
               id="g4303">
              <path
                 connector-curvature="0"
                 id="path3352"
                 d="m -300.49361,542.39792 c 0.003,-0.4125 23.59759,-54.975 52.43131,-121.25 l 52.42494,-120.5 18.92618,-0.27109 18.92619,-0.2711 51.57942,119.7711 c 28.36868,65.8741 51.88096,120.55859 52.2495,121.52109 0.62691,1.63726 -0.90721,1.75 -23.81352,1.75 l -24.4836,0 -11.33569,-28 -11.3357,-28 -53.03833,0 -53.03833,0 -10.99936,27.99482 -10.99937,27.99483 -23.75,0.005 c -13.0625,0.003 -23.74714,-0.33215 -23.74364,-0.74465 z m 159.99364,-92.30221 c 0,-1.29458 -36.07929,-97.15554 -36.956,-98.19035 -0.34601,-0.4084 -9.21228,21.51428 -19.70282,48.71707 -10.49054,27.20279 -18.83389,49.69945 -18.54078,49.99256 1.07945,1.07945 75.1996,0.56762 75.1996,-0.51928 z m 112,-28.44779 0,-121.5 21.5,0 21.5,0 0,102.5 0,102.5 52,0 52,0 0,19 0,19 -73.5,0 -73.5,0 z m 175,39 0,-82.5 20.5,0 20.5,0 0,82.5 0,82.5 -20.5,0 -20.5,0 z m 94,-39 0,-121.5 80.5,0 80.5,0 0,18.49207 0,18.49207 -59.25,0.25793 -59.25,0.25793 0,31 0,31 55.75,0.2584 55.75,0.25839 0,17.48321 0,17.48321 -55.75,0.25839 -55.75,0.2584 0,34.5 0,34.5 62.25,0.25757 62.25,0.25757 0,18.99243 0,18.99243 -83.5,0 -83.5,0 z m 210,0 0,-121.5 33.75,0.0204 33.75,0.0204 30.89425,84.72961 c 16.99184,46.60129 31.32771,85.5779 31.85749,86.61471 0.73045,1.42952 1.15507,1.5747 1.75704,0.6007 0.43659,-0.70643 14.67572,-39.69007 31.64251,-86.63033 l 30.84871,-85.34592 33.75,-0.005 33.75,-0.005 0,121.5 0,121.5 -21,0 -21,0 0,-98.2 c 0,-59.6152 -0.36056,-97.82673 -0.91765,-97.25 -0.68349,0.70758 -67.4037,176.11093 -73.30924,192.72547 l -0.98652,2.77547 -15.11259,-0.27547 -15.11259,-0.27547 -35.75007,-96 c -19.66254,-52.8 -36.1834,-96.9 -36.71302,-98 -0.6248,-1.29766 -0.98673,32.50247 -1.03064,96.25 l -0.0677,98.25 -20.5,0 -20.5,0 0,-121.5 z m -295.5,-77.88329 c -19.05146,-9.00659 -19.16159,-33.9215 -0.19371,-43.82258 5.19059,-2.70944 17.20134,-3.0267 22.76644,-0.60136 9.45104,4.11888 15.05227,12.36518 15.05227,22.16041 0,10.64656 -3.83904,16.84871 -13.38031,21.61654 -7.9304,3.96286 -16.73375,4.19779 -24.24469,0.64699 z"
                 style="display:inline;fill:#444243;fill-opacity:1"
                 transform="translate(301.49997,-290.00507)" />
              <g
                 label="Layer 1"
                 id="layer1-6"
                 transform="matrix(0.31088216,0,0,0.31088216,1072.0229,8.7285289)"
                 style="display:inline">
                <path
                   style="fill:#00b092;fill-opacity:1"
                   d="m 337.11762,811.89379 c 3.61516,-3.13717 35.9007,-21.2076 53.84617,-30.13752 l 15.58892,-7.75718 5.78144,5.54334 c 11.08128,10.62463 23.64436,15.98721 39.64211,16.92109 16.05509,0.93747 30.60035,-3.78513 43.04953,-13.97753 3.34853,-2.74146 6.37025,-4.98435 6.7148,-4.98435 0.99327,0 18.80246,13.18044 18.80246,13.91556 0,2.02228 -37.84019,11.75134 -60.43858,15.53955 -29.71429,4.98127 -44.02814,6.07996 -85.80104,6.58649 l -39.64006,0.48057 2.45476,-2.13002 z m -82.2697,-9.18396 c -24.06245,-5.54437 -57.06537,-16.29575 -60.08014,-19.57254 -1.101,-1.1964 27.32226,-39.63466 48.61446,-65.74408 l 8.35422,-10.2446 10.93677,0.48648 c 18.45406,0.82048 32.34828,-4.25026 45.88047,-16.74469 l 7.35992,-6.79554 12.5888,4.50482 c 15.89824,5.68964 46.77191,18.08457 58.66133,23.55154 8.46324,3.89157 9.0248,4.34874 8.15649,6.64177 -0.51296,1.35479 -1.27765,5.91412 -1.69933,10.13275 l -0.76675,7.67027 -20.27089,10.2626 c -32.05876,16.23045 -60.70393,32.88772 -87.97375,51.15716 -6.90635,4.6267 -12.93257,8.38122 -13.39205,8.34291 -0.45922,-0.0386 -7.82557,-1.68005 -16.36955,-3.64885 z m 289.50482,-35.19952 c -7.0452,-5.46698 -16.25281,-12.29285 -20.46194,-15.16904 l -7.65304,-5.22888 0.68009,-7.03594 c 0.37386,-3.86972 0.98068,-7.34887 1.34888,-7.73147 1.11232,-1.15629 33.84551,-9.14154 51.55828,-12.578 26.80339,-5.20034 68.8113,-10.74496 81.90072,-10.81053 l 4.22738,-0.0257 -3.69204,3.8818 c -8.16524,8.58538 -30.19589,26.70955 -43.33185,35.64898 -12.5744,8.55709 -39.13224,23.70453 -48.21438,27.49917 l -3.55346,1.48464 -12.80864,-9.93965 z M 150.92683,762.08422 C 118.42299,743.6083 84.67236,713.33296 62.319529,682.60071 54.153266,671.37287 40.373469,648.59964 36.510178,639.94613 l -1.384356,-3.10143 19.064213,0.73203 c 25.864375,0.99276 66.172705,4.3886 90.844535,7.65253 17.19903,2.27529 58.71224,8.91449 59.02027,9.43903 0.0514,0.09 0.95239,3.29736 1.9994,7.12722 2.33057,8.52675 6.12212,16.26953 10.77761,22.00932 l 3.51335,4.33177 -9.13305,11.20264 c -10.83444,13.2892 -38.4542,49.99805 -45.28676,60.18942 -2.6512,3.95508 -5.30318,7.17556 -5.89277,7.15679 -0.58933,-0.0257 -4.68711,-2.0899 -9.10656,-4.60175 z M 496.6323,689.05479 c -19.10741,-18.00872 -50.78845,-21.29194 -72.51107,-7.51523 -11.02805,6.99481 -9.03585,7.01203 -24.89759,-0.21598 -17.983,-8.19378 -32.13589,-13.90759 -53.84668,-21.73882 l -17.14144,-6.18332 -0.24684,-7.85592 c -0.13627,-4.32097 -0.81302,-10.25642 -1.50495,-13.19047 l -1.25862,-5.33507 13.82557,-13.28766 c 7.60419,-7.30772 20.25187,-19.07912 28.10624,-26.15775 l 14.28067,-12.87009 9.82472,-1.44504 c 23.12909,-3.4015 39.05973,-10.96969 53.81171,-25.56354 10.69688,-10.58195 16.95811,-20.06803 22.53771,-34.14558 l 3.45163,-8.70828 17.5081,-12.11826 c 21.4187,-14.82475 55.94687,-36.22236 77.45376,-47.99839 l 16.02013,-8.77205 4.33511,3.49072 c 11.30806,9.10476 23.96911,13.53887 38.61876,13.5255 5.50374,0 11.93673,-0.70375 14.98828,-1.62811 4.20655,-1.27405 5.60325,-1.3391 6.5541,-0.30726 0.66466,0.72149 8.46015,11.95241 17.32322,24.95775 22.93651,33.65627 39.6938,61.49047 58.06044,96.44059 l 5.68064,10.80898 -4.56473,13.832 c -5.88737,17.84133 -16.63901,41.50575 -26.2408,57.75754 l -7.59648,12.85698 -19.78184,0.7814 c -51.34101,2.02819 -105.5109,10.1888 -151.73977,22.85859 -7.38357,2.02408 -13.73788,3.66171 -14.121,3.64062 -0.38311,-0.0257 -3.50126,-2.68257 -6.92924,-5.91411 z M 206.53609,621.69777 c -0.77883,-0.77883 -38.99261,-6.88013 -60.43034,-9.64807 -27.88254,-3.60051 -70.077389,-6.93284 -99.5883,-7.86568 l -24.593668,-0.77703 -3.087033,-9.64216 C 14.470267,580.12594 8.890159,554.20782 6.080049,534.51211 L 3.68108,517.69902 3.349133,260.84253 3.017443,3.986314 l 132.322777,0 132.32251,0 0.36306,238.643346 c 0.38568,253.54833 0.11056,239.26148 4.95735,257.39208 8.1187,30.37124 27.35184,54.27248 52.57418,65.33473 3.24053,1.42138 6.26688,2.88828 6.72559,3.25905 0.45846,0.37103 -5.64541,6.7873 -13.56381,14.25856 l -14.39715,13.58387 -7.86312,-4.21067 c -11.17718,-5.98559 -18.76569,-7.90708 -31.06317,-7.86568 -11.47905,0.0386 -19.7317,2.1997 -30.33782,7.94385 -8.05338,4.36185 -19.14263,15.63469 -23.10852,23.49112 -2.9289,5.80201 -4.15692,7.13622 -5.41323,5.88094 z M 731.69315,521.35044 c -9.85712,-17.44099 -25.06138,-41.3705 -42.14137,-66.32543 l -16.49888,-24.10539 2.36914,-3.21431 c 6.668,-9.0446 11.06225,-21.67274 11.43894,-32.86947 l 0.27666,-8.22823 8.57072,-3.45189 c 4.71386,-1.89783 16.76681,-6.44739 26.78385,-10.10909 l 18.21288,-6.65823 0.30803,59.58467 c 0.28876,55.87642 -0.7706,95.17167 -2.75894,102.34004 -0.83668,3.01683 -1.04546,2.79571 -6.56103,-6.96395 z m -254.00421,-158.42962 0,-93.42991 3.48197,2.88441 c 13.51059,11.19236 45.92443,41.69706 66.31849,62.41252 l 24.26789,24.65049 -2.54964,5.20754 c -4.36622,8.91706 -6.08741,17.90947 -5.62562,29.40112 l 0.41654,10.37933 -16.63902,9.11839 c -16.78686,9.19913 -59.74588,35.26484 -66.1889,40.16048 l -3.48197,2.64607 0,-93.42992 z M 667.318,346.04037 c -16.87326,-16.84729 -43.87669,-21.38862 -67.62211,-11.37209 l -3.87615,1.63531 -29.33529,-29.35947 c -29.38235,-29.40626 -49.58871,-48.0439 -75.12654,-69.29367 l -13.65072,-11.35872 0,-111.15244 0,-111.152719 131.77613,0 131.77613,0 0,162.044529 0,162.04452 -13.70369,4.61717 c -7.53682,2.53936 -22.59376,7.96237 -33.45982,12.04987 -10.86607,4.08776 -20.00632,7.37612 -20.31178,7.30695 -0.30547,-0.0694 -3.20737,-2.77359 -6.44816,-6.00924 z"
                   id="path4771"
                   connector-curvature="0" />
              </g>
            </g>
          </g>
        </svg>
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
