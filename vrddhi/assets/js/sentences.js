wordSeparator = "<span> ‧ </span>";

var metDict = {
    "anuṣṭubh" : "anustubh",
    "āryā" : "arya",
    "vasantatilakam" : "vasantatilaka",
    "upajātiḥ" : "upajati",
    "sragdhara": "sragdhara",
    "śārdūlavikrīḍitam" : "sardulavikridita"
};

function generate(data) {
    generateCard(data.unanalyzed,data.analyzed,data.metadata.meter,data.metadata.slug);
    addMetricalData();
    if (data.analyzed) { 
	generateModals(data.analyzed); 
    }
}
/*
    if (y.metadata.diagram) { addDiagram(y.metadata.diagram); }
    if (y.translations) { addTranslations(y.translations); }
    if (y.analyzed) { generateModals(y.analyzed); }
	});
    }).fail(function( jqxhr, textStatus, error ) {
	var err = textStatus + ", " + error;
	console.log( "Request Failed: " + err );
    });
}
*/

/* the card contains: 
   - the meter (in the header);
   - the analyzed version;
   - the unanalyzed version. */
function generateCard(unanalyzed,analyzed,meter,slug) {
    var card = $("#"+slug),
	cardHeader = card.find(".card-header"),
	cardNav = $("<ul class='nav nav-pills card-header-pills analysis-list' role='tablist'></ul>"),
	cardBody = $("<div class='card-body'></div>"),
	tabContent = $("<div class='tab-content'></div>");
    if (unanalyzed) {
	var unanalyzedTab = $("<li class='nav-item'></li>"),
	    unanalyzedTabLink = $("<a href='#unanalyzed' class='nav-link nav-unanalyzed' id='unanalyzed-tab' data-toggle='tab' role='tab' aria-controls='unanalyzed'>unanalyzed</a>"),
	    unanalyzedContent = generateUnanalyzed(unanalyzed,meter);
	unanalyzedTab.append(unanalyzedTabLink);
	cardNav.append(unanalyzedTab);
	tabContent.append(unanalyzedContent);
    }
    if (analyzed) {
	var analyzedTab = $("<li class='nav-item'></li>"),
	    analyzedTabLink = $("<a href='#analyzed' class='nav-link nav-analyzed' id='analyzed-tab' data-toggle='tab' role='tab' aria-controls='analyzed'>analyzed</a>"),
	    analyzedContent = generateAnalyzed(analyzed,meter);
	analyzedTab.append(analyzedTabLink);
	cardNav.append(analyzedTab);
	tabContent.append(analyzedContent);
    }
    cardHeader.append(cardNav);
    cardBody.append(tabContent);
    card.append(cardBody);
    /* now assign ‘active’ on the basis of the 
       local storage variable */
    var val = localStorage.getItem("analyzed");
    if (val == "yes") {
	$("#analyzed").addClass("show active");
	$(".nav-analyzed").addClass("active")
	    .attr('aria-selected','true');
	$(".nav-unanalyzed").removeClass("active")
	    .attr('aria-selected','false');
    } else {
	$("#unanalyzed").addClass("show active");
	$(".nav-unanalyzed").addClass("active")
	    .attr('aria-selected','true');
	$(".nav-analyzed").removeClass("active")
	    .attr('aria-selected','false');
    }
    /* also change the pill so that clicking
       will set the local storage variable */
    $("#unanalyzed-tab").on("click",function() {
	localStorage.setItem("analyzed","no");
    });
    $("#analyzed-tab").on("click",function() {
	localStorage.setItem("analyzed","yes");
    });
};

