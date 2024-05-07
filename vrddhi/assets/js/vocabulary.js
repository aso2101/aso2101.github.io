function loadVocabulary(vocab) {
    if (vocab == "cumulative") {
	loadCumulativeVocabulary();
    }
    else {
	$.get("/vrddhi/assets/csv/"+vocab+".csv", function(data) {
	    var arrays = $.csv.toArrays(data),
		cumulative = false;
	    makeTable(arrays,cumulative);
	}).done(function() {
	    transliterate();
	});
    }
};
function loadCumulativeVocabulary() {
    var url = new URL(window.location.href),
	c = url.searchParams.get("v").replace(/^0+/,''),
	urllist = [],
	totalCsv = [],
	i;
    for (i = 3; i <= c; i++) { // the vocabulary starts at 3!
	var formattedNumber = ("0" + i).slice(-2),
	    csvFile = "/vrddhi/assets/csv/vocab-"+formattedNumber+".csv";
	urllist.push(csvFile);
    }
    downloadRecursively(urllist,0,urllist.length,totalCsv);
    $("#heading").append("<p>This is the cumulative vocabulary up to <b>lesson "+c+"</b>.</p>");
};

function downloadRecursively(urllist,i,limit,totalCsv) {
    $.get(urllist[i]).done(function(data) {
	if (i == 0) { var arrays = $.csv.toArrays(data); }
	else {
	    var arrays = $.csv.toArrays(data.split("\n").slice(1).join("\n"));
	}
	totalCsv.push(...arrays);
	if (i < (limit - 1)) {
	    i++;
	    downloadRecursively(urllist,i,limit,totalCsv);
	}
	else {
	    var cumulative = true;
	    makeTable(totalCsv,cumulative);
	    transliterate();
	}
    });
}


// there are two kinds of vocabulary lists: the
// weekly and cumulative lists, which are contained in
// google spreadsheets, and thematic lists, which are
// contained in json documents, since they are a bit
// more complicated. there are accordingly two functions
// for processing the data, one for the google spreadsheets,
// and one for the json data.


function addHeader(metadata) {
    var row = $("<div class='row d-flex align-items-center' id='vocab-"+metadata.title+"'></div>"),
	header = $("<h5 id='verse_title' class='py-3 mr-auto ml-3'>"+metadata.title+"</h5>"),
	btnGroup = $("<div class='btn-group btn-group-sm ml-auto pb-3' role='group' aria-label='external links'></div>");
    if (metadata.link) {
	btnGroup.append("<a class='btn btn-secondary' href='"+metadata.link+"'>Google Spreadsheet</a>");
    }
    if (metadata.quizlet) {
	btnGroup.append("<a class='btn btn-secondary' href='"+metadata.quizlet+"'>Quizlet Study Set</a>");
    }
    row.append(header);
    row.append(btnGroup);
    $(".container").append(row);
};

function addHeaderThematic(heading) {
    var row = $("<div class='row'></div>"),
	col = $("<div class='col d-flex justify-content-between mt-3 mb-2'></div>"),
	sktTitle = $("<h2 class='text-left'><span class='translit'>"+heading.sanskrit+"</span></h2>"),
	engTitle = $("<h2 class='text-muted text-right'>"+heading.english+"</h2>");
    col.append(sktTitle).append(engTitle);
    row.append(col);
    $(".container").append(row);
}

function makeComparer(order) {
    var ap = Array.prototype;
    var orderMap = {},
	max = order.length + 2;
    ap.forEach.call(order,function(char,idx) {
	orderMap[char] = idx + 1;
    });
    function compareChars(l,r) {
	var lOrder = orderMap[l] || max,
	    rOrder = orderMap[r] || max;
	return lOrder - rOrder;
    }
    function compareArrays(l,r) {
	var minLength = Math.min(l[1].length,r[1].length);
	var result = ap.reduce.call(l[1].substring(0,minLength), function(prev, _, i) {
	    return prev || compareChars(removeAccents(l[1][i]), removeAccents(r[1][i]));
	}, 0);
	return result || (l[1].length - r[1].length);
    }
    return compareArrays;
};


