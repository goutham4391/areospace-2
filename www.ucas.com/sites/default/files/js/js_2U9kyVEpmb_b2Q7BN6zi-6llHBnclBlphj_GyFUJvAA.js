!function(t){"use strict";var e=t.pushState;t.pushState=function(r){var n=e.apply(t,arguments),a=document.createEvent("Event");return a.initEvent("statechange",!0,!0),document.dispatchEvent(a),n}}(window.history),Drupal.updateQueryString=function(t,e,r){"use strict";r||(r=window.location.href),r=r.replace("#js=on","");var n,a=new RegExp("([?&])"+t+"=.*?(&|#|$)(.*)","gi");if(a.test(r))null!=e?history.pushState({},"",r.replace(a,"$1"+t+"="+e+"$2$3")):(n=r.split("#"),r=n[0].replace(a,"$1$3").replace(/(&|\?)$/,""),void 0!==n[1]&&null!==n[1]&&(r+="#"+n[1]),history.pushState({},"",r));else if(null!=e){var i=-1!==r.indexOf("?")?"&":"?";n=r.split("#"),r=n[0]+i+t+"="+e,void 0!==n[1]&&null!==n[1]&&(r+="#"+n[1]),history.pushState({},"",r)}else history.pushState({},"",r)},Drupal.urlParam=function(t,e){"use strict";e||(e=decodeURIComponent(window.location.search.substring(1)));var r,n,a=e.split("&");for(n=0;n<a.length;n++)if((r=a[n].split("="))[0]===t)return"undefined"===r[1]||r[1]},Drupal.updateQueryStringParameter=function(t,e,r){"use strict";var n=new RegExp("([?&])"+e+"=.*?(&|$)","i"),a=-1!==t.indexOf("?")?"&":"?";return t.match(n)?t.replace(n,"$1"+e+"="+r+"$2"):t+a+e+"="+r},Drupal.extlink.applyClassAndSpan=function(t,e){"use strict";!function(r){var n;if(Drupal.settings.extlink.extImgClass)n=r(t);else{var a=r(t).find("img").parents("a");n=r(t).not(a)}n.addClass(e)}(jQuery)},Drupal.updateSearchLinksLayout=function(t){"use strict";t=!0===t,function(e){var r=jQuery('a[href*="search/site"], a[href*="ucas/events/find"], a[href*="data/documents/search"]');if("URLSearchParams"in window&&r.length>0){var n,a=Drupal.store("localStorage","ucasSearchLayout")||"list";r.each((function(){(n=new URL(this.href)).searchParams.set("layout",a),this.href=n.href})),t&&((n=new URL(window.location.href)).searchParams.set("layout",a),window.history.replaceState({},"",n.href))}}()},Drupal.store=function(t,e,r){"use strict";var n=!1,a=null;if("localStorage"!==t&&"sessionStorage"!==t&&(t="localStorage"),function(t){try{a=window[t];var e="__storage_test__";return a.setItem(e,e),a.removeItem(e),!0}catch(t){return!1}}(t)&&("localStorage"!==t&&"sessionStorage"!==t||(n=!0)),null!=r&&("object"==typeof r&&(r=JSON.stringify(r)),n?a.setItem(e,r):s(e,r,30)),void 0===r){var i;i=n?a.getItem(e):function(t){for(var e=t+"=",r=document.cookie.split(";"),n=0,a=r.length;n<a;n++){for(var i=r[n];" "===i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(e))return i.substring(e.length,i.length)}return null}(e);try{i=JSON.parse(i)}catch(t){}return i}function s(t,e,r){var n=new Date;n.setTime(n.getTime()+24*r*60*60*1e3);var a="; expires="+n.toGMTString();document.cookie=t+"="+e+a+"; path=/"}null===r&&(n?a.removeItem(e):s(e,"",-1))},String.prototype.replaceAll=function(t,e){"use strict";return this.split(t).join(e)},String.prototype.sanitizeHTML=function(t,e){"use strict";t||(t="b|i|p|br"),e||(e="script|object|embed");var r=new RegExp("(<("+e+")[^>]*>.*</\\2>|(?!<[/]?("+t+")(\\s[^<]*>|[/]>|>))<[^<>]*>|(?!<[^<>\\s]+)\\s[^</>]+(?=[/>]))","gi");return this.replace(r,"")},Array.prototype.find||(Array.prototype.find=function(t){"use strict";for(var e,r=Object(this),n=r.length>>>0,a=arguments[1],i=0;i<n;i++)if(e=r[i],t.call(a,e,i,r))return e;return"undefined"});;
!function(e){"use strict";Drupal.behaviors.paragraph_admin={attach:function(a,i){function l(a){var i=e(a).parents("td"),l=e(i).find(".field-name-field-overview-title-label label");0===e(l).length&&(l=e(i).find(".field-name-field-label label")),e(a).attr("checked")?e(l).html(Drupal.t('Label <span class="form-required" title="This field is required.">*</span>')):e(l).html(Drupal.t("Label"))}e(".field-name-field-navigation input.form-checkbox").each((function(a,i){l(i),e(i).change((function(){l(this)}))}))}}}(jQuery);;
var ucas={searchbarcallback:{initPlugins:function(e){return e}}},UCASDesignFramework=UCASDesignFramework||{};!function(e){"use strict";function t(t,a){if(!t.hasClass("has-select")){var n=!1;t.addClass("has-select");var i=e(document.createElement("select")).insertBefore(t);e(">li a",t).each((function(){var t=e(document.createElement("option")).appendTo(i).val(this.href).html(e(this).html());e(this).hasClass("active")&&(n=!0,t.attr("selected","selected"))})),n||e(document.createElement("option")).prependTo(i).val("").html("- Select -").attr("selected","selected"),i.change((function(){window.location.href=e(this).val()})),i.selectionBox({selectContainerClass:"form-input__fancy-select",optionsContainerClass:"form-input__fancy-select-options",optionContainerClass:"form-input__fancy-select-option",defaultText:a})}}Drupal.behaviors.ucas_site_config={attach:function(a,n){Drupal.updateSearchLinksLayout(),e(".form-item .description",a).each((function(){var t=e(this).html().linkify();e(this).html(t)}));var i=e("ul.video-channels-upper");i.length&&t(i,"Select channel");var s=e("ul.video-channels-lower");s.length&&t(s,"Select secondary channel"),e("div.whats-on-page a").click((function(){e(UCASDesignFramework).trigger("whatsOnThisPageLinkClick",{linkTitle:e(this).text(),pageUrl:window.location.pathname})}))}},String.linkify||(String.prototype.linkify=function(){if(/<\/?[a-z][\s\S]*>/i.test(this))return this;return this.replace(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,'<a href="$&">$&</a>').replace(/(^|[^\/])(www\.[\S]+(\b|$))/gim,'$1<a href="http://$2">$2</a>').replace(/[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim,'<a href="mailto:$&">$&</a>')})}(jQuery);;
var _baTheme=0,_baMode="Listen/translate with BrowseAloud",_baUseCookies=!0,_baHideOnLoad=!0;!function(o){"use strict";Drupal.behaviors.browseAloud={attach:function(e,i){var n=this,a=o(".browsealoud--link");a.length<=0||(a.text(_baMode),a.on("click",(function(o){n.initialiseBrowseAloud(o)})),"on"===o.cookie("__ba_plus")&&n.initialiseBrowseAloud(!0))},initialiseBrowseAloud:function(e){var i=this;window.BrowseAloudLocale?BrowseAloud.panel.toggleBar(!0,e):o.getScript("//www.browsealoud.com/plus/scripts/ba.js").done((function(){i.whenAvailable((function(){BrowseAloud.panel.toggleBar(!0,e)}))}))},whenAvailable:function(e){var i=window.setInterval((function(){o("#_ba__button_link").length&&(window.clearInterval(i),e())}),500)}}}(jQuery);;
(function ($) {

/**
 * Terminology:
 *
 *   "Link" means "Everything which is in flag.tpl.php" --and this may contain
 *   much more than the <A> element. On the other hand, when we speak
 *   specifically of the <A> element, we say "element" or "the <A> element".
 */

/**
 * The main behavior to perform AJAX toggling of links.
 */
Drupal.flagLink = function(context) {
  /**
   * Helper function. Updates a link's HTML with a new one.
   *
   * @param element
   *   The <A> element.
   * @return
   *   The new link.
   */
  function updateLink(element, newHtml) {
    var $newLink = $(newHtml);

    // Initially hide the message so we can fade it in.
    $('.flag-message', $newLink).css('display', 'none');

    // Reattach the behavior to the new <A> element. This element
    // is either whithin the wrapper or it is the outer element itself.
    var $nucleus = $newLink.is('a') ? $newLink : $('a.flag', $newLink);
    $nucleus.addClass('flag-processed').click(flagClick);

    // Find the wrapper of the old link.
    var $wrapper = $(element).parents('.flag-wrapper:first');
    // Replace the old link with the new one.
    $wrapper.after($newLink).remove();
    Drupal.attachBehaviors($newLink.get(0));

    $('.flag-message', $newLink).fadeIn();
    setTimeout(function(){ $('.flag-message.flag-auto-remove', $newLink).fadeOut() }, 3000);
    return $newLink.get(0);
  }

  /**
   * A click handler that is attached to all <A class="flag"> elements.
   */
  function flagClick(event) {
    // Prevent the default browser click handler
    event.preventDefault();

    // 'this' won't point to the element when it's inside the ajax closures,
    // so we reference it using a variable.
    var element = this;

    // While waiting for a server response, the wrapper will have a
    // 'flag-waiting' class. Themers are thus able to style the link
    // differently, e.g., by displaying a throbber.
    var $wrapper = $(element).parents('.flag-wrapper');
    if ($wrapper.is('.flag-waiting')) {
      // Guard against double-clicks.
      return false;
    }
    $wrapper.addClass('flag-waiting');

    // Hide any other active messages.
    $('span.flag-message:visible').fadeOut();

    // Send POST request
    $.ajax({
      type: 'POST',
      url: element.href,
      data: { js: true },
      dataType: 'json',
      success: function (data) {
        data.link = $wrapper.get(0);
        $.event.trigger('flagGlobalBeforeLinkUpdate', [data]);
        if (!data.preventDefault) { // A handler may cancel updating the link.
          data.link = updateLink(element, data.newLink);
        }

        // Find all the link wrappers on the page for this flag, but exclude
        // the triggering element because Flag's own javascript updates it.
        var $wrappers = $('.flag-wrapper.flag-' + data.flagName.flagNameToCSS() + '-' + data.contentId).not(data.link);
        var $newLink = $(data.newLink);

        // Hide message, because we want the message to be shown on the triggering element alone.
        $('.flag-message', $newLink).hide();

        // Finally, update the page.
        $wrappers = $newLink.replaceAll($wrappers);
        Drupal.attachBehaviors($wrappers.parent());

        $.event.trigger('flagGlobalAfterLinkUpdate', [data]);
      },
      error: function (xmlhttp) {
        alert('An HTTP error '+ xmlhttp.status +' occurred.\n'+ element.href);
        $wrapper.removeClass('flag-waiting');
      }
    });
  }

  $('a.flag-link-toggle:not(.flag-processed)', context).addClass('flag-processed').click(flagClick);
};

/**
 * Prevent anonymous flagging unless the user has JavaScript enabled.
 */
Drupal.flagAnonymousLinks = function(context) {
  $('a.flag:not(.flag-anonymous-processed)', context).each(function() {
    this.href += (this.href.match(/\?/) ? '&' : '?') + 'has_js=1';
    $(this).addClass('flag-anonymous-processed');
  });
}

String.prototype.flagNameToCSS = function() {
  return this.replace(/_/g, '-');
}

/**
 * A behavior specifically for anonymous users. Update links to the proper state.
 */
Drupal.flagAnonymousLinkTemplates = function(context) {
  // Swap in current links. Cookies are set by PHP's setcookie() upon flagging.

  var templates = Drupal.settings.flag.templates;

  // Build a list of user-flags.
  var userFlags = Drupal.flagCookie('flags');
  if (userFlags) {
    userFlags = userFlags.split('+');
    for (var n in userFlags) {
      var flagInfo = userFlags[n].match(/(\w+)_(\d+)/);
      var flagName = flagInfo[1];
      var contentId = flagInfo[2];
      // User flags always default to off and the JavaScript toggles them on.
      if (templates[flagName + '_' + contentId]) {
        $('.flag-' + flagName.flagNameToCSS() + '-' + contentId, context).after(templates[flagName + '_' + contentId]).remove();
      }
    }
  }

  // Build a list of global flags.
  var globalFlags = document.cookie.match(/flag_global_(\w+)_(\d+)=([01])/g);
  if (globalFlags) {
    for (var n in globalFlags) {
      var flagInfo = globalFlags[n].match(/flag_global_(\w+)_(\d+)=([01])/);
      var flagName = flagInfo[1];
      var contentId = flagInfo[2];
      var flagState = (flagInfo[3] == '1') ? 'flag' : 'unflag';
      // Global flags are tricky, they may or may not be flagged in the page
      // cache. The template always contains the opposite of the current state.
      // So when checking global flag cookies, we need to make sure that we
      // don't swap out the link when it's already in the correct state.
      if (templates[flagName + '_' + contentId]) {
        $('.flag-' + flagName.flagNameToCSS() + '-' + contentId, context).each(function() {
          if ($(this).find('.' + flagState + '-action').size()) {
            $(this).after(templates[flagName + '_' + contentId]).remove();
          }
        });
      }
    }
  }
}

/**
 * Utility function used to set Flag cookies.
 *
 * Note this is a direct copy of the jQuery cookie library.
 * Written by Klaus Hartl.
 */
Drupal.flagCookie = function(name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options = $.extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    // NOTE Needed to parenthesize options.path and options.domain
    // in the following expressions, otherwise they evaluate to undefined
    // in the packed version for some reason...
    var path = options.path ? '; path=' + (options.path) : '';
    var domain = options.domain ? '; domain=' + (options.domain) : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};

Drupal.behaviors.flagLink = {};
Drupal.behaviors.flagLink.attach = function(context) {
  // For anonymous users with the page cache enabled, swap out links with their
  // current state for the user.
  if (Drupal.settings.flag && Drupal.settings.flag.templates) {
    Drupal.flagAnonymousLinkTemplates(context);
  }

  // For all anonymous users, require JavaScript for flagging to prevent spiders
  // from flagging things inadvertently.
  if (Drupal.settings.flag && Drupal.settings.flag.anonymous) {
    Drupal.flagAnonymousLinks(context);
  }

  // On load, bind the click behavior for all links on the page.
  Drupal.flagLink(context);
};

})(jQuery);
;
!function(e){"use strict";Drupal.behaviors.keyMessagesCtaMessages={storage:{},attach:function(s){const a=e(".delay").text()||0;(async()=>{var t;if(await(t=1e3*a,new Promise((e=>setTimeout(e,t)))),e(".cta-message--container").length){let a=e("#LoginPromptModal",s).attr("nid"),t=1001,o=e(".modal-container--cta-message");for(let e=0;e<o.length;e++)o[e].style.zIndex=t--;if(e.cookie("cta_message")!==a){let t;e("body",s).hasClass("v4")&&(t="v4",e("body",s).removeClass("v4").addClass("v5")),e(".cta-message--container",s).css("visibility","visible"),e("#ctaMessageClose",s).click((function(){e(".cta-message--container",s).css("display","none"),"v4"===t&&e("body",s).removeClass("v5").addClass("v4"),e.cookie("cta_message",a,{expires:365})}))}}})()}}}(jQuery);;
!function(e){"use strict";Drupal.behaviors.globalMenu={attach:function(t){var n=e(".site-menu__toggle-wrapper",t),a=this;n.attr("aria-hidden","false"),n.each((function(t,n){e(this).on("click",(function(t){var n=e(this).parents(".site-menu");n.hasClass("site-menu--active")?(n.removeClass("site-menu--active"),n.addClass("site-menu--active-transition"),setTimeout((function(){n.removeClass("site-menu--active-transition")}),200)):(n.addClass("site-menu--active-transition"),n.addClass("site-menu--active"),setTimeout((function(){n.removeClass("site-menu--active-transition")}),200));var i=n.find(".site-menu__menu-wrapper"),s=a.calculateHeight(i.find(".menu"))+"px";i.find(".menu-block-wrapper > .menu").height(s),i.find(".menu-block-wrapper > .menu > .menu__item > .menu").height(s)}))})),e(document).on("click",(function(n){e(n.target).closest(".site-menu__menu-wrapper, .site-menu__toggle-wrapper").length||e("body",t).find(".site-menu").removeClass("site-menu--active")}))},calculateHeight:function(t){var n=0;return e(t).each((function(t,a){var i=e(a).height();i>n&&(n=i)})),n}},Drupal.behaviors.highlightTopLevel={attach:function(t){e(".meganav__links a").each((function(t,n){if(RegExp("^"+n.pathname).test(window.location.pathname)){var a=e(n);return a.hasClass("global-link__link")?a.attr("aria-current","page"):a.parents(".global-link").find(".global-link__link:first").attr("aria-current","page"),!1}}))}}}(jQuery);;