function generateUnanalyzed(unanalyzed,meter) {
    var tabpanel = $("<div class='tab-pane fade' id='unanalyzed' role='tabpabel' aria-labelledby='unanalyzed-tab'></div>"),
	row = $("<div class='row'></div>"),
	container = $("<div class='lg'></div>"),
	pcontainer = $("<div class='p'></div>"),
	caesura = "&nbsp;";
    /* for prose */
    if (meter == 'prose') {
	$.each(unanalyzed, function(x,y) {
	    pcontainer.append("<span class='sentence translit'>"+y+"</span>");
	});
	row.append(pcontainer);
    } else {
	if (meter != "āryā") { /* for verses that can in principle be set as four lines */
	/* choose whether to add a caesura element */
	    if (meter != "anuṣṭubh") {
		caesura = "<span class='caesura'></span>";
	    }
	    container.append("<span class='l translit'>"+unanalyzed.pada_a+caesura+unanalyzed.pada_b+"</span>");
	    container.append("<span class='l translit'>"+unanalyzed.pada_c+caesura+unanalyzed.pada_d+"</span>");
	}
	/* for verses that can only be set as two lines */
	else {
	    container.append("<span class='l translit'>"+unanalyzed.pada_ab+"</span>");
	    container.append("<span class='l translit'>"+unanalyzed.pada_cd+"</span>");
	}
	row.append(container);
    }
    tabpanel.append(row);
    return tabpanel;
};

function generateAnalyzed(analyzed,meter) {
    var tabpanel = $("<div class='tab-pane fade' id='analyzed' role='tabpabel' aria-labelledby='analyzed-tab'></div>"),
	row = $("<div class='row'></div>"),
	container, 
	shell;
    if (meter == 'prose') {
	container = $("<div class='p'></div>"),
	shell = $("<span class='sentence'></span>");
    } else {
	container = $("<div class='lg'></div>"),
	shell = $("<span class='l'></span>");
    }
    $.each(analyzed, function(x,y) {
	/* the elements of analyzed are either words
	   or punctuation elements */
	if (y.word) { /* if it is a word */
	    var link = $("<a href='javascript:void()' class='word translit' data-toggle='modal' data-target='#modal-"+x+"'>"+y.word+"</a>");
	    shell.append(link);
	    shell.append(wordSeparator);
	} else { /* if it is a punctuation element */
	    var el = $("<span class='punct "+y.punct+"'></span>");
	    shell.append(el);
	}
    });
    container.append(shell);
    row.append(container);
    tabpanel.append(row);
    return tabpanel;
};

function generateModals(analyzed) {
    $.each(analyzed, function(x,y) {
	var modal = $("<div class='modal fade' id='modal-"+x+"' tabindex='-1' role='dialog' aria-labelledby='modal-label-"+x+"'></div>"),
	    modalDialog = $("<div class='modal-dialog modal-lg' role='document'></div>"),
	    modalContent = $("<div class='modal-content'></div>"),
	    modalHeader = $("<div class='modal-header'></div>"),
	    modalFooter = $("<div class='modal-footer'></div>");
	modalHeader.append("<h5 class='modal-title translit' id='modal-label-"+x+"'>"+y.word+"</h5>");
	try {
	    var mb = modalBody(x,y);
	}
	catch(err) {
	    console.log(err);
	}
	modalContent.append(modalHeader)
	    .append(mb);
	modalDialog.append(modalContent);
	modal.append(modalDialog);
	$("body").append(modal);
    });
};