function sortByType(arrays) {
    var sortedByType = { };
    $.each(arrays, function(key,value) {
	if (key == 0) { /* skip the first line */
	} else {
	    if (value[4] in sortedByType) {
		sortedByType[value[4]].push(value);
	    }
	    else {
		sortedByType[value[4]] = [ value ];
	    }
	}
    });
    $.each(sortedByType, function(key,value) {
	var comparer = makeComparer(['a','ā','i','ī','u','ū','r̥','ē','ō','ai','au','k','kh','g','gh','ṅ','c','ch','j','jh','ñ','ṭ','ṭh','ḍ','ḍh','ṇ','t','th','d','dh','n','p','ph','b','bh','m','y','r','l','v','ś','ṣ','s','h']);
	value.sort(comparer);
    });
    return sortedByType;
}

function makeRow(key,value,cumulative) {
    var toggle = $('<a href="javascript:void(0);" data-toggle="collapse" data-target="#div-'+key+'" aria-expanded="false"></a>').append("<span class='translit'>"+value[1]+"</span>"),
	dl = $('<dl class="row"></dl>'),
	dd = $('<dt class="col-3 d-flex align-items-center justify-content-end unhidden"></dt>').append(toggle),
	dt = $('<dd class="col-9 d-flex align-items-center justify-content-start unhidden"></dd>').append(value[2]),
	div = $('<div class="collapse notes" id="div-'+key+'"></div>');
    if (value.length >= 15) {
	var m = { };
	if (value[4].length > 0) { m["class"] = value[4]; }
	if (value[5].length > 0) { m["stem"] = value[5]; }
	if (value[6].length > 0) { m["gender"] = value[6]; }
	if (value[7].length > 0) { m["number"] = value[7]; }
	if (value[8].length > 0) { m["case"] = value[8]; }
	if (value[9].length > 0) { m["person"] = value[9]; }
	if (value[10].length > 0) { m["padam"] = value[10]; }
	if (value[11].length > 0) { m["root"] = value[11]; }
	if (value[12].length > 0) { m["preverb"] = value[12]; }
	if (value[13].length > 0) { m["l"] = value[13]; }
	if (value[14].length > 0) { m["gana"] = value[14]; }
	var word = { "morphology": m },
	    output = morphology(word),
	    lemma,
	    dictLinks = {
		"apte" : [ "https://dsal.uchicago.edu/cgi-bin/app/apte_query.py?qs=", "&searchhws=yes" ],
		"mw": [ "https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2014/web/webtc/getword.php?key=", "&filter=deva&transLit=hk" ],
		"v": [ "https://www.sanskrit-lexicon.uni-koeln.de/scans/VCPScan/2020/web/webtc/getword.php?key=", "&filter=deva&transLit=hk" ],
		"sd": [ "http://sanskritdictionary.com/?iencoding=slp1&q=", "&lang=sans&action=Search" ]
	    };
	switch(value[4]) {
	case "verb":
	    lemma = value[12] + value[11];
	    break;
	case "adj":
	    lemma = value[5].substr(0,value[5].indexOf(','));
	    break;
	case "noun":
	    lemma = value[5];
	    break;
	case "particle":
	    lemma = value[1];
	    break;
	default:
	    lemma = value[1];
	    break;
	}
	lemma = removeAccents(lemma).replace("-","");
	if (cumulative == true) {
	    var str = parseInt(value[0]);
	    dt.append('<span class="ml-2">(<a class="small" href="/vrddhi/lessons/'+value[0]+'/" target="_blank">'+str.toString()+'</a>)</span>');
	}
	dt.append('<a href="'+dictLinks["mw"][0] + Sanscript.t(lemma,'iso','hk') + dictLinks["mw"][1]+'" target="_blank" class="ml-4 badge badge-red"><small>m.-w.</small></a>');
	dt.append('<a href="'+dictLinks["apte"][0] + Sanscript.t(lemma,'iso','devanagari') + dictLinks["apte"][1]+'" target="_blank" class="ml-2 badge badge-red"><small>apte/ddsa</small></a>');
	dt.append('<a href="'+dictLinks["sd"][0] + Sanscript.t(lemma,'iso','slp1') + dictLinks["sd"][1]+'" target="_blank" class="ml-2 badge badge-red"><small>sd</small></a>');
	dt.append('<a href="'+dictLinks["v"][0] + Sanscript.t(lemma,'iso','hk') + dictLinks["v"][1]+'" target="_blank" class="ml-2 badge badge-red"><small>vā.</small></a>');
	if (value[3].length > 0) {
	    div.append(value[3]); //notes
	}
	div.append(output);
    } 
    return $("<div></div>").append(dl.append(dd).append(dt)).append(div);
}

