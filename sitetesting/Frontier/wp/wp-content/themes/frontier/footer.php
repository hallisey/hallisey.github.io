<?php
/**
 * @package WordPress
 * @subpackage frontier
 * @since frontier 1.0
 */
?>

<footer>
	<?php get_sidebar( 'footer' ); ?>
</footer>

	<?php wp_footer(); ?>

<script>
(function() {
    var nav = document.getElementById('nav'),
        anchor = nav.getElementsByTagName('a'),
        current = window.location.pathname.split('/')[1];
        for (var i = 0; i < anchor.length; i++) {
        if(anchor[i].href == current) {
            anchor[i].className = "active";
        }
    }
})();
</script?
</body>
</html>