function modalBody(key,word) {
    var	modalBody = $("<div class='modal-body'></div>"),
	ul = $("<ul class='nav nav-tabs' id='modal-"+key+"-tab' role='tablist'></ul>"),
	tabContent = $("<div class='tab-content' id='modal-"+key+"-tabcontent'></div>");

    if (word.morphology) {
	var li = $("<li class='nav-item'></li>"),
	    link = $("<a class='nav-link' id='modal-"+key+"-meaning-tab' data-toggle='tab' href='#modal-"+key+"-meaning' role='tab' aria-controls='modal-"+key+"-meaning'>Meaning</a>"),
	    pane = $("<div class='tab-pane fade' id='modal-"+key+"-meaning' role='tabpanel' aria-labelledby='modal-"+key+"-morphology-tab'></div>"),
	    content = meaning(word); 
	    /* word, meaning (including def, notes, and lemma), and stem */
	pane.append(content);
	li.append(link);
	ul.append(li);
	tabContent.append(pane);
    }
    if (word.morphology) {
	var li = $("<li class='nav-item'></li>"),
	    link = $("<a class='nav-link' id='modal-"+key+"-morphology-tab' data-toggle='tab' href='#modal-"+key+"-morphology' role='tab' aria-controls='modal-"+key+"-morphology'>Morphology</a>"),
	    pane = $("<div class='tab-pane fade' id='modal-"+key+"-morphology' role='tabpanel' aria-labelledby='modal-"+key+"-morphology-tab'></div>"),
	    content = morphology(word);
	pane.append(content);
	li.append(link);
	ul.append(li);
	tabContent.append(pane);
    }
    if (word.morphology && word.morphology.class == 'verb') {
	var li = $("<li class='nav-item'></li>"),
	    link = $("<a class='nav-link' id='modal-"+key+"-prakriya-tab' data-toggle='tab' href='#modal-"+key+"-prakriya' role='tab' aria-controls='modal-"+key+"-prakriya'>Prakriyā</a>"),
	    pane = $("<div class='tab-pane fade' id='modal-"+key+"-prakriya' role='tabpanel' aria-labelledby='modal-"+key+"-prakriya-tab'></div>"),
	    content = prakriya(word.word);
	pane.append(content);
	li.append(link);
	ul.append(li);
	tabContent.append(pane);
    }
    if (word.compound) {
	var li = $("<li class='nav-item'></li>"),
	    link = $("<a class='nav-link' id='modal-"+key+"-compound-tab' data-toggle='tab' href='#modal-"+key+"-compound' role='tab' aria-controle='modal-"+key+"-morphology'>Compound</a>"),
	    pane = $("<div class='tab-pane fade' id='modal-"+key+"-compound' role='tabpanel' aria-labelledby='modal-"+key+"-compound-tab'></div>"),
	    content = compound(word.compound);
	pane.append(content);
	li.append(link);
	ul.append(li);
	tabContent.append(pane);
    }
    modalBody.append(ul);
    modalBody.append(tabContent);
    /* activate the first tab */
    modalBody.find(".nav-link").first()
	.addClass("active")
	.attr('aria-selected','true');
    modalBody.find(".tab-pane").first()
	.addClass("show")
	.addClass("active");
    return modalBody;
};

function meaning(word) {
    var wrapper = $("<div class='row meaning justify-content-center'></div>"),
	col = $("<div class='col-11'></div>"),
	header = meaningHeader(word);
    /* add the header to the meaning tab */
    col.append(header);
    /* for the meaning, first i give my own definition and a note */
    if (word.meaning) {
	if (word.meaning.def) {
	    col.append("<p>"+word.meaning.def+"</p>");
	}
	if (word.meaning.note) {
	    col.append("<p><b>Note:</b> "+word.meaning.note+"</p>");
	}
    }
    var dictionaries = dicts(word);
    col.append(dictionaries);
    wrapper.append(col);
    return wrapper;
}

function meaningHeader(w) {
    var header = "<span class='translit'>"+w.word+"</span>";
    var stem = w.morphology.stem;
    if (w.morphology.class == 'adj') {
	if (jQuery.type(stem) == 'array') {
	    header += ' (adj., stems: <span class="translit">'+stem.join(", ")+'</span>)';
	} else {
	    header += ' (adj., stem: <span class="translit">'+stem+'</span>)';
	}
    } else if (w.morphology.class == 'noun') {
	header += ' (noun, stem: <span class="translit">'+stem+'</span>)';
    } else if (w.morphology.class == 'pron') {
	header += ' (pronoun, stem: <span class="translit">'+stem+'</span>)';
    } else if (w.morphology.class == 'verb') {
	header += ' (verb, root: ';
	if (w.morphology.preverb) {
	    header += "<span class='translit'>"+w.morphology.preverb+"</span> + ";
	}
	header += '√<span class="translit">'+w.morphology.root+'</span>)';
    } else if (w.morphology.class == 'indecl') {
	header += ' (indecl.)';
    }
    return $("<div class='row'></row>").append("<h5>"+header+"</h5>");
};

