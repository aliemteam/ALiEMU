<?php

/**
 * Adds class 'et_full_width_page' to all pages that aren't category capsules
 *   to remove the sidebar.
 * @param  array[string] $classes  Array of classes
 * @return array[string] Array of classes
 */
function remove_sidebar_when_unneeded($classes) {
    global $post;
    $category = get_the_category($post->ID);

    if ($category[0]->slug !== 'capsules') {
        $classes[] = 'et_full_width_page';
    }

    return $classes;
}
add_filter('body_class', 'remove_sidebar_when_unneeded');
