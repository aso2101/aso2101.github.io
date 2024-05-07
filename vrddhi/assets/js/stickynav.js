$(document).ready(function() {
    var topOffset = $(".course-nav").offset().top,
	navLinks = $(".course-nav nav a"),
	mainSections = $("section");
    $(".course-nav").css("top",topOffset);
    $(window).scroll(function() {
	var windowTop = $(window).scrollTop();
	navLinks.each(function() {
	    var target = $(this).attr('href'),
		section = $(target);
	    if (typeof section.offset().top !== "undefined") {
		if (section.offset().top <= windowTop) {
                    $('.course-nav nav a').removeClass('current');
		    $(this).addClass("current");
		} else {
		    $(this).removeClass("current");
		}
	    }
	});
    });
});
