$( ".slideToggleTrigger" ).click(function() {
    var toggleIcon = $(this).parent().find(".toggleIcon"),
	toggleDiv = $(this).parent().find(".slideToggleTarget");
    toggleDiv.slideToggle( "fast", function() {
	if (toggleDiv.is(":visible")) {
	    toggleIcon.html("<i class='fas fa-compress-arrows-alt'></i>");
	}
	else {
	    toggleIcon.html("<i class='fas fa-expand-arrows-alt'></i>");
	}
    });
});
$('[data-toggle="popover"]').popover();
audiojs.events.ready(function() {
    var els = document.getElementsByClassName("audioplayer"),
	as = audiojs.createAll({}, els);
});