function dicts(word) {
    var wrapper = $("<div class='dicts'></div>"),
	dictList = $("<ul></ul>"),
	cl = word.morphology.class,
	lemma = '';
    if (cl == 'verb') { 
	if (word.morphology.preverb) {
	    lemma = word.morphology.preverb + word.morphology.root; 
	} else { lemma = word.morphology.root; }
    } else if (cl === 'adj' || cl === 'pron' || cl === 'noun')  { 
	var stem = word.morphology.stem;
	if (jQuery.type(stem) == 'array') {
	    lemma = word.morphology.stem[0];
	} else {
	    lemma = word.morphology.stem;
	}
    } else { lemma = word.word; }
    lemma = removeAccents(lemma);
    /* exception for apte, who uses the nom. sg. for nouns */
    var apteLemma = lemma;
    if (word.morphology.class == 'noun' && word.meaning && word.meaning.lemma) { 
	apteLemma = removeAccents(word.meaning.lemma);
    }
    /* the search terms for various dictionaries */
    var apte = Sanscript.t(apteLemma.replace("-",""),'iso','devanagari'),
	apteslp = Sanscript.t(apteLemma.replace("-",""),'iso','slp1'),
	sd = Sanscript.t(lemma.replace("-",""),'iso','slp1'),
	devid = Sanscript.t(lemma.replace("-",""),'iso','devanagari'),
	id = Sanscript.t(lemma.replace("-",""),'iso','itrans');
    console.log(lemma);
    dictList.append('<li><a href="https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2014/web/webtc/getword.php?key='+id+'&filter=deva&transLit=itrans" target="_blank">Monier Williams (Cologne)</a>');
    //dictList.append('<li><a href="https://www.sanskrit-lexicon.uni-koeln.de/scans/AP90Scan/2020/web/webtc/getword.php?key='+apteslp+'&filter=deva&transLit=itrans" target="_blank">Apte (Cologne)</a>');
    dictList.append("<li><a href='http://dsalsrv02.uchicago.edu/cgi-bin/philologic/search3advanced?dbname=apte&query="+apte+"&searchdomain=headwords&matchtype=exact&display=utf8' target='blank'>Apte (DSAL)</a></li>");
    dictList.append('<li><a href="https://www.sanskrit-lexicon.uni-koeln.de/scans/VCPScan/2020/web/webtc/getword.php?key='+id+'&filter=deva&transLit=itrans" target="_blank">Vācaspatyam (Cologne)</a>');
    dictList.append('<li><a href="https://www.sanskrit-lexicon.uni-koeln.de/scans/SKDScan/2020/web/webtc/getword.php?key='+id+'&filter=deva&transLit=itrans" target="_blank">Śabdakalpadrumaḥ (Cologne)</a>');
    dictList.append("<li><a href='https://dsal.uchicago.edu/cgi-bin/app/macdonell_query.py?qs="+devid+"&searchhws=yes&matchtype=exact' target='_blank'>Macdonell (DSAL)</a></li>");
    dictList.append("<li><a href='http://sanskritdictionary.com/?iencoding=slp1&q="+sd+"&lang=sans&action=Search'>sanskritdictionary.com</a></li>");
    wrapper.append("<h6>Search this word in:</h6>");
    wrapper.append(dictList);
    return wrapper;

};

