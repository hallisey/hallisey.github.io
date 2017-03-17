function openNav() {
    $('#nav').css('width','250px');
    $('#main').css('margin-left','250px');
    $('.openbtn').html('&times;');
    $('.openbtn').attr('onclick','closeNav()');
    $('.sidenav').css('padding','30px');
    $('.sidenav a').css('opacity','1');
}

function closeNav() {
    $('#nav').css('width','0px');
    $('#main').css('margin-left','0px');
    $('.openbtn').html('&#9776;');
    $('.openbtn').attr('onclick','openNav()');
    $('.sidenav').css('padding','0px');
    $('.sidenav a').css('opacity','0');
}