function makeTable(arrays,cumulative) {
    var table = $('<div class="vocabulary"></div>'),
	sortedArrays = sortByType(arrays);
    $.each(sortedArrays, function(wordclass,array) {
	var wordclassDict = { adj: "Adjectives", noun: "Nouns", verb: "Verbs", indecl: "Indeclinables", adv: "Adverbs", particle: "Particles", pron: "Pronouns", numeral: "Numerals", adp: "Adpositions" },
	    wordclassdiv = $("<div id='"+wordclass+"'></div>"),
	    header = $("<h5>"+wordclassDict[wordclass]+"</h5>");
	wordclassdiv.append(header);
	$.each(array, function(key,value) {
	    var k = wordclass + key;
	    wordclassdiv.append(makeRow(k,value,cumulative));
	});
	table.append(wordclassdiv);
    });
    $("#vocabulary").append(table);
};

function makeVerbTable(data) {
    var arrays = $.csv.toArrays(data),
	rows = [];
    $(".container").append("<table class='table table-hover' id='vocablist'></table>");
    $.each(arrays, function(key,value) {
	/* go through each line of the csv file */
	if (key == 0 || key == 1) { /* skip the first line */
	} else {
	    var vocab = {
		"bhvadi": [ "1", "bhvādiḥ" ],
		"adadi": [ "2", "adādiḥ" ],
		"jvadi": [ "3", "jvādiḥ" ],
		"divadi": [ "4", "divādiḥ" ],
		"svadi": [ "5", "svādiḥ" ],
		"tudadi": [ "6", "tudādiḥ" ],
		"rudhadi": [ "7", "rudhādiḥ" ],
		"tanadi": ["8","tanādiḥ"],
		"kryadi": [ "9", "kryādiḥ" ],
		"curadi": [ "10", "curādiḥ" ],
		"parasmai": [ "parasmaipadam", "parasmaipadam" ],
		"atmane": [ "ātmanēpadam", "ātmanēpadam" ],
		"ubhaya": [ "ubhayapadam", "ubhayapadam" ]
	    };
	    var thisclass = value[13];
	    var padam = value[9];
	    var row = [
		vocab[thisclass][0], /* gaṇa */
		"",
		"<span class='translit'>"+value[0]+"</span>", /* the word */
		value[1], /* the meaning */
		"<span class='translit'>"+vocab[padam][0]+"</span>", /* padam */
		value[3], /* the word class */
		value[2], /* notes */
		value[4], /* its stem(s) */
		value[5], /* gender */
		value[6], /* number */
		value[7], /* case */
		value[8], /* person */
		value[12], /* tense-mood */
		value[10], /* root */
		value[11] /* preverb */
	    ];
	    var mwurl,
		upasarga = value[11],
		plainroot = value[10];
	    if (upasarga.length != 0) {
		mwurl = "http://www.sanskrit-lexicon.uni-koeln.de/scans/MW72Scan/2014/web/webtc/getword.php?key="+Sanscript.t(upasarga,'iso','itrans')+Sanscript.t(plainroot,'iso','itrans')+"&filter=deva&noLit=off&transLit=itrans";
		row[1] = "<a href='"+mwurl+"' target='_blank'><span class='translit'>"+value[11]+"</span>-√<span class='translit'>"+value[10]+"</span></a>";
	    }
	    else {
		mwurl = "http://www.sanskrit-lexicon.uni-koeln.de/scans/MW72Scan/2014/web/webtc/getword.php?key="+Sanscript.t(plainroot,'iso','itrans')+"&filter=deva&noLit=off&transLit=itrans";
		row[1] = "<a href='"+mwurl+"' target='_blank'>√<span class='translit'>"+value[10]+"</span></span>";
	    }
	    rows.push(row);
	}
    });
    var table = $('#vocablist').DataTable( {
	"paging":false,
	"bInfo":false,
        "data": rows,
	"colReorder":true,
	"columns": [
	    { "title":"Class"},
	    { "title":"Root"},
	    { "title":"3rd.sg.pres.indic."},
	    { "title":"Meaning"},
	    { "title":"Padam"}
	]
    } );
    $('#vocablist tbody tr').on('click', function () {
	var tr = $(this);
	var row = table.row(tr);
	if ( row.child.isShown() ) {
	    // This row is already open - close it
	    $("div.morphology", row.child()).slideUp("slow", function() {
	        row.child.hide();
		tr.removeClass('shown');
	    });
	}
	else {
	    // Open this row
	    row.child( hiddenDataVerbs(row.data()), 'no-padding').show();
	    translit();
	    tr.addClass('shown');
	    $('div.morphology', row.child()).slideDown("slow", function() {
	    });
 	}
    } );
    makeExpandButton(table,'verbs');
};

