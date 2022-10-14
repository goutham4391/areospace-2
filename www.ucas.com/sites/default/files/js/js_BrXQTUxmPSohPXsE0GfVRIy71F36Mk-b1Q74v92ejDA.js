(function ($) {
  'use strict';

  /**
   * To make a form auto submit, all you have to do is 3 things:
   *
   * ctools_add_js('auto-submit');
   *
   * On gadgets you want to auto-submit when changed, add the ctools-auto-submit
   * class. With FAPI, add:
   * @code
   *  '#attributes' => array('class' => array('ctools-auto-submit')),
   * @endcode
   *
   * If you want to have auto-submit for every form element,
   * add the ctools-auto-submit-full-form to the form. With FAPI, add:
   * @code
   *   '#attributes' => array('class' => array('ctools-auto-submit-full-form')),
   * @endcode
   *
   * If you want to exclude a field from the ctool-auto-submit-full-form auto submission,
   * add the class ctools-auto-submit-exclude to the form element. With FAPI, add:
   * @code
   *   '#attributes' => array('class' => array('ctools-auto-submit-exclude')),
   * @endcode
   *
   * Finally, you have to identify which button you want clicked for autosubmit.
   * The behavior of this button will be honored if it's ajaxy or not:
   * @code
   *  '#attributes' => array('class' => array('ctools-use-ajax', 'ctools-auto-submit-click')),
   * @endcode
   *
   * Currently only 'select', 'radio', 'checkbox' and 'textfield' types are supported. We probably
   * could use additional support for HTML5 input types.
   */
  Drupal.behaviors.CToolsAutoSubmit = {
    attach: function (context) {
      // 'this' references the form element
      function triggerSubmit(e) {
        var $this = $(this);
        if (!$this.hasClass('ctools-ajaxing')) {
          $this.find('.ctools-auto-submit-click').click();
        }
      }

      // the change event bubbles so we only need to bind it to the outer form
      $('form.ctools-auto-submit-full-form', context)
        .add('.ctools-auto-submit', context)
        .filter('form, select, input:not(:text, :submit)')
        .once('ctools-auto-submit')
        .change(function (e) {
          // don't trigger on text change for full-form
          if ($(e.target).is(':not(:text, :submit, .ctools-auto-submit-exclude)')) {
            triggerSubmit.call(e.target.form);
          }
        })
        .keydown(function (e) {
          // Remove the default enter to submit behavior.
          var code = e.keyCode || e.which;
          if (code === 13) {
            e.preventDefault();
            return false;
          }
        });

      // e.keyCode: key
      var discardKeyCode = [
        16, // shift
        17, // ctrl
        18, // alt
        20, // caps lock
        33, // page up
        34, // page down
        35, // end
        36, // home
        37, // left arrow
        38, // up arrow
        39, // right arrow
        40, // down arrow
        9,  // tab
        13, // enter
        27  // esc
      ];
      // Don't wait for change event on textfields
      $('.ctools-auto-submit-full-form input:text, input:text.ctools-auto-submit', context)
        .filter(':not(.ctools-auto-submit-exclude)')
        .once('ctools-auto-submit', function () {
          // each textinput element has his own timeout
          var timeoutID = 0;
          $(this)
            .bind('keydown keyup', function (e) {
              if ($.inArray(e.keyCode, discardKeyCode) === -1) {
                // eslint-disable-next-line
                timeoutID && clearTimeout(timeoutID);
              }
              if (e.keyCode === 13) {
                // eslint-disable-next-line
                timeoutID && clearTimeout(timeoutID);
                triggerSubmit.call(this.form);
              }
            })
            .keyup(function (e) {
              if ($.inArray(e.keyCode, discardKeyCode) === -1) {
                timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 2500);
              }
            })
            .bind('change', function (e) {
              if ($.inArray(e.keyCode, discardKeyCode) === -1) {
                timeoutID = setTimeout($.proxy(triggerSubmit, this.form), 2500);
              }
            });
        });
    }
  };
})(jQuery);
;
(function(){
  function sortDrupalBehaviors() {
    var weights = {};
    for (var k in Drupal.behaviors) {
      var v = Drupal.behaviors[k];
      var pieces = k.split('.');
      if (pieces.length == 2 && pieces[1] === 'weight') {
        // This v is not a behavior, but a weight setting for another behavior.
        weights[pieces[0]] = v;
        delete Drupal.behaviors[k];
      }
      else if (typeof weights[k] != 'number') {
        // This v is a behavior object, but it might contain a weight setting.
        if (typeof v == 'object' && v && typeof v.weight == 'number') {
          weights[k] = v.weight;
        }
        else if (weights[k] == undefined) {
          weights[k] = false;
        }
      }
    }

    var ww = [0];
    var by_weight = {0: {}};
    for (var k in weights) {
      if (Drupal.behaviors[k] == undefined) {
        continue;
      }
      var w = weights[k];
      w = (typeof w == 'number') ? w : 0;
      if (by_weight[w] == undefined) {
        by_weight[w] = {};
        ww.push(w);
      }
      by_weight[w][k] = Drupal.behaviors[k];
    }
    ww.sort(function(a,b){return a - b;});

    // Other scripts that want to mess with behaviors, will only see those with weight = 0.
    Drupal.behaviors = by_weight[0];

    var sorted = [];
    for (var i = 0; i < ww.length; ++i) {
      var w = ww[i];
      sorted.push(by_weight[w]);
    }
    return sorted;
  }

  var attachBehaviors_original = Drupal.attachBehaviors;

  Drupal.attachBehaviors = function(context, settings) {
    var sorted = sortDrupalBehaviors();
    Drupal.attachBehaviors = function(context, settings) {
      context = context || document;
      settings = settings || Drupal.settings;
      // Execute all of them.
      for (var i = 0; i < sorted.length; ++i) {
        jQuery.each(sorted[i], function() {
          if (typeof this.attach == 'function') {
            this.attach(context, settings);
          }
        });
      }
    }
    Drupal.attachBehaviors.apply(this, [context, settings]);
  };

})();

