<?php
/**
 * Custom template tags for this theme
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package ALiEMU
 */

namespace ALIEMU\Theme\Tags;

use function ALIEMU\Utils\array_css;

/**
 * Renders an assets URL from a relative asset path.
 *
 * @param string $relative_asset_path  The path to the file relative to the assets directory.
 */
function the_asset_url( $relative_asset_path ) : void {
	$file_path = ALIEMU_ROOT_PATH . "/assets/$relative_asset_path";
	if ( file_exists( $file_path ) ) {
		echo esc_url( ALIEMU_ROOT_URI . "/assets/$relative_asset_path" );
	}
}

/**
 * Echos the output of `array_css`.
 *
 * @param string[] $input CSS key value pairs.
 */
function the_array_css( array $input ) : void {
	echo esc_attr( array_css( $input ) );
}
