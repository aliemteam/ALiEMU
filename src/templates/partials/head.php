<?php
/**
 * Main document head.
 *
 * @package ALiEMU
 */

?>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/apple-touch-icon.png?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/favicon-32x32.png?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/favicon-16x16.png?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<link rel="manifest" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/aliemu.webmanifest?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<link rel="mask-icon" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/safari-pinned-tab.svg?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>" color="#00b092">
	<link rel="shortcut icon" href="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/favicon.ico?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<meta name="apple-mobile-web-app-title" content="ALiEMU">
	<meta name="application-name" content="ALiEMU">
	<meta name="msapplication-TileColor" content="#00b092">
	<meta name="msapplication-config" content="<?php echo esc_attr( ALIEMU_ROOT_URI ); ?>/assets/site/browserconfig.xml?v=<?php echo esc_attr( ALIEMU_VERSION_HASH ); ?>">
	<meta name="theme-color" content="#ffffff">
	<?php wp_head(); ?>
</head>
