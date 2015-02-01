<?php /* Template Name: Home Page */ ?>


<?php get_header(); ?>

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

<?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post(); ?>

<?php the_content(); ?>

<?php endwhile; ?>
<?php else : ?>
<?php endif; ?>

<?php get_footer(); ?>