;
var UCASDesignFramework=UCASDesignFramework||{};!function(a){"use strict";var t;a.fn.ucasAjaxTabsAfterBuild=function(){UCASDesignFramework.bricks.init(this),UCASDesignFramework.accordion.init(document),a(".brightcove-video-container").length&&(Drupal.settings.videoAuthorised=!1,a(".brightcove-video-container").removeClass("authorised")),a(".exhibitor-listing").length||a(".page-provider").length||Drupal.attachBehaviors()},Drupal.ajaxTabs=Drupal.ajaxTabs||{},Drupal.behaviors.ajaxTabs={attach:function(e){a(".tabs:not(.tabs-container--vertical-tabs-variant):not(.page-provider-manage-reports .tabs) .tabs__tab-container--secondary, .header-navigation--use-ajax-tabs .header-navigation__list").once("ajaxTabs",(function(){Drupal.behaviors.ajaxTabs.tabs=a(".tabs__tab-container--secondary, .header-navigation__list",e),Drupal.behaviors.ajaxTabs.subTitle=a(".tabs > h3",e),Drupal.behaviors.ajaxTabs.tabs.find("li a").each((function(){new Drupal.ajax('li.tabs__tab > a[href="'+a(this).attr("href")+'"], li.header-navigation__list-item > a[href="'+a(this).attr("href")+'"]',a(this),{url:a(this).attr("href")+"?ajaxTabs=1",selector:'a[href="'+a(this).attr("href")+'"]',event:"click tap ucas.history"})}));var i=Drupal.behaviors.ajaxTabs.tabs.find("li.tabs__tab--active > a, li.header-navigation__list-item > a.active");history.pushState({href:i.attr("href")},a("#page-title").text()+" | "+i.text()+" | UCAS",i.attr("href")),window.addEventListener("popstate",(function(e){(null!==e.state&&e.state.href!==t||history.go(-1),e.state&&e.state.href!==t)&&a('li.tabs__tab > a[href="'+e.state.href+'"], li.header-navigation__list-item > a[href="'+e.state.href+'"]').trigger("ucas.history");null!==e.state&&(t=history.state.href)}))}))},toggleActiveTab:function(t){if((t=a(t)).hasClass("tabs__tab")||t.hasClass("header-navigation__list-item")){a("#section--content").find(".region--content").css("opacity",".1");var e=Drupal.behaviors.ajaxTabs.subTitle,i=t.find("a").text().replace("(active tab)","");e.text(i),t.hasClass("header-navigation__list-item")?(t.siblings("li").find("a").removeClass("active"),t.find("a").addClass("active")):(t.siblings("li").removeClass("tabs__tab--active"),t.addClass("tabs__tab--active"))}}},Drupal.ajaxTabs.beforeSend=Drupal.ajax.prototype.beforeSend,Drupal.ajax.prototype.beforeSend=function(t,e){var i=a(this.element).parent(),r=a(this.element),s=e.hasOwnProperty("originalEvent")&&"history"===e.originalEvent.namespace;(!s&&i.hasClass("tabs__tab")||!s&&i.hasClass("header-navigation__list-item"))&&history.pushState({href:r.attr("href")},a("#page-title").text()+" | "+r.text()+" | UCAS",r.attr("href")),Drupal.behaviors.ajaxTabs.toggleActiveTab(i),Drupal.ajaxTabs.beforeSend.call(this,t,e)},Drupal.ajax.prototype.eventResponse=function(t,e){var i=this;if(i.ajaxing)return!1;i.options.originalEvent=e;try{i.form?(i.setClick&&(t.form.clk=t),i.form.ajaxSubmit(i.options)):(i.beforeSerialize(i.element,i.options),a.ajax(i.options))}catch(a){i.ajaxing=!1,alert("An error occurred while attempting to process "+i.options.url+": "+a.message)}return void 0!==t.type&&("checkbox"===t.type||"radio"===t.type)}}(jQuery);;
!function(t){Drupal.progressBar=function(r,e,s,i){this.id=r,this.method=s||"GET",this.updateCallback=e,this.errorCallback=i,this.element=t('<div class="progress" aria-live="polite"></div>').attr("id",r),this.element.html('<div class="bar"><div class="filled"></div></div><div class="percentage"></div><div class="message">&nbsp;</div>')},Drupal.progressBar.prototype.setProgress=function(r,e){r>=0&&r<=100&&(t("div.filled",this.element).css("width",r+"%"),t("div.percentage",this.element).html(r+"%")),t("div.message",this.element).html(e),this.updateCallback&&this.updateCallback(r,e,this)},Drupal.progressBar.prototype.startMonitoring=function(t,r){this.delay=r,this.uri=t,this.sendPing()},Drupal.progressBar.prototype.stopMonitoring=function(){clearTimeout(this.timer),this.uri=null},Drupal.progressBar.prototype.sendPing=function(){if(this.timer&&clearTimeout(this.timer),this.uri){var r=this;t.ajax({type:this.method,url:this.uri,data:"",dataType:"json",success:function(t){0!=t.status?(r.setProgress(t.percentage,t.message),r.timer=setTimeout((function(){r.sendPing()}),r.delay)):r.displayError(t.data)},error:function(t){r.displayError(Drupal.ajaxError(t,r.uri))}})}},Drupal.progressBar.prototype.displayError=function(r){var e=t('<div class="messages error"></div>').html(r);t(this.element).before(e).hide(),this.errorCallback&&this.errorCallback(this)}}(jQuery);;
!function(a){"use strict";Drupal.behaviors.hideSubmitButton={attach:function(t){a("form.ucas_media_share_your_story_form",t).once("hideSubmitButton",(function(){var t=a(this);t.find("input.form-submit").click((function(t){var e=a(this);return e.after('<input type="hidden" name="'+e.attr("name")+'" value="'+e.attr("value")+'" />'),!0})),t.submit((function(t){if(!t.isPropagationStopped())return a("input.form-submit",a(this)).attr("disabled","disabled"),a(this).addClass("live-region"),a(this).attr("aria-busy","true"),a(this).attr("aria-live","polite"),!0}))}))}},Drupal.behaviors.ucas_media_video={attach:function(t,e){a(window).on("statechange",(function(a){ucasGigya.getUserInfo(!1).then((function(a){var o=Drupal.urlParam("rl"),i=!a.UID;if(1==o&&i)e.protectedEntity="video",Drupal.behaviors.ucas_media_video.loginModal(t,e);else{var n=Drupal.urlParam("v");e.videoAuthorised=!0,Drupal.behaviors.ucas_media_video.activatePopup(n,e)}}))})),a(window).trigger("statechange");var o=a("[data-video-popup]",t);o.length<1||o.each((function(){a(this).click((function(t){t.preventDefault();var e=a(this).data("video-popup").replace("/connect/videos",""),o=a(this).data("require-login");Drupal.updateQueryString("v",e),o?Drupal.updateQueryString("rl",1):Drupal.updateQueryString("rl",0)}))}))},urlParam:function(a){var t=new RegExp("[?&]"+a+"=([^&#]*)").exec(window.location.href);return null==t?null:decodeURI(t[1])||0},loginModal:function(t,e){var o=Drupal.behaviors.ucas_media_video.urlParam("keywords"),i="",n=e.protectedEntity;o&&(i="?keywords="+o);var l='<div id="LoginPromptModal" data-modal-state="hidden" class="modal-container modal-container--scroll"><div tabindex="-1" role="dialog" aria-labelledby="modal-label" class="modal modal--small"><div class="modal__image modal__image--login"></div><div class="modal__content modal__content--login"><h2 class="h4" id="modal-label">Sign in <span class="heading-alternative">to view '+n+'s</span></h2><div class="grid grid--center"><div class="grid__item">To view this '+n+' you will need to sign in. If you don\'t have an account, please register to use all the features available.</div></div></div><footer class="modal__footer"><div class="buttons"><div class="buttons__group"><a class="button button--primary" href="/account?m=login&returnUrl='+window.location.pathname+i+'" role="button">Sign in</a><a class="button button--secondary" href="#" data-modal-close role="button">Cancel</a></div></div><p><small>Don\'t have an account yet? <a href="/account?m=register&returnUrl='+window.location.pathname+i+'">Sign up</a></small></p></footer></div></div>';0===a("#LoginPromptModal").length&&(a("body").append(l),a("body").hasClass("v5")||(a("body").addClass("v5-modal"),UCASDesignFramework.v5Modal.init())),UCASDesignFramework.modal.showModal("LoginPromptModal")},activatePopup:function(t,e){var o=e.videoAuthorised;t&&a.magnificPopup.open({items:{src:"/connect/videos"+t},type:"ajax",preloader:!1,closeOnContentClick:!1,closeOnBgClick:!1,enableEscapeKey:!1,showCloseBtn:!1,removalDelay:700,mainClass:"mfp-slide",fixedContentPos:!0,tClose:"Back",closeMarkup:'<button class="mfp-close button button--inline button--close icon--chevron-left-white icon-inline--left">Back</button>',callbacks:{parseAjax:function(t){var o=a(t.data).text(),i=new RegExp("Drupal.settings, {(.*)}","gm").exec(o);null!==i&&(e=JSON.parse("{"+i[1]+"}"),Drupal.behaviors.radioactivity.attach(t.data,e)),t.data=a(t.data).find(".brick--main"),Drupal.behaviors.flagLink.attach(a(t.data))},ajaxContentAdded:function(){Drupal.behaviors.media_buto_akita.attach(a(document),e),e.videoAuthorised=o,Drupal.behaviors.ucas_media_brightcove.attach(a(document),e)},beforeClose:function(){a("html").css({overflow:"auto"}),Drupal.updateQueryString("v",null),Drupal.updateQueryString("rl",null)}}})}}}(jQuery);;
var ucasGigya=ucasGigya||{},UCASDesignFramework=UCASDesignFramework||{};!function(t){"use strict";Drupal.behaviors.ucas_media_brightcove={scriptsLoaded:{},players:[],attach:function(e,a){var i=this,r=a;t(".brightcove-video-container",e).each((function(){var s=t(this).find("video"),o=s.attr("data-player"),d=s.attr("data-autoplay"),n=s.attr("id"),c=document.getElementById(n);i.players.push(c),i.scriptsLoaded.hasOwnProperty(o)||(i.scriptsLoaded[o]=!1),d?!1===i.scriptsLoaded[o]?(i.scriptsLoaded[o]=!0,t.getScript("//players.brightcove.net/4824244714001/"+o+"_default/index.min.js").done((function(){})).fail((function(e){i.scriptsLoaded[o]=!1,t(".brightcove-video-container").text(e.status+" error getting external video javascript libraries.")}))):(bc(c),videojs.getPlayer(n).ready((function(){this.play()}))):t(this).on("click",(function(){var s=t(this),o=s.find("video"),d=o.attr("data-player");ucasGigya.getUserInfo(!1).then((function(n){var c=o.attr("data-require-login"),u=o.attr("id");c&&!n.UID?(a.protectedEntity="video",Drupal.behaviors.ucas_media_video.loginModal(e,a)):(r.videoAuthorised&&s.addClass("authorised"),!1===i.scriptsLoaded[d]||t(".ajaxTabs-processed").length>0?(i.scriptsLoaded[d]=!0,t.getScript("//players.brightcove.net/4824244714001/"+d+"_default/index.min.js").done((function(){videojs.getPlayer(u).ready((function(){this.play()}))})).fail((function(e){i.scriptsLoaded[d]=!1,t(".brightcove-video-container").text(e.status+" error getting external video javascript libraries.")}))):videojs.getPlayer(u).ready((function(){this.play()})),s.off("click"))}))})),r.videoAuthorised&&t(this).addClass("authorised")}))}}}(jQuery);;
(function ($) {
Drupal.behaviors.radioactivity = {

  config: '',
  attached: false,
  activeIncidents: [],

  attach: function (context, settings) {

    // Skip if radioactivity is not set
    if (typeof settings.radioactivity == 'undefined') {
      return;
    }

    var config = settings.radioactivity.config;
    var emitters = settings.radioactivity.emitters;
    
    // Clear used emitters
    settings.radioactivity.emitters = []; 

    this.config = config;

    $.each(emitters, function(callback, incidents) {

      // Accuracy and  flood filtering
      $.each(incidents, function(index, incident) {

        var config = Drupal.behaviors.radioactivity.config;
        var key = 'radioactivity_' + incident['checksum'];

        // Flood protection (cookie based)
        if (config.fpEnabled) {  
          if (Drupal.behaviors.radioactivity.fetch(key)) {
            // Filter
            return;
          } else {
            var exp = new Date();
            exp.setTime(exp.getTime() + (config.fpTimeout * 60 * 1000));
            Drupal.behaviors.radioactivity.store(key, true, exp);
          }
        } else {
          // clear the possible cookie
          Drupal.behaviors.radioactivity.store(key, null, new Date());
          //$.cookie(key, null);
        }

        // Accuracy filtering
        var rnd = Math.random() * 100;
        if (rnd >= incident.accuracy) {
          return;
        }

        Drupal.behaviors.radioactivity.activeIncidents.push(incident);
      });

      // Call the emitter callback
      if (Drupal.behaviors.radioactivity.activeIncidents.length > 0) {
        Drupal.behaviors.radioactivity[callback](Drupal.behaviors.radioactivity.activeIncidents);
        // Clear incidents
        Drupal.behaviors.radioactivity.activeIncidents = [];
      }
    });
  },

  hardStore: function (key, value, exp) {
    try {
      if (typeof(Storage) !== "undefined") {
        localStorage.setItem(key, JSON.stringify({
          value: value,
          expire: exp.getTime()
        }));
        sessionStorage.setItem(key, JSON.stringify({
          value: value,
          expire: exp.getTime()
        }));      
      }
    } catch(e){
      $.cookie(key, value, { expires: exp });
    }
    $.cookie(key, value, { expires: exp });
  },

  hardFetch: function (key) {
    var data = null;
    if (typeof(Storage) !== "undefined") {
      try{
        data = localStorage.getItem(key)
        if (!data) {
          data = sessionStorage.getItem(key);
        }
      } catch(e){
        
      }
    }
    if (!data) {
      data = $.cookie(key);
    }
    return data;
  },

  store: function (key, value, exp) {
    //return this.hardStore(key, value, exp);
    if (typeof(Storage) !== "undefined") {
      // Fall back to using cookies if this fails
      try {
        localStorage.setItem(key, JSON.stringify({
          value: value,
          expire: exp.getTime()
        }));
      } catch(e) {
        $.cookie(key, value, { expires: exp });
      }
    } else {
      $.cookie(key, value, { expires: exp });
    }
  },

  fetch: function (key) {
    var now = new Date();
    if (typeof(Storage) !== "undefined") {
      // Fall back to using cookies if this fails
      try {
        var data = localStorage.getItem(key);
        if (data) {
          data = JSON.parse(data);
          if (now.getTime() < data.expire) {
            return data.value;
          }
        }
        return null;
      } catch(e) {
        return $.cookie(key);
      }
    }
    return $.cookie(key);
  },

  emitDefault: function (incidents) {
    $.ajax({
      url: this.config.emitPath,
      data: {'incidents': incidents},
      type: 'POST',
      cache: false,
      dataType: "html"
    });
  }
};
})(jQuery);
;