function morphology(word) {
    var wrapper = $("<div class='row morphology justify-content-center'></div>"),
	col = $("<div class='col-11'></div>"),
	header = $("<h5></h5>"),
	subheader = $("<h6></h6>"),
	subsubheader = $("<p></p>"),
	dl = $("<dl class='row'></div>"),
	vocabulary = { 
	    "class": [ "class", "jātiḥ" ],
	    "stem": [ "stem", "prātipadikam" ],
	    "basestem": [ "basic stem", "prātipadikam" ],
	    "root": [ "root", "dhātuḥ" ],
	    "gender": [ "gender", "liṅgam" ],
	    "number": [ "number", "saṁkhyā" ],
	    "case": [ "case", "vibhaktiḥ" ],
	    "noun": [ "noun", "nāma" ],
	    "particle": [ "particle", "avyayam" ],
	    "pron": [ "pronoun", "sarvanāma" ],
	    "numeral": [ "numeral", "saṁkhyā" ],
	    "adj": [ "adjective", "viśēṣaṇam" ],
	    "adv": [ "adverb", "kriyāviśēṣaṇam" ],
	    "adp": [ "adposition", "karmapravacanīyaḥ" ],
	    "indecl": [ "indeclinable", "avyayam" ],
	    "verb": [ "verb", "kriyā" ],
	    "person": [ "person", "puruṣaḥ" ],
	    "3rd": [ "third", "prathamaḥ" ],
	    "2nd": [ "second", "madhyamaḥ" ],
	    "1st": [ "first", "uttamaḥ" ],
	    "m": [ "masculine", "puṁliṅgam" ],
	    "f": [ "feminine", "strīliṅgam" ],
	    "n": [ "neuter", "napuṁsakaliṅgam" ],
	    "sg": [ "singular", "ēkavacanam" ],
	    "du": [ "dual", "dvivacanam" ],
	    "pl": [ "plural", "bahuvacanam" ],
	    "0": [ "all", "sarvāṇi"],
	    "1": [ "nominative", "prathamā" ],
	    "2": [ "accusative", "dvitīyā" ],
	    "3": [ "instrumental", "tr̥tīyā" ],
	    "4": [ "dative", "caturthī" ],
	    "5": [ "ablative", "pañcamī" ],
	    "6": [ "genitive", "ṣaṣṭhī" ],
	    "7": [ "locative", "saptamī" ],
	    "voc": [ "vocative", "saṁbuddhiḥ" ],
	    "l" : [ "tense-mood", "lakāraḥ" ],
	    "laṭ": [ "present indicative", "laṭ" ],
	    "lōṭ": [ "imperative", "lōṭ" ],
	    "liṅ": [ "optative", "liṅ" ],
	    "luṅ": [ "aorist", "luṅ" ],
	    "liṭ": [ "perfect", "liṭ" ],
	    "lr̥ṭ": [ "future", "lr̥ṭ" ],
	    "bhvadi": [ "1", "bhvādiḥ" ],
	    "adadi": [ "2", "adādiḥ" ],
	    "hvadi": [ "3", "hvādiḥ" ],
	    "divadi": [ "4", "divādiḥ" ],
	    "svadi": [ "5", "svādiḥ" ],
	    "tudadi": [ "6", "tudādiḥ" ],
	    "rudhadi": [ "7", "rudhādiḥ" ],
	    "tanadi": ["8","tanādiḥ"],
	    "kryadi": [ "9", "kryādiḥ" ],
	    "curadi": [ "10", "curādiḥ" ],
	    "none": ["n/a", "nāsti" ],
	    "atmane": [ "ātmanēpadam", "ātmanēpadam" ],
	    "parasmai": [ "parasmaipadam", "parasmaipadam"],
	    "ubhaya": [ "ubhayapadam", "ubhayapadam" ]
	};
    $.each(word.morphology, function(x,y) {
	/* use class, stem, root, and upasarga to construct header */
	if (x == 'class') {
	    header.append(vocabulary[y][0]+" <span class='translit gloss'>"+vocabulary[y][1]+"</span>");
	    if (y == 'adj' || y == 'pron' || y == 'noun') {
		if (jQuery.type(word.morphology.stem) == 'array') {
		    subheader.append("stems <span class='translit gloss'>prātipadikāni</span>: <span class='translit'>"+word.morphology.stem.join(", ")+"</span>");
		} else {
		    subheader.append("stem <span class='translit gloss'>prātipadikam</span>: <span class='translit'>"+word.morphology.stem+"</span>");
		}
	    } else if (y == 'verb') {
		subheader.append("root <span class='translit gloss'>"+vocabulary['root'][1]+"</span>: ");
		if (word.morphology.preverb) {
		    subheader.append(" <span class='translit'>"+word.morphology.preverb+"</span> + ");
		}
		subheader.append("√<span class='translit'>"+word.morphology.root+"</span>");
		if (word.morphology.gana || word.morphology.padam) {
		    if (word.morphology.gana) {
			subsubheader.append("class <span class='translit gloss'>gaṇaḥ</span>: "+vocabulary[word.morphology.gana][0]+" <span class='translit gloss'>"+vocabulary[word.morphology.gana][1]+"</span>");
		    }
		    if (word.morphology.padam) {
			subsubheader.append(" <span class='translit pada-marker'>"+vocabulary[word.morphology.padam][1]+"</span>");
		    }
		}
		if (word.morphology.causative) {
		    subsubheader.append("<br/>causative <span class='translit gloss'>ṆiC</span>");
		}
		if (word.morphology.passive) {
		    subsubheader.append("<br/>passive <span class='translit gloss'>YaK</span>");
		}
	    }
	} else if (x == 'stem' || x == 'root' || x == 'preverb' || x == 'gana' || x == 'padam' || x == 'causative' || x == 'passive') {
	/* use the rest in a definition list */
	} else {
	    dl.append("<dt class='col-sm-4'>"+vocabulary[x][0]+" <span class='translit gloss'>"+vocabulary[x][1]+"</span></dt>");
	    if (x == "stem" || x == "root" || x == "preverb" || x == "gana") {
	    } else {
		dl.append("<dd class='col-sm-8'>"+vocabulary[y][0]+" <span class='translit gloss'>"+vocabulary[y][1]+"</span></dd>");
	    }
	}
    });
    $("<div class='row'></div>").append(header).appendTo(col);
    $("<div class='row'></div>").append(subheader).appendTo(col);
    if (word.morphology.padam || word.morphology.gana) {
	$("<div class='row'></div>").append(subsubheader).appendTo(col);
    }
    col.append(dl);
    wrapper.append(col);
    return wrapper;
};

