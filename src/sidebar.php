<?php
/**
 * The sidebar containing the main widget area
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package ALiEMU
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>

<aside id="sidebar" class="widget-area" role="complementary">
	<div class="widget-content widget-content--sticky">
		<?php dynamic_sidebar( 'sidebar-1' ); ?>
	</div>
</aside>