function makeTableThematic(list) {
    var carddeck = $("<div class='card-columns' style='column-count:1;'></div>"),
	searchbox = $('<div style="text-align:right;"><label style="display:inline-block;text-align:left;">Search:<input type="search" class="form-control form-control-sm" name="vocabterm" placeholder="" style="display:inline-block;width:auto;margin-left:0.5em;"></label></div>');
    $.each(list, function(x,y) {
	var card = $("<div class='card mb-3 box-shadow row d-flex flex-row'></div>"),
	    cardBody = $("<div class='card-body d-flex flex-row col-9'></div>"),
	    cardHeader = $("<h5 class='card-title pt-2'>"+y.name+"</div>"),
	    cardImage = $("<img class='img-thumbnail m-1' src='"+y.image+"'></img>"),
	    termList = $("<ul class='list-group list-group-flush thematic-vocab-list'></ul>");
	if (y.image) {
	    var cardLeft = $("<div class='col-4'></div>"),
		cardRight = $("<div class='col-8'></div>");
	    cardLeft.append(cardImage);
	    card.append(cardLeft);
	} else {
	    var cardRight = $("<div class='col-12'></div>");
	}
	$.each(y.terms,function(x,y) {
	    var row = $("<li class='list-group-item p-2'></li>");
	    $.each(y.subterms,function(x,y) {
		if (x > 0) { row.append(", "); }
		var link = $("<a class='translit' tabindex='0' data-toggle='popover' data-trigger='focus' data-html='true'></a>"),
		    slpstem = Sanscript.t(y.stem.replace('-',''),'iso','slp1'),
		    slpnom = Sanscript.t(y.lemma,'iso','slp1'),
		    devnom = Sanscript.t(y.lemma,'iso','devanagari'),
		    listgroup = $("<ul class='list-inline dictionaries m-0'></ul>"),
		    mwlink = $("<li class='list-inline-item'><a href='http://www.sanskrit-lexicon.uni-koeln.de/scans/MW72Scan/2014/web/webtc/getword.php?key="+slpstem+"do&filter=deva&noLit=off&transLit=slp1' target='_blank'>m-w</a></li>"),
		    spslink = $("<li class='list-inline-item'><a href='http://sanskritdictionary.com/?iencoding=slp1&q="+slpstem+"&lang=sans&action=Search' target='_blank'>spoken skt.</a></li>"),
		    aptelink = $("<li class='list-inline-item'><a href='http://dsalsrv02.uchicago.edu/cgi-bin/philologic/search3advanced?dbname=apte&query="+devnom+"&searchdomain=headwords&matchtype=start&display=utf8' target='_blank'>ddsa apte</a></li>");
		listgroup.append(mwlink).append(aptelink).append(spslink);
		link.attr("title","Stem: <span class='translit'>"+y.stem+"</span>").attr("data-content",listgroup.prop('outerHTML'));
		link.append("<span class='translit'>"+y.lemma+"</span>");
		row.append(link);
		if (y.class == "noun") {
		    row.append(" ("+y.gender+".)");
		}
	    });
	    if (y.note) {
		row.append("<p class='ml-3 mb-0 pt-1' style='font-size:90%;'>"+y.note+"</p>");
	    }
	    termList.append(row);
	});
	cardRight.append(cardHeader).append(termList);
	card.append(cardRight);
	carddeck.append(card);
    });
    $(".container").append(searchbox);
    $(".container").append(carddeck);
    filterTerms();
};