function compound(m) {
    var wrapper = $("<div class='row compound justify-content-center'></div>"),
	col = $("<div class='col-11'></div>"),
    content = compoundIterator(m);
    col.append(content);
    wrapper.append(col);
    return wrapper;
};
function compoundIterator(m) {
    var wrapper = $("<span class='bracket'></span>"),
	vocabulary = { 
	    "t2": "dvitīyātatpuruṣaḥ",
	    "t3": "tr̥tīyātatpuruṣaḥ",
	    "t4": "caturthītatpuruṣaḥ",
	    "t5": "pañcamītatpuruṣaḥ",
	    "t6": "ṣaṣṭhītatpuruṣaḥ",
	    "t7": "saptamītatpuruṣaḥ",
	    "dv": "dvandvaḥ",
	    "k": "karmadhārayaḥ",
	    "bv": "bahuvrīhiḥ",
	    "up": "upapadatatpuruṣaḥ",
	    "nt": "nañtatpuruṣaḥ",
	    "nb": "nañbahuvrīhiḥ"
	},
	punct = " + ";
    /* special treatment for bahuvrīhi */
    if (m.type == "bv") {
	var subwrapper = $("<span class='bracket'></span>");
	wrapper = $("<span></span>");
	punct = " = ";
	if (m.dep.head) {
	    subwrapper.append(compoundIterator(m.dep));
	} else {
	    subwrapper.append("<span class='translit comp-dep'>"+m.dep+"</span>");
	}
	subwrapper.append(punct+"<span class='translit comp-head'>"+m.head+"</span>");
	wrapper.append(subwrapper);
	wrapper.append("<span class='translit comp-type'>"+vocabulary[m.type]+"</span>");
    } else {
	if (m.type == "k") {
	    punct = " = ";
	}
	if (m.dep.head) {
	    wrapper.append(compoundIterator(m.dep));
	} else {
	    wrapper.append("<span class='translit comp-dep'>"+m.dep+"</span>");
	}
	wrapper.append(punct+"<span class='translit comp-head'>"+m.head+"</span>");
	wrapper.append("<span class='translit comp-type'>"+vocabulary[m.type]+"</span>");
    }
    return wrapper;
}

