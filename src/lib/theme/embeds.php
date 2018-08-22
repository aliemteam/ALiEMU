<?php
/**
 * Custom embed renderers
 *
 * @package ALiEMU
 */

namespace ALIEMU\Theme\Embed;

/**
 * Renderer for small-sized soundcloud embeds.
 *
 * @param string $html The raw base HTML of the embed.
 * @param string $url The URL of the content to be embedded.
 */
function soundcloud( $html, $url ) : string {

	// We're only concerned with soundcloud embeds.
	if ( wp_parse_url( $url, PHP_URL_HOST ) !== 'soundcloud.com' ) {
		return $html;
	}

	preg_match( '/src="(.+?)"/', $html, $matches );
	parse_str( wp_parse_url( htmlspecialchars_decode( $matches[1] ), PHP_URL_QUERY ), $query_data );

	foreach ( [ 'visual', 'maxheight', 'maxwidth' ] as $idx ) {
		unset( $query_data[ $idx ] );
	}

	$query = http_build_query( $query_data, '', '&amp;' );

	ob_start();
	?>
		<iframe
			width="100%"
			height="166"
			scrolling="no"
			frameborder="no"
			allow="autoplay"
			src="https://w.soundcloud.com/player/?<?php echo esc_attr( $query ); ?>"
		></iframe>
	<?php

	return ob_get_clean();
}
add_filter( 'oembed_result', __NAMESPACE__ . '\soundcloud', 10, 2 );

