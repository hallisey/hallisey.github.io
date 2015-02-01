<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other 'pages' on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since frontier 1.0
 */

get_header(); ?>

<body>
	<header>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img id="logo" src="<?php header_image(); ?>" alt="Car Service | Frontier On the Go" title="Car Service | Frontier On the Go"></a>
        <div id="cc-box">
        	<p>&ndash; Corporate Accounts<br/>&ndash; Credit Cards Welcome</p>
            <img src="http://localhost:8888/wp-content/uploads/2014/07/img-cc-logos.png" alt="cc logos" />
        </div><!--end #cc-box-->
        <div id="header-text">
        	<p class="blue">Door To Door  |  24 Hour Service</p>
            <h3>Book Now</h3>
            <p id="phone"> 718.639.3232</p>
        </div><!--end #header-text-->
    </header>
    <nav id="primary-navigation" class="site-navigation primary-navigation" role="navigation">
    	<?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
    </nav>

<div id="main-content" class="main-content">

<?php
	if ( is_front_page() && frontier_has_featured_posts() ) {
		// Include the featured content template.
		get_template_part( 'featured-content' );
	}
?>
	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">

			<?php
				// Start the Loop.
				while ( have_posts() ) : the_post();

					// Include the page content template.
					get_template_part( 'content', 'page' );

					// If comments are open or we have at least one comment, load up the comment template.
					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
				endwhile;
			?>

		</div><!-- #content -->
	</div><!-- #primary -->
	<?php get_sidebar( 'content' ); ?>
</div><!-- #main-content -->

<?php
get_sidebar();
get_footer();
