<?php
/**
 * Utility helper functions for use across the theme.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Utils;

/**
 * Turns an associative array CSS keys and values into an inline CSS string.
 *
 * @param string[] $input CSS key value pairs.
 */
function array_css( array $input ) : string {
	$css = '';
	foreach ( $input as $k => $v ) {
		$css .= "$k: $v; ";
	}
	return $css;
}

/**
 * Enhances `shortcode_unautop` by also removing empty `<p>` tags and delimiting
 * `<br>` elements.
 *
 * @param string $content The content to be transformed.
 */
function unautop( string $content ) : string {
	$content = shortcode_unautop( $content );
	$content = preg_replace( '/<p>\s*<\/p>/', '', $content );
	preg_match( '/^(?<br><br(?: \/)?>)\s*(?<content>.+?)(\k<br>)$/s', $content, $matches );
	return $matches['content'] ?? $content;
}

/**
 * Given a custom post type as input, output a the regular name for it.
 *
 * @param string $post_type Post type.
 * @param bool   $plural True if returned string be pluralized.
 * @throws Error If string is not a valid post type.
 */
function post_type_normalized( string $post_type, $plural = false ) : string {
	$value = array_search( $post_type, ALIEMU_POST_TYPES, true );
	if ( ! $value ) {
		throw new Error( "Invalid post type: $post_type" );
	} elseif ( 'quiz' === $value ) {
		return $plural ? 'quizzes' : 'quiz';
	} else {
		return $plural ? $value . 's' : $value;
	}
}