function prakriya(verbform) {
    var wrapper = $("<div class='row morphology justify-content-center'></div>"),
	col = $("<div class='col-12'></div>"),
	slp1 = Sanscript.t(verbform,'iso','slp1'),
	dhaval = $("<p><small>This derivation comes from Dhaval Patel’s <a href='https://github.com/drdhaval2785/prakriya'>Prakriyā</a> web service.</p>");
	url = "https://api.sanskritworld.in/v0.0.2/verbforms/slp1/"+slp1+"?output_transliteration=slp1";
    col.append(dhaval);
    $.getJSON(url,function(n) {
	if (n[0].prakriya.length) {
	    var prakriya = n[0].prakriya,
		table = $("<table class='table table-striped'></table>"),
		thead = $("<thead><tr><th><span class='translit'>sūtram</span></th><th><span class='translit'>rūpam</span></th></tr></thead>"),
		tbody = $("<tbody></tbody>");
	    $.each(prakriya, function(x,y) {
		var row = $("<tr></tr>"),
		    form = $("<td><small><span class='translit'>"+Sanscript.t(y.form,'slp1','iso')+"</span></small></td>"),
		    sutranum = y.sutra_num.split("."),
		    slink = "(<a href='http://sanskritdictionary.com/panini/"+sutranum[0]+"-"+sutranum[1]+"-"+sutranum[2]+"' target='_blank'>"+y.sutra_num+"</a>)",
		    sutra = $("<td><small><span class='translit'>"+Sanscript.t(y.sutra,'slp1','iso')+"</span> "+slink+"</small></td>");
		row.append(sutra).append(form);
		tbody.append(row);
	    });
	    table.append(thead).append(tbody);
	    col.append(table);
	}
	else { 
	    col.append("<p>An error occurred. The requested verb may not be in the database.</p>");
	}
    }).fail(function() {
	col.append("<p>An error occurred. The requested verb may not be in the database.</p>");
    });
    wrapper.append(col);
    return wrapper;
}

function addMetricalData() {
    $(".meter").each(function() {
	var m = $(this).text(),
	    val, htmlArray;
	if (m != 'prose') {
	    if (m in metDict) {
		val = metDict[m],
		htmlArray = ['anustubh', 'arya'];		
		if (htmlArray.includes(val)) {
		    val += ".html";
		};
		$(this).wrap("<a href='/vrddhi/meter/"+val+"'></a>");
	    }
	}
    });
}

function addDiagram(diagram) {
    var row = $("<div class='row'></div>"),
	col = $("<div class='col col-11 text-center'></div>"),
	card = $("<div class='card my-2'></div>"),
	cardHeader = $("<div class='card-header text-left'>Syntax diagram</div>"),
	cardBody = $("<div class='card-body'></div>"),
	img = $("<iframe src='"+diagram+"' alt='Syntax diagram' width='100%' scrolling='no' frameborder='0'></iframe>");
    cardBody.append(img);
    card.append(cardHeader);
    card.append(cardBody);
    col.append(card);
    row.append(col);
    $(".container").append(row);
}

function addTranslations(translation) {
    $.each(translation, function(x,y) {
	var row = $("<div class='row'></div>"),
	    col = $("<div class='col col-11 text-center'></div>"),
	    card = $("<div class='card my-2'></div>"),
	    cardHeader = $("<div class='card-header text-left'>Translation ("+y.language+")</div>"),
	    cardBody = $("<div class='card-body text-left'></div>");
	cardBody.append(y.text);
	card.append(cardHeader);
	card.append(cardBody);
	col.append(card);
	row.append(col);
	$(".container").append(row);
    });
}

function generateMeterModal(meter,glossary) {
    /* first get the information from the json object */
    var name = meter.metadata.name;
    /* then store all of the html elements */
    var modal = $("<div class='modal fade' id='modal-meter' tabindex='-1' role='dialog' aria-labelledby='modal-label-meter'></div>"),
	modalDialog = $("<div class='modal-dialog modal-lg' role='document'></div>"),
	modalContent = $("<div class='modal-content'></div>"),
	modalBody = $("<div class='modal-body'></div>"),
	modalHeader = $("<div class='modal-header'></div>");
    /* now construct the modal */
    modalHeader.append("<h5 class='modal-title translit' id='modal-label-meter'>"+name+"</h5>");
    var mb = generateMeterModalBody(meter,glossary);
    modalBody.append(mb);
    modalContent.append(modalHeader)
	.append(modalBody);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    $("body").append(modal);
}

