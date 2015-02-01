<?php /* Template Name: custom-home */ ?>


<?php get_header(); ?>

<body>
<?php if (have_posts()) : ?>
<?php while (have_posts()) : the_post(); ?>

<?php the_content(); ?>

<?php endwhile; ?>
<?php else : ?>
<?php endif; ?>



<script class="secret-source">jQuery(document).ready(function($) {$('#homeslide').bjqs({animtype: 'fade', height:620, width:700	, animspeed:4000, automatic:false, showmarkers:false, nexttext:'', prevtext:'', responsive:true, randomstart:false});});</script>    
<script class="secret-source">jQuery(document).ready(function($) {$('#theride-slide').bjqs({animtype: 'slide', height:312, width:564, animspeed:4000, responsive:true, randomstart:false});});</script>    
<script>jQuery.noConflict();</script>
<script src="<?php echo home_url( '/' ); ?>wp-content/themes/myridez/js/jquery.js"></script>
<script src="<?php echo home_url( '/' ); ?>wp-content/themes/myridez/js/script.js"></script>

</body>
</html>