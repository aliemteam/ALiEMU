<?php
/**
 * Adds ALiEMU Shortcodes
 *
 * @since 1.0.0
 * @version 0.0.1
 * @author Chris Gaafary
 */

 // Air Frame Shortcode
 function air_frame_shortcode($atts) {
     $a = shortcode_atts(array(
                 'type' => 'AIR',
                 'src' => '',
             ), $atts);
     if ($a['type'] == 'AIR') {
         $type_var = 'AIR Stamp of Approval';
     } elseif ($a['type'] == 'HM') {
         $type_var = 'Honorable Mention';
     }
     elseif ($a['type'] == 'EXTRA') {
         $type_var = 'Extras';
     }
     return '<div class="au-air-frame"><h2>'.$type_var.'</h2><iframe src="'.esc_attr($a['src']).'" width="100%" height="600px"></iframe></div>';
 }
 add_shortcode('airframe', 'air_frame_shortcode');


 // Capsules CAPSULE Shortcode
 function capsule_shortcode($atts, $content = null) {
     return '<div class="au-capsule"><h2>CAPSULE</h2><h4>'.do_shortcode($content).'</h4></div>';
 }
 add_shortcode('capsule', 'capsule_shortcode');

 //Capsules Lesson Box Shortcode
 function capsules_lessonbox_shortcode($atts, $content = null) {
     $a = shortcode_atts(array(
                 'header' => '',
             ), $atts);
     return '<div class="lesson-box"><header>'.esc_attr($a['header']).'</header><div class="lesson-body">'.do_shortcode($content).'</div></div>';
 }
 add_shortcode('capsules-lessonbox', 'capsules_lessonbox_shortcode');