function filterTerms() {
    var $input = $("input[name='vocabterm']"),
	$context = $(".card");
    $input.on("input", function() {
	var term = $(this).val();
	$context.removeClass('d-none');
	$context.show().unmark();
	if (term) {
	    $context.mark(term, {
		done: function() {
		    $context.not(":has('mark')").hide();
		    $context.not(":has('mark')").addClass('d-none');
		}
	    });
	}
    });
};

function hiddenData(data) {
    /* there are again two options:
     if data is an array of 10 values, then it's the old format;
     if not, it's the new format. */
    if (data.length == 9) {
	var output = legacyMorphology(data);
	return output[0].outerHTML;
    } else {
	var m = { };
	if (data[2].length > 0) { m["pos"] = data[2]; }
	if (data[4].length > 0) { m["stem"] = data[4]; }
	if (data[5].length > 0) { m["gender"] = data[5]; }
	if (data[6].length > 0) { m["number"] = data[6]; }
	if (data[7].length > 0) { m["case"] = data[7]; }
	if (data[8].length > 0) { m["person"] = data[8]; }
	if (data[9].length > 0) { m["padam"] = data[9]; }
	if (data[10].length > 0) { m["root"] = data[10]; }
	if (data[11].length > 0) { m["preverb"] = data[11]; }
	if (data[12].length > 0) { m["lakara"] = data[12]; }
	if (data[13].length > 0) { m["gana"] = data[13]; }
	var word = { 
	    "morphology": m 
	};
	var output = morphology(word);
	if (data[3].length > 0) { output.append("<div class='row'><p>"+data[3]+"</p></div>"); }
    }
    return output[0].outerHTML;
};

