<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'frontier_db');


/** MySQL database username */
define('DB_USER', 'root');


/** MySQL database password */
define('DB_PASSWORD', 'root');


/** MySQL hostname */
define('DB_HOST', 'localhost');


/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'C,c3XklZn/+y|0hS6rn@s|#~t@IMIFKoh;%Ct=,^!Bm+,Cz!+I9PneY(UM4Oj DC');

define('SECURE_AUTH_KEY',  'frAGEqbGg+?IHFT5z-]%*U#4?+J%h^4/hfKb+.X4r+*3Hj5jFB*?fX6aZ!<V4&-L');

define('LOGGED_IN_KEY',    '&bd+_/bZ(k}VLE{gPQG1jGQ5uC7);TtY96g`GDlV%!}c]W_JMi)4C0Wn:$Erw+(1');

define('NONCE_KEY',        'G&ooh;:>-J/qK8[^+8dzDn@1RuN9tJk1z?pQX:}XKwFT3vEI/o[|tj(05J!Fi`|h');

define('AUTH_SALT',        'M*>0jA9m)q4Qp<#Z-~>1^BbqSxhywm_jk{=@Z{|kw)j]K}l_%<Mc@z%WfibBH~k2');

define('SECURE_AUTH_SALT', '0vB_=~Bb#M4&o-H_bt{P-Y96 FizC04y|5+GBf0+~rq6kUj|.z6r#JCr|O4Z$B#q');

define('LOGGED_IN_SALT',   'z%$~v}!~THiW:- (n}hJGHPxS;]+6i)EAZPoeA>z`b?mOzZ6_qY/s!~F7!nV};wj');

define('NONCE_SALT',       'y!~V-)d,=|$pR:bR%P)@h3mny4z=vFTV3U567iP93pdHl@Y2`{A)bhxsl[dYK$6f');


/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';


/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);
define('SAP_REMOVE_THESE_MENUS', 'Posts, Comments');
define('SAP_REMOVE_THESE_SUBMENUS', 'appearance|Themes, Background, plugins|Editor, Settings|Reading, Writing, Discussion');
define('SAP_REMOVE_THESE_DASHBOARD_BOXES', 'quick draft, activity, Right Now, Recent Comments, Incoming Links, Plugins, quickpress, recent drafts, wordpress blog, other wordpress news');
/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
