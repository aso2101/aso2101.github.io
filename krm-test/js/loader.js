var verse = '';

function initialize() {
    chapter = getUrlParameter('c');
    verse = getUrlParameter('v');
    load_edition(chapter,verse);
    load_translation(chapter,verse);
    load_apparatus(chapter,verse);
    load_manuscripts(chapter,verse,'a');
    load_manuscripts(chapter,verse,'b');
    load_manuscripts(chapter,verse,'c');
};

function load_edition(chapter,verse) {
    var ixml = "xml/edition-i.xml",
        kxml = "xml/edition-k.xml",
	xslt = "xsl/edition.xsl";
    $.when($.get(ixml),$.get(kxml),$.get(xslt)).done(function(q,r,s) {
	var thisVerseTranslit = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']"),
	    thisVerseKannada = $(r).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']");
	/* build the navigation elements */
	var prev = $(thisVerseTranslit).prev("lg,trailer").attr("n")
	var next = $(thisVerseTranslit).next("lg,trailer").attr("n")
	if (prev != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="index.html?c='+chapter+'&v='+prev+'" role="button"><span class="fa fa-chevron-left" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+prev+'</span></a></div>');
	    $("#back-nav").append(q);
	}
	if (next != null) {
	    var q = $('<a class="btn btn-primary btn-sm" href="index.html?c='+chapter+'&v='+next+'" role="button"><span class="fa fa-chevron-right" style="font-size:18px;vertical-align:middle;line-height:1.5em;"></span><br/><span class="nav-label">'+next+'</span></a></div>');
	    $("#forward-nav").append(q);
	}
	/* other data: verse number */
	$("#number").append(verse);
	/* other data: name of the meter */
	var met = $(thisVerseTranslit).attr("met");
	$("#meter").append(met);
	/* generate the content using XSLT */
	var iContent = transformXSLT(thisVerseTranslit[0],s[0]),
	    kContent = transformXSLT(thisVerseKannada[0],s[0]);
	/* append the content in the right place */
	$('#ed-roman').append(iContent);
	$('#ed-kannada').append(kContent);
    });
};

function load_apparatus(chapter,verse) {
    var xml = 'xml/edition-i.xml',
	xslt = 'xsl/apparatus.xsl';
    $.when($.get(xml),$.get(xslt)).done(function(q,r) {
	var apparatus = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']").find("note[type='apparatus']");
	if (apparatus.length !== 0) {
	    content = transformXSLT(apparatus[0],r[0]);
	    $('#apparatus').append(content);
	}
    });
}

function load_translation(chapter,verse) {
    var txml = 'xml/translation.xml',
	xslt = 'xsl/translation.xsl';
    $.when($.get(txml),$.get(xslt)).done(function(q,r) {
	var thisVerseTrans = $(q).find("div[n='"+chapter+"']").find("lg[n='"+verse+"'],trailer[n='"+verse+"']"),
	    content = transformXSLT(thisVerseTrans[0],r[0]);
	$('#translation').append(content);
    });
};

function load_manuscripts(chapter,verse,wit) {
    var a = 'xml/ms_'+wit+'.xml',
	logical = 'xsl/edition.xsl',
	physical = 'xsl/ms_physical.xsl';
    $.when($.get(a),$.get(logical),$.get(physical)).done(function(a,logical,physical) {
	console.log("trying "+chapter+"."+verse+", witness "+wit);
	var thisVerse = $(a).find("div[n='"+chapter+"']").find("lg[n='"+verse+"']");
	console.log(thisVerse);
	var content = transformXSLT(thisVerse[0],physical[0]),
	    contentL = transformXSLT(thisVerse[0],logical[0]),
	    folio = 'folio ',
	    separator = '',
	    line = '';
	if ($(thisVerse).prev().find("pb").last().attr("n")) {
	    folio += $(thisVerse).prev().find("pb").last().attr("n"); 
	    console.log("case 1");
	} else if ($(thisVerse).parent().find("pb").attr("n")) {
	    folio += $(thisVerse).parent().find("pb").attr("n");
	    console.log("case 2");
	} else {
	    folio += "[No folio number available.]";
	}
	if (folio != '') {
	    separator = " – "
	}
	if ($(thisVerse).prev().find("lb").last().attr("n")) {
	    line += "line ";
	    line += $(thisVerse).prev().find("lb").last().attr("n"); 
	    line += ":";
	} else if ($(thisVerse).parent().find("lb").last().attr("n")) {
	    line += "line "
	    line += $(thisVerse).parent().find("lb").last().attr("n");
	    line += ":";
	} else {
	    line += "[No line number available.]";
	}
	var logicalWrapper = $('<div class="ms-logical-content" id="ms-'+wit+'-logical-content"></div>'),
	    physicalWrapper = $('<div class="ms-physical-content" id="ms-'+wit+'-physical-content"></div>'),
	    lineation = $('<div><p>'+folio+separator+line+'</p></div>');
	logicalWrapper.append(contentL);
	physicalWrapper.append(content);
	$("#ms-"+wit+"-physical").append(lineation.clone());
	$("#ms-"+wit+"-physical").append(physicalWrapper);
	$("#ms-"+wit+"-logical").append(lineation.clone());
	$("#ms-"+wit+"-logical").append(logicalWrapper);
    });
};

/* gets the given parameter from the url */
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
/* XSLT transformation */
function transformXSLT(node,xsl) {
  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  return xsltProcessor.transformToFragment(node,document);
}