function hiddenDataVerbs(data) {
    /* don't return anything at the monent. */
    var wrapper = $("<div class='row morphology justify-content-center mt-1 pb-3 pt-3'></div>"),
	col = $("<div class='col-11'></div>"),
	patel = $("<p><small>This information is generated using Dhaval Patel’s <a href='https://github.com/drdhaval2785/prakriya'>SanskritVerb</a> web service and the <a href='https://docs.google.com/spreadsheets/d/14UEZmuSvbbdxAnqpZdSvSH8hrp3flPhPoo01aSXhbDY/edit#gid=1652568209'><span class='translit'>Ārdhadhātukakr̥dantakōśaḥ</span></a>.</small></p>"),
	upasarga = data[14],
	plainroot = data[13],
	mwurl = '(<a href="http://www.sanskrit-lexicon.uni-koeln.de/scans/MW72Scan/2014/web/webtc/getword.php?key='+Sanscript.t(upasarga,'iso','itrans')+Sanscript.t(plainroot,'iso','itrans')+'&filter=deva&noLit=off&transLit=itrans" target="_blank">m-w</a>)',
	form = $(data[2]).text(),
	slpform = Sanscript.t(form,'iso','slp1'),
	url = "https://api.sanskritworld.in/v0.0.2/verbforms/slp1/"+slpform+"?output_transliteration=slp1",
	krdanta = "https://docs.google.com/spreadsheets/d/14UEZmuSvbbdxAnqpZdSvSH8hrp3flPhPoo01aSXhbDY/export?format=csv&id=14UEZmuSvbbdxAnqpZdSvSH8hrp3flPhPoo01aSXhbDY&gid=1652568209",
	notes = data[6];
    if (notes.length) {
	col.append("<p><b>Notes: </b>"+notes+"</p>");
    }
    $.getJSON(url,function(n) {
	var header = $("<h6 class='pt-2'></h6>"),
	    root = Sanscript.t(n[0].verb,'slp1','iso'),
	    rootdn = Sanscript.t(plainroot,'iso','devanagari'),
	    meaning = Sanscript.t(n[0].meaning,'slp1','iso'),
	    padam = Sanscript.t(n[0].padadecider_id,'slp1','iso');
	header.append("Root: <span class='translit'>"+root+"</span> (<span class='translit'>"+meaning+"</span>), <span class='translit'>"+padam+"</span> "+mwurl);
	$.get(krdanta,function(data) {
	    var arrays = $.csv.toArrays(data);
	    for (var q = 0; q < arrays.length; q++) {
		if (arrays[q][4] == rootdn) {
		    var kta = Sanscript.t(arrays[q][5],'devanagari','iso'), /* Kta */
			ktavatu = Sanscript.t(arrays[q][6],'devanagari','iso'), /* KtavatU */
			ktva = Sanscript.t(arrays[q][7],'devanagari','iso'), /* Ktvā */
			lyap = Sanscript.t(arrays[q][8],'devanagari','iso'), /* LyaP */
			tumun = Sanscript.t(arrays[q][9],'devanagari','iso'), /* tumun */
			tavyat = Sanscript.t(arrays[q][10],'devanagari','iso'), /* tavyat */
			trc = Sanscript.t(arrays[q][11],'devanagari','iso'), /* tr̥C */
			nvul = Sanscript.t(arrays[q][14],'devanagari','iso'), /* ṆvuL */
			ghan = Sanscript.t(arrays[q][15],'devanagari','iso'), /* GHaÑ */
			nyat = Sanscript.t(arrays[q][16],'devanagari','iso'), /* ṆyaT */
			aniyar = Sanscript.t(arrays[q][17],'devanagari','iso'), /* anīyaR */
			lyut = Sanscript.t(arrays[q][18],'devanagari','iso'); /* LyuṬ */
		    var innerrow = $("<div class='row'></div>"),
			dlz = $("<div class='col-5' style='display:block;'></div>"),
			dlf = $("<div class='col-7' style='display:block;'></div>"),
			zero = $("<p class='mb-1'>Zero-grade forms:</p>"),
			full = $("<p class='mb-1'>Full-grade forms:</p>");
		    dlz.append("<p class='mb-0'><span class='translit text-info'>Kta</span> — <span class='translit'>"+kta+"</span></p>");
		    dlz.append("<p class='mb-0'><span class='translit text-info'>KtavatU</span> — <span class='translit'>"+ktavatu+"</span></p>");
		    dlz.append("<p class='mb-0'><span class='translit text-info'>Ktvā</span> — <span class='translit'>"+ktva+"</span></p>");
		    dlz.append("<p class='mb-0'><span class='translit text-info'>LyaP</span> — <span class='translit'>"+lyap+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>tumUN</span> — <span class='translit'>"+tumun+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>tavyaT</span> — <span class='translit'>"+tavyat+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>anīyaR</span> — <span class='translit'>"+aniyar+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>ṆyaT</span> — <span class='translit'>"+nyat+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>tr̥C</span> — <span class='translit'>"+trc+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>ṆvuL</span> — <span class='translit'>"+nvul+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>GHaÑ</span> — <span class='translit'>"+ghan+"</span></p>");
		    dlf.append("<p class='mb-0'><span class='translit text-info'>LyuṬ</span> — <span class='translit'>"+lyut+"</span></p>");
		    dlz.prepend(zero);
		    dlf.prepend(full);
		    innerrow.append(dlz);
		    innerrow.append(dlf);
		    col.append(header);
		    col.append(innerrow);
		    break;
		}
	    }
	}).fail(function() {
	    col.append(header);
	    col.append("<p>Could not get verb information from <span class='translit'>Ārdhadhātukakr̥dantakōśaḥ</span>.</p>");
	}).done(function() {
	    col.append(patel);
	});	
    }).fail(function() {
	col.prepend("<p>An error occurred. The requested verb may not be in the database.</p>");
    });
    wrapper.append(col);
    return wrapper;
};

function legacyMorphology(data) {
    var cl = data[2],
	form = data[3],
	stem = data[4],
	gender = data[5],
	root = data[6],
	gana = data[7],
	notes = data[8];
    var wrapper = $("<div class='row morphology justify-content-center'></div>"),
	col = $("<div class='col-11'></div>"),
	header = $("<h6></h6>");
    if (cl == 'Noun') {
	header.append("Noun");
	header.append(" ["+gender+"]");
	header.append(" (stem: <span class='translit san-Latn'>"+stem+"</span>)");
	col.append(header);
    } else if (cl == 'Adjective') {
	header.append("Adjective");
	header.append(" (stem: <span class='translit san-Latn'>"+stem+"</span>)");
	col.append(header);
    } else if (cl == 'Verb') {
	header.append("Verb");
	if (root.length > 0) { 
	    header.append(" (root: <span class='translit san-Latn'>"+root+"</span>"); 
	    if (gana.length > 0) { 
		header.append(", class "+gana);
	    }
	    header.append(")");
	}
	col.append(header);
    } else if (cl == 'Adverb') {
	header.append("Adverb");
	col.append(header);
    }
    if (form.length > 0) { col.append("<p>"+form+"</p>"); }
    if (notes.length > 0) { col.append("<p>"+notes+"</p>"); }
    wrapper.append(col);
    return wrapper;
};

function makeExpandButton(table,param) {
    var button = $("<button type='button' class='btn btn-secondary btn-sm' data-toggle='button' aria-pressed='false' autocomplete='off' id='expandall' style='cursor:pointer;'>open all</button>");
    $("#vocablist_wrapper div.row div.col-sm-12").first().append(button);
    $("#expandall").on('click', function() {
	var trs = $("#vocablist tbody tr");
	if ($(this).hasClass("active")) {
	    /* if it is already active */
	    trs.each(function() {
		var tr = $(this),
		    row = table.row(tr);
		$("div.morphology", row.child()).slideUp("slow", function() {
	            row.child.hide();
		    tr.removeClass('shown');
		});
	    });
	} else {
	    trs.each(function() {
		var tr = $(this),
		    row = table.row(tr);
		if (param == 'verbs') {
		    row.child( hiddenDataVerbs(row.data()), 'no-padding').show();
		}
		else {
		    row.child( hiddenData(row.data()), 'no-padding').show();
		}
		translit();
		tr.addClass('shown');
		$('div.morphology', row.child()).slideDown("slow", function() {
		});
	    });
	}
    });
};

function loadVocabularyTable(vocab,quarter) {
    /* this is a list of all of the verses */
    var heading = $(quarter),
	table = $("<table class='table table-hover vocabularylist'></table>"),
	thead = $("<thead class='thead-default'><tr><th>List</th><th>Notes</th></tr>"),
	tbody = $("<tbody></tbody"),
	comments = "",
	link = "",
	quizlet = "";
    $.each(vocab, function(x,y) {
	if (y.comments) {
	    comments = y.comments;
	}
	if (y.link) {
	    link = " <a href='"+y.link+"' title='Google Spreadsheet'><i class='fab fa-google-drive fa-sm'></i></a>";
	}
	if (y.quizlet) {
	    quizlet = " <a href='"+y.quizlet+"' title='Quizlet Study Set'><i class='far fa-clone fa-sm'></i></a>";
	}
	var row = $("<tr><td><a href='vocabulary.html?p="+x+"'>"+y.title+"</a>"+link+quizlet+" </td><td>"+comments+"</td></tr>");
	tbody.append(row);
    });
    table.append(thead).append(tbody);
    $(".container").append(heading);
    $(".container").append(table);
};

function loadVocabularyThematicTable(vocab,title) {
    var heading = $(title),
	table = $("<table class='table table-hover vocabularylist'></table>"),
	thead = $("<thead class='thead-default'><tr><th>List</th><th>Notes</th></tr>"),
	tbody = $("<tbody></tbody"),
	comments = "",
	link = "",
	quizlet = "";
    $.each(vocab, function(x,y) {
	if (y.comments) {
	    comments = y.comments;
	}
	if (y.url) {
	    link = " <a href='"+y.url+"' title='JSON File'><i class='fas fa-file fa-sm'></i></a>";
	}
	if (y.quizlet) {
	    quizlet = " <a href='"+y.quizlet+"' title='Quizlet Study Set'><i class='far fa-clone fa-sm'></i></a>";
	}
	var row = $("<tr><td><a href='vocabulary.html?p="+x+"'>"+y.title+"</a>"+link+quizlet+" </td><td>"+comments+"</td></tr>");
	tbody.append(row);
    });
    table.append(thead).append(tbody);
    $(".container").append(heading);
    $(".container").append(table);
};
