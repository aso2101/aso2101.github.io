$(".audiobutton").on("click", function() {
    var targetname = $(this).data("target"),
	target = $("#" + targetname)[0];
    if (target.paused) {
	target.play();
	$(this).html('<i class="fa fa-pause-circle" aria-hidden="true"></i>');
    } else {
	target.pause();
	$(this).html('<i class="fa fa-play-circle" aria-hidden="true"></i>');
    }
});
$(document).ready(function() {
    var audio = $("audio");
    audio.each(function() {
	$(this).on('ended', function() {
	    var link = $(this).attr("id"),
		target= $("[data-target='"+link+"']");
	    target.html('<i class="fa fa-play-circle" aria-hidden="true"></i>');
	});
    });
});
