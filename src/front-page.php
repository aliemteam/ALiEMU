<?php
/**
 * The home page
 *
 * This is the page displayed at www.aliemu.com.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package ALiEMU
 */

use ALIEMU\Tags;

$user = wp_get_current_user();
?>

<?php get_header(); ?>

<section id="content" class="content-area">
	<main role="main">
		<div class="home__row">
			<div class="home__splash">
				<svg xmlns="http://www.w3.org/2000/svg" width="500" height="97" viewBox="0 0 468 91">
					<path d="M0 88.133c.001-.148 8.5-19.8 18.884-43.67L37.766 1.061l6.817-.098L51.4.866l18.577 43.139C80.195 67.73 88.663 87.426 88.796 87.773c.226.59-.327.63-8.577.63h-8.818L67.318 78.32l-4.083-10.085H25.03l-3.961 10.083L17.106 88.4l-8.554.001c-4.705.001-8.553-.12-8.552-.268zM57.625 54.89c0-.467-12.994-34.993-13.31-35.366-.125-.147-3.318 7.749-7.097 17.547-3.778 9.797-6.783 17.9-6.678 18.006.39.388 27.085.204 27.085-.187zm40.34-10.247V.882h15.487v73.835h37.458v13.686H97.965zm63.03 14.047V28.975h14.767v59.428h-14.767zm33.856-14.047V.882h57.988v13.32l-21.34.093-21.34.093v22.331l20.079.093 20.08.093v12.594l-20.08.093-20.08.093v24.852l22.42.092 22.422.093v13.681h-60.15zm75.636 0V.882l12.156.007 12.156.007 11.127 30.517c6.12 16.785 11.283 30.823 11.474 31.197.263.515.416.567.633.216.157-.254 5.286-14.295 11.397-31.202L340.54.885l12.156-.002 12.156-.002v87.522h-15.127V53.034c0-21.471-.13-35.234-.33-35.026-.247.254-24.278 63.43-26.405 69.414l-.355 1-5.443-.1-5.443-.099-12.876-34.576C291.79 34.629 285.84 18.746 285.65 18.35c-.225-.468-.356 11.706-.372 34.666l-.024 35.387h-14.767v-43.76zm-106.43-28.051c-6.863-3.244-6.902-12.218-.07-15.784 1.869-.976 6.195-1.09 8.2-.216 3.403 1.483 5.42 4.453 5.42 7.981 0 3.835-1.382 6.069-4.819 7.786-2.856 1.427-6.027 1.512-8.732.233z" fill="#444243"/>
					<path d="M423.498 91.28c.405-.35 4.02-2.374 6.029-3.374l1.745-.868.648.62c1.24 1.19 2.647 1.79 4.439 1.895 1.797.105 3.426-.424 4.82-1.565.375-.307.713-.558.752-.558.111 0 2.105 1.476 2.105 1.558 0 .226-4.237 1.316-6.767 1.74-3.327.558-4.93.68-9.607.737l-4.439.054.275-.238zm-9.212-1.028c-2.694-.62-6.39-1.824-6.727-2.191-.124-.134 3.059-4.438 5.443-7.362l.936-1.147 1.224.055c2.066.092 3.622-.476 5.137-1.875l.825-.761 1.41.504c1.78.637 5.236 2.025 6.567 2.637.948.436 1.011.487.914.744-.058.152-.143.662-.19 1.135l-.086.859-2.27 1.149c-3.59 1.817-6.797 3.682-9.85 5.728-.774.518-1.449.938-1.5.934a72.388 72.388 0 0 1-1.833-.409zm32.416-3.94a60.955 60.955 0 0 0-2.291-1.7l-.857-.585.076-.788c.042-.433.11-.823.151-.865.125-.13 3.79-1.024 5.773-1.409 3.001-.582 7.705-1.203 9.17-1.21l.474-.003-.413.435c-.915.96-3.381 2.99-4.852 3.991-1.408.958-4.382 2.654-5.399 3.08l-.398.166-1.434-1.113zm-44.052-.608c-3.64-2.07-7.419-5.46-9.922-8.9-.914-1.258-2.457-3.807-2.89-4.776l-.155-.348 2.135.082c2.896.111 7.41.492 10.172.857 1.926.255 6.574.998 6.609 1.057.005.01.106.37.223.798.261.955.686 1.822 1.207 2.464l.394.486-1.023 1.254c-1.213 1.488-4.306 5.598-5.07 6.74-.298.442-.595.803-.66.8-.067-.002-.525-.233-1.02-.515zm38.709-8.178c-2.14-2.016-5.687-2.384-8.12-.841-1.234.783-1.011.785-2.787-.024-2.014-.918-3.598-1.558-6.03-2.434l-1.919-.693-.027-.88c-.016-.483-.091-1.148-.169-1.476l-.14-.598 1.547-1.488a167.9 167.9 0 0 1 3.147-2.929l1.6-1.44 1.1-.162c2.59-.381 4.373-1.229 6.025-2.863 1.198-1.185 1.899-2.247 2.523-3.823l.387-.975 1.96-1.357c2.399-1.66 6.265-4.056 8.673-5.374l1.794-.983.485.391c1.266 1.02 2.684 1.516 4.324 1.515.616 0 1.337-.08 1.678-.183.471-.142.628-.15.734-.034.075.08.948 1.338 1.94 2.794 2.568 3.769 4.445 6.886 6.501 10.799l.636 1.21-.51 1.55c-.66 1.997-1.864 4.647-2.94 6.466l-.85 1.44-2.215.087c-5.748.227-11.814 1.141-16.99 2.56-.827.227-1.538.41-1.581.408-.043-.003-.392-.3-.776-.663zm-32.483-7.542c-.087-.087-4.366-.77-6.766-1.08-3.122-.403-7.847-.776-11.151-.88l-2.754-.088-.345-1.08c-.49-1.527-1.114-4.429-1.429-6.634l-.268-1.883-.038-28.76-.037-28.76h29.633l.04 26.72c.044 28.39.013 26.791.556 28.821.909 3.4 3.062 6.077 5.886 7.316.363.159.702.323.753.365.052.041-.632.76-1.518 1.596l-1.612 1.521-.88-.471c-1.252-.67-2.102-.886-3.479-.881-1.285.004-2.21.246-3.397.89-.902.488-2.143 1.75-2.587 2.63-.328.65-.466.799-.607.658zm58.803-11.236c-1.104-1.953-2.806-4.632-4.719-7.426l-1.847-2.7.265-.36c.747-1.012 1.239-2.426 1.28-3.68l.032-.921.96-.387c.527-.212 1.877-.721 2.999-1.131l2.039-.746.034 6.672c.033 6.256-.086 10.656-.309 11.459-.093.338-.117.313-.734-.78zm-28.441-17.74v-10.46l.39.322c1.512 1.253 5.142 4.67 7.425 6.989l2.718 2.76-.286.583c-.489.998-.681 2.005-.63 3.292l.047 1.162-1.863 1.021c-1.88 1.03-6.69 3.949-7.411 4.497l-.39.296V41.01zm21.233-1.89c-1.89-1.886-4.913-2.394-7.572-1.273l-.434.183-3.285-3.287c-3.29-3.293-5.552-5.38-8.412-7.759l-1.528-1.272V.818h29.51v36.289l-1.534.517c-.844.284-2.53.892-3.747 1.35-1.217.457-2.24.825-2.274.817-.035-.007-.36-.31-.722-.672z" fill="#00b092"/>
				</svg>
				<div class="card">
					<?php if ( is_user_logged_in() ) : ?>
						<h1>Welcome back, <?php echo esc_html( $user->first_name ); ?>!</h1>
						<div>
							<a class="btn btn--primary" href="/user">My Profile</a>
							<a class="btn btn--secondary" href="/logout">Logout</a>
						</div>
					<?php else : ?>
						<h1>General Members</h1>
						<a class="btn btn--primary" href="#registration">Register Here</a>
					<?php endif; ?>
				</div>
				<?php if ( ! is_user_logged_in() ) : ?>
					<div class="card">
						<a class="btn btn--secondary" href="#about">Learn More</a>
					</div>
				<?php else : ?>
					<div class="home__series-logos">
						<a href="/in-training-exam">
							<img src="/wp-content/uploads/2018/01/ALiEM-In-Training-Exam-Prep-Quiz-Sets-1-5-2nd-ed-cover-231x300.png" alt="In Training Exam Prep Button">
						</a>
						<a href="/air">
							<img src="<?php Tags\the_asset_url( 'air-logo.svg' ); ?>" alt="AIR Button">
						</a>
						<a href="/air-pro">
							<img src="<?php Tags\the_asset_url( 'air-pro-logo.svg' ); ?>" alt="AIR-Pro Button">
						</a>
						<a href="/capsules">
							<img src="<?php Tags\the_asset_url( 'capsules-logo.svg' ); ?>" alt="Capsules Button">
						</a>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<?php if ( ! is_user_logged_in() ) : ?>
			<div class="home__row" id="about">
				<div class="card">
					<h1>What is ALiEMU?</h1>
					<p>ALiEMU is an open-access, on-demand, online school of e-courses for anyone practicing Emergency Medicine worldwide. We serve as a platform where educators can submit e-courses, whereupon each will undergo expert peer review and receive instructional design assistance to optimize online content delivery and learner retention. Only high-quality, vetted courses relevant to the EM community are published as an on-demand course on ALiEMU. <a href="/about" aria-label="Click here to learn more">Click here</a> to learn more about ALiEMU and the courses offered.</p>
				</div>
			</div>
			<div class="home__row" id="registration">
				<div class="card">
					<h1>General Registration</h1>
					<p>We welcome learners from every discipline and training level to register and take our courses. Emergency Medicine Faculty with appointments at U.S. Emergency Medicine residency programs should register through our <a href="/faculty-start">faculty registration</a> for access to our Educator Dashboard.</p>
					<?php echo do_shortcode( '[ultimatemember form_id=52]' ); ?>
				</div>
			</div>
		<?php endif; ?>
	</main>
</section>

<?php get_footer(); ?>