function generateMeterModalBody(meter,glossary) {
    var wrapper = $("<div class='row justify-content-center'></div>"),
	col = $("<div class='col-11'></div>");
    if (meter.metadata.category || meter.metadata.subcategory || meter.metadata.trikas || meter.matadata.pattern) {
	col.append("<h5>Metadata</h5>");
	if (meter.metadata.category) {
	    row = buildRow(meter.metadata.category,glossary,'category:');
	    col.append(row);
	}
	if (meter.metadata.subcategory) {
	    row = buildRow(meter.metadata.subcategory,glossary,'subcategory:');
	    col.append(row);
	}
	if (meter.metadata.group) {
	    row = buildRow(meter.metadata.group,glossary,"class:");
	    col.append(row);
	}
	if (meter.metadata.trikas || meter.metadata.pattern) {
	    row = $("<div class='row'></row>");
	    row.append("<div class='col-sm-3'><b>pattern:</b></div>");
	    if (meter.metadata.trikas) {
		thisCol = $("<div class='col'><span class='trika-pattern translit'>"+meter.metadata.trikas+"</span> <i class='fas fa-question-circle fa-xs'></i></div>")
		row.append(thisCol);
	    }
	    if (meter.metadata.pattern) {
		col.append(row);
		if (meter.metadata.trikas) {
		    $("<div class='row'><div class='col-sm-3'></div><div class='col'><span class='meter-pattern'>"+meter.metadata.pattern+"</span> <i class='fas fa-question-circle fa-xs'></i></div></div>").appendTo(col);
		} else {
		    $("<div class='col'><span class='meter-pattern'>"+meter.metadata.pattern+"</span> <i class='fas fa-question-circle fa-xs'></i></div>").appendTo(row);
		    col.append(row);
		}
	    }
	}
    }
    if (meter.definitions) {
	col.append("<h5>Definitions</h5>");
	var vocabulary = {
	    "pingala" : "Piṅgala, <i>Chandaḥsūtram</i>",
	    "natyasastra" : "<i>Nāṭyaśāstram</i>",
	    "ratnamanjusa" : "<i>Ratnamañjūṣā</i>",
	    "janasrayi": "<i>Jānāśrayī</i>",
	    "jayadeva": "Jayadeva, <i>Chandaḥśāstram</i>",
	    "ratnakarasanti":"Ratnākaraśānti, <i>Chandōratnākaraḥ</i>",
	    "jayakirti":"Jayakīrti, <i>Chandōnuśāsanam</i>",
	    "kedarabhatta":"Kedārabhaṭṭa, <i>Vr̥ttaratnākaraḥ</i>",
	    "hemacandra":"Hemacandra, <i>Chandōnuśāsanam</i>"
	},
	    thisRow = $("<div class='row justify-content-center'></div>"),
	    thisCol = $("<div class='col-12'></div>");
	$.each(meter.definitions, function(x,y) {
	    var title = vocabulary[y.text];
	    thisCol.append("<h6>"+title+" "+y.passage+"</h6>");
	    thisCol.append("<p><span class='translit'>"+y.def+"</span></p>");
	});
	thisRow.append(thisCol);
	col.append(thisRow);
    }
    wrapper.append(col);
    return wrapper;
};

function metGlossTerm(term,gloss) {
  return $("<a href='javascript:void(0)' class='translit' data-toggle='popover' data-trigger='focus' data-placement='top' data-html='true' data-content='"+gloss+"'>"+term+"</a></dt>");
};

function buildRow(data,glossary,label) {
    var link = metGlossTerm(data,glossary[data]),
	thisRow = $("<div class='row'></div>");
    thisColL = $("<div class='col-sm-3'></div>").append("<b>"+label+"</b>");
    thisColR = $("<div class='col'></div>").append(link);
    thisRow.append(thisColL).append(thisColR);
    return thisRow;
};


function getObjectLength(o) {
    var length = 0;
    for (var i in o) {
	if (Object.prototype.hasOwnProperty.call(o,i)) {
	    length++;
	}
    }
    return length;
}
