var xml = "malatimadhava.xml";
var xslt = "common-test.xsl";

function initialize(script,version) {
  $(".panel-group").remove();
  setVersion();
  setScript();
  outline();
  if (sessionStorage.scrollTop != "undefined") {
    $(window).scrollTop(sessionStorage.scrollTop);
  }
}

function setVersion() {
  var ver = localStorage.getItem("version");
  if (ver == null) {
    $("#versionselector").val("orig.xsl");
    localStorage.setItem("version","orig.xsl");  
  } else {
    $("#versionselector").val(ver);
  }
  $("#versionselector").on("change",function() {
    localStorage.setItem("version",this.value);
    location.reload();
  });
}

function setScript() {
  var val = localStorage.getItem("script");
  if (val == "Deva") {
    $("input[name='script'][value='Deva']").prop("checked",true);
    $("input[name='script'][value='Deva']").parent().addClass("active");
  } else if (val == "Guru") {
    $("input[name='script'][value='Guru']").prop("checked",true);
    $("input[name='script'][value='Guru']").parent().addClass("active");
  } else if (val == "Gujr") {
    $("input[name='script'][value='Gujr']").prop("checked",true);
    $("input[name='script'][value='Gujr']").parent().addClass("active");
  } else if (val == "Kann") {
    $("input[name='script'][value='Kann']").prop("checked",true);
    $("input[name='script'][value='Kann']").parent().addClass("active");
  } else if (val == "Mala") {
    $("input[name='script'][value='Mala']").prop("checked",true);
    $("input[name='script'][value='Mala']").parent().addClass("active");
  } else {
    $("input[name='script'][value='Latn']").prop("checked",true);
    $("input[name='script'][value='Latn']").parent().addClass("active");
  }
  $("input[name='script']").on("change",function() {
    localStorage.setItem("script",this.value);
    location.reload();
  });
};

function outline() {
  var ver = localStorage.getItem("version");
  $.when($.get(xml),$.get(ver),$.get(xslt)).done(function(x,y,z) {
    xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(y[0]);
    var textVersion = xsltProcessor.transformToDocument(x[0]),
	content = transformSanskrit(textVersion,z[0]);
    console.log(textVersion);
    console.log(content);
    $("#root").append(content);
    activateModals();
    activateChaya();
    translit();
  });
}

function activateModals() {
  $(".modal-close").on('click',function(e){
    $(this).closest('.modal').modal('toggle');
  });
  $(".chaya-toggle").on('click',function(e){
    e.stopPropagation();
  });
  $(".app-note, .app-lem").popover({
    html: true,
    content: function() {
      idtarget = $(this).attr("data-target");
      return $(idtarget).html();
    }
  });
  $(".met-btn").popover({
    html:true,
    template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title" style="display:none;"></h3><div class="popover-content"><p></p></div></div></div>'

  });
  $(".app-note, .app-lem").on('click', function(e) {
      e.preventDefault(); return true;
  });
}

function activateChaya() {
  $("#root").find(".prakrit").each(function() {
    toggle = $(this).find(".chaya-toggle");
    toggle.css('cursor','pointer');
    toggle.on('click',function() {
      $(this).parent().find('.sanskritword').toggle('fast');
    });
  });
}

function translit() {
  var script = localStorage.getItem("script");
  if (script == "Deva") {
    $("#root, #modals").find(".san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        q = $(this).text();
	r = preprocess(q);
        y = Sanscript.t(r,'iast','devanagari').replace(/\s+([।॥])/g,'\u00a0$1');
        z = $('<span class="transliterated Deva"></span>').append(y)
        $(this).replaceWith(z);
      });
    });
  } else if (script == "Guru") {
    $("#root, #modals").find(".san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        q = $(this).text();
	r = preprocess(q);
        y = Sanscript.t(r,'iast','gurmukhi').replace(/\s+([।॥])/g,'\u00a0$1');
        z = $('<span class="transliterated Deva"></span>').append(y)
        $(this).replaceWith(z);
      });
    });
  } else if (script == "Gujr") {
    $("#root, #modals").find(".san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        q = $(this).text();
	r = preprocess(q);
        y = Sanscript.t(r,'iast','gujarati').replace(/\s+([।॥])/g,'\u00a0$1');
        z = $('<span class="transliterated Deva"></span>').append(y)
        $(this).replaceWith(z);
      });
    });
  } else if (script == "Kann") {
    $("#root, #modals").find(".san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        q = $(this).text();
	r = preprocess(q);
        y = Sanscript.t(r,'iast','kannada').replace(/\s+([।॥])/g,'\u00a0$1');
        z = $('<span class="transliterated Deva"></span>').append(y)
        $(this).replaceWith(z);
      });
    });
  } else if (script == "Mala") {
    $("#root, #modals").find(".san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        q = $(this).text();
	r = preprocess(q);
        y = Sanscript.t(r,'iast','malayalam').replace(/\s+([।॥])/g,'\u00a0$1');
        z = $('<span class="transliterated Deva"></span>').append(y)
        $(this).replaceWith(z);
      });
    });
  } else {
    $("#root, #modals").find(".san").not('.l').each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        var q = $(this).text(),
            r = q.replace(/\s+\u007c\u007c/g,'. ~')
	         .replace(/\s+\u007c/g,'.');
        $(this).replaceWith(r);
      });
    });
    $("#root, #modals").find(".l.san").each(function() {
      $(this).contents().filter(function() {
        return this.nodeType == 3;
      }).each(function() {
        var q = $(this).text(),
            r = q.replace(/\u007c\u007c/g,'~')
	         .replace(/\u007c/g,'~');
        $(this).replaceWith(r);
      });
    });
  }
}

// Preprocess strings from IAST to Devanāgarī. 
function preprocess(x) {
  var script = localStorage.getItem("script");
  var trans = x.replace(" ’","'")
    .replace(/aï/g,"a####i")
    .replace(/aü/g,"a####u")
    .replace(/([rnmd]) ([gṅjñḍṇdnbmhyvrlaāiīuūeo])/g,"$1$2")
    .replace(/([kcṭtpśsṣ]) ([kcṭtpśsṣ])/g,"$1$2")
    .replace(/([vy]) ([aāiīuūeo])/g,"$1$2")
    .replace(/ḷ([aāiīuūṛṝ])/g,"ḻ$1");
  if (script == "Deva") {
    trans = trans.replace(/ṁ/g,"ँ");
  } else if (script == "Guru") {
    trans = trans.replace(/ṁ/g,"ਁ");
  } else if (script == "Gujr") {
    trans = trans.replace(/ṁ/g,"ઁ");
  }
  return trans;
}

function transformSanskrit(node,xsl) {
  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  return xsltProcessor.transformToFragment(node,document);
}

$(window).scroll(function() {
  sessionStorage.scrollTop = $(this).scrollTop();
});
