<?php
/**
 * Responsible for parsing JSON-LD structured data for all pages.
 *
 * @package ALiEMU
 */

namespace ALIEMU;

defined( 'ABSPATH' ) || exit;

/**
 * Main class
 */
class Structured_Data {

	/**
	 * The class instance.
	 *
	 * @var Structured_Data
	 */
	private static $instance = null;

	/**
	 * Used to either call the constructor or return the existing instance.
	 */
	public static function init() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new Structured_Data();
		}
		return self::$instance;
	}

	/**
	 * Not to be called directly.
	 */
	private function __construct() {
		add_action( 'wp_footer', [ $this, 'render' ] );

		add_filter( 'structured_data_sfwd-courses', [ $this, 'course' ] );
		add_filter( 'structured_data_category-overview', [ $this, 'category' ] );
	}

	/**
	 * The main renderer of the structured data.
	 */
	public function render() : void {
		global $post;

		if ( is_single() ) {
			$suffix = get_post_type();
		} elseif ( is_front_page() ) {
			$suffix = 'front_page';
		} elseif ( is_search() ) {
			$suffix = 'search';
		} elseif ( is_page_template() && ! is_page_template( 'templates/blank.php' ) ) {
			$suffix = basename( get_page_template_slug( $post->ID ), '.php' );
		} elseif ( is_page() ) {
			$suffix = 'page-' . $post->post_name;
		} else {
			$suffix = '';
		}

		$data = [
			'@context'        => 'http://schema.org/',
			'@type'           => [ 'WebSite', 'Organization' ],
			'@id'             => '#aliemu',
			'name'            => 'ALiEMU',
			'description'     => 'The community is the curriculum.',
			'logo'            => ALIEMU_ROOT_URI . '/assets/aliemu-logo-horizontal.png',
			'url'             => home_url(),
			'potentialAction' => [
				'@type'       => 'SearchAction',
				'target'      => home_url() . '/?s={search_term}',
				'query-input' => 'required name=search_term',
			],
			'@graph'          => apply_filters( "structured_data_${suffix}", [] ),
		];

		?>
			<script type="application/ld+json">
				<?php echo wp_json_encode( $data ); ?>
			</script>
		<?php
	}

	/**
	 * Adds structured data for course pages.
	 *
	 * @param mixed[] $graph The graph array.
	 */
	public function course( array $graph ) : array {
		global $post;

		$meta    = get_post_meta( $post->ID, '_sfwd-courses', true );
		$graph[] = [
			'@type'               => 'Course',
			'@id'                 => '#course',
			'name'                => $post->post_title,
			'description'         => $meta['sfwd-courses_course_short_description'] ?? '',
			'isAccessibleForFree' => 'True',
			'provider'            => [
				'@id' => '#aliemu',
			],
		];

		return $graph;
	}

	/**
	 * Adds structured data for `category_overview` pages.
	 *
	 * @param mixed[] $graph The graph array.
	 */
	public function category( array $graph ) : array {
		global $post;

		$category = $post->post_name;
		$query    = new \WP_Query(
			[
				'post_type'      => 'sfwd-courses',
				'category_name'  => $category,
				'posts_per_page' => 50,
			]
		);

		$items    = [];
		$position = 1;

		while ( $query->have_posts() ) {
			$query->the_post();
			$items[] = [
				'@type'    => 'ListItem',
				'position' => $position++,
				'url'      => get_permalink(),
			];
		}
		wp_reset_postdata();

		$graph[] = [
			'@type'           => 'ItemList',
			'itemListElement' => $items,
		];

		return $graph;
	}
}

Structured_Data::init();
