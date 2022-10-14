/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
;
!function(e){Drupal.ajax=Drupal.ajax||{},Drupal.settings.urlIsAjaxTrusted=Drupal.settings.urlIsAjaxTrusted||{},Drupal.behaviors.AJAX={attach:function(t,s){for(var r in s.ajax)if(!e("#"+r+".ajax-processed").length){var a=s.ajax[r];void 0===a.selector&&(a.selector="#"+r),e(a.selector).each((function(){a.element=this,Drupal.ajax[r]=new Drupal.ajax(r,this,a)})),e("#"+r).addClass("ajax-processed")}e(".use-ajax:not(.ajax-processed)").addClass("ajax-processed").each((function(){var t={progress:{type:"throbber"}};e(this).attr("href")&&(t.url=e(this).attr("href"),t.event="click");var s=e(this).attr("id");Drupal.ajax[s]=new Drupal.ajax(s,this,t)})),e(".use-ajax-submit:not(.ajax-processed)").addClass("ajax-processed").each((function(){var t={};t.url=e(this.form).attr("action"),t.setClick=!0,t.event="click",t.progress={type:"throbber"};var s=e(this).attr("id");Drupal.ajax[s]=new Drupal.ajax(s,this,t)}))}},Drupal.ajax=function(t,s,r){var a={url:"system/ajax",event:"mousedown",keypress:!0,selector:"#"+t,effect:"none",speed:"none",method:"replaceWith",progress:{type:"throbber",message:Drupal.t("Please wait...")},submit:{js:!0}};e.extend(this,a,r),this.element=s,this.element_settings=r,this.url=r.url.replace(/\/nojs(\/|$|\?|&|#)/g,"/ajax$1"),Drupal.settings.urlIsAjaxTrusted[r.url]&&(Drupal.settings.urlIsAjaxTrusted[this.url]=!0),this.wrapper="#"+r.wrapper,this.element.form&&(this.form=e(this.element.form));var o=this;o.options={url:Drupal.sanitizeAjaxUrl(o.url),data:o.submit,beforeSerialize:function(e,t){return o.beforeSerialize(e,t)},beforeSubmit:function(e,t,s){return o.ajaxing=!0,o.beforeSubmit(e,t,s)},beforeSend:function(e,t){return o.ajaxing=!0,o.beforeSend(e,t)},success:function(t,s,r){if("string"==typeof t&&(t=e.parseJSON(t)),null!==t&&!Drupal.settings.urlIsAjaxTrusted[o.url]&&"1"!==r.getResponseHeader("X-Drupal-Ajax-Token")){var a=Drupal.t("The response failed verification so will not be processed.");return o.error(r,o.url,a)}return o.success(t,s)},complete:function(e,t){if(o.ajaxing=!1,"error"==t||"parsererror"==t)return o.error(e,o.url)},dataType:"json",jsonp:!1,type:"POST"},-1===navigator.userAgent.indexOf("MSIE")&&(o.options.iframeSrc="about:blank"),e(o.element).bind(r.event,(function(e){if(!Drupal.settings.urlIsAjaxTrusted[o.url]&&!Drupal.urlIsLocal(o.url))throw new Error(Drupal.t("The callback URL is not local and not trusted: !url",{"!url":o.url}));return o.eventResponse(this,e)})),r.keypress&&e(o.element).keypress((function(e){return o.keypressResponse(this,e)})),r.prevent&&e(o.element).bind(r.prevent,!1)},Drupal.ajax.prototype.keypressResponse=function(t,s){if(13==s.which||32==s.which&&"text"!=t.type&&"textarea"!=t.type)return e(this.element_settings.element).trigger(this.element_settings.event),!1},Drupal.ajax.prototype.eventResponse=function(t,s){var r=this;if(r.ajaxing)return!1;try{r.form?(r.setClick&&(t.form.clk=t),r.form.ajaxSubmit(r.options)):(r.beforeSerialize(r.element,r.options),e.ajax(r.options))}catch(e){r.ajaxing=!1,alert("An error occurred while attempting to process "+r.options.url+": "+e.message)}return void 0!==t.type&&("checkbox"==t.type||"radio"==t.type)},Drupal.ajax.prototype.beforeSerialize=function(t,s){if(this.form){var r=this.settings||Drupal.settings;Drupal.detachBehaviors(this.form,r,"serialize")}for(var a in s.data["ajax_html_ids[]"]=[],e("[id]").each((function(){s.data["ajax_html_ids[]"].push(this.id)})),s.data["ajax_page_state[theme]"]=Drupal.settings.ajaxPageState.theme,s.data["ajax_page_state[theme_token]"]=Drupal.settings.ajaxPageState.theme_token,Drupal.settings.ajaxPageState.css)s.data["ajax_page_state[css]["+a+"]"]=1;for(var a in Drupal.settings.ajaxPageState.js)s.data["ajax_page_state[js]["+a+"]"]=1},Drupal.ajax.prototype.beforeSubmit=function(e,t,s){},Drupal.ajax.prototype.beforeSend=function(t,s){if(this.form){s.extraData=s.extraData||{},s.extraData.ajax_iframe_upload="1";var r=e.fieldValue(this.element);null!==r&&(s.extraData[this.element.name]=Drupal.checkPlain(r))}if(e(this.element).addClass("progress-disabled").attr("disabled",!0),"bar"==this.progress.type){var a=new Drupal.progressBar("ajax-progress-"+this.element.id,e.noop,this.progress.method,e.noop);this.progress.message&&a.setProgress(-1,this.progress.message),this.progress.url&&a.startMonitoring(this.progress.url,this.progress.interval||1500),this.progress.element=e(a.element).addClass("ajax-progress ajax-progress-bar"),this.progress.object=a,e(this.element).after(this.progress.element)}else"throbber"==this.progress.type&&(this.progress.element=e('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>'),this.progress.message&&e(".throbber",this.progress.element).after('<div class="message">'+this.progress.message+"</div>"),e(this.element).after(this.progress.element))},Drupal.ajax.prototype.success=function(t,s){for(var r in this.progress.element&&e(this.progress.element).remove(),this.progress.object&&this.progress.object.stopMonitoring(),e(this.element).removeClass("progress-disabled").removeAttr("disabled"),Drupal.freezeHeight(),t)t.hasOwnProperty(r)&&t[r].command&&this.commands[t[r].command]&&this.commands[t[r].command](this,t[r],s);if(this.form){var a=this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,a)}Drupal.unfreezeHeight(),this.settings=null},Drupal.ajax.prototype.getEffect=function(e){var t=e.effect||this.effect,s=e.speed||this.speed,r={};return"none"==t?(r.showEffect="show",r.hideEffect="hide",r.showSpeed=""):"fade"==t?(r.showEffect="fadeIn",r.hideEffect="fadeOut",r.showSpeed=s):(r.showEffect=t+"Toggle",r.hideEffect=t+"Toggle",r.showSpeed=s),r},Drupal.ajax.prototype.error=function(t,s,r){if(Drupal.displayAjaxError(Drupal.ajaxError(t,s,r)),this.progress.element&&e(this.progress.element).remove(),this.progress.object&&this.progress.object.stopMonitoring(),e(this.wrapper).show(),e(this.element).removeClass("progress-disabled").removeAttr("disabled"),this.form){var a=this.settings||Drupal.settings;Drupal.attachBehaviors(this.form,a)}},Drupal.ajax.prototype.commands={insert:function(t,s,r){var a=s.selector?e(s.selector):e(t.wrapper),o=s.method||t.method,i=t.getEffect(s),n=e("<div></div>").html(s.data),l=n.contents();switch(1==l.length&&1==l.get(0).nodeType||(l=n),o){case"html":case"replaceWith":case"replaceAll":case"empty":case"remove":var p=s.settings||t.settings||Drupal.settings;Drupal.detachBehaviors(a,p)}if(a[o](l),"show"!=i.showEffect&&l.hide(),e(".ajax-new-content",l).length>0?(e(".ajax-new-content",l).hide(),l.show(),e(".ajax-new-content",l)[i.showEffect](i.showSpeed)):"show"!=i.showEffect&&l[i.showEffect](i.showSpeed),l.parents("html").length>0){p=s.settings||t.settings||Drupal.settings;Drupal.attachBehaviors(l,p)}},remove:function(t,s,r){var a=s.settings||t.settings||Drupal.settings;Drupal.detachBehaviors(e(s.selector),a),e(s.selector).remove()},changed:function(t,s,r){e(s.selector).hasClass("ajax-changed")||(e(s.selector).addClass("ajax-changed"),s.asterisk&&e(s.selector).find(s.asterisk).append(' <span class="ajax-changed">*</span> '))},alert:function(e,t,s){alert(t.text,t.title)},css:function(t,s,r){e(s.selector).css(s.argument)},settings:function(t,s,r){s.merge?e.extend(!0,Drupal.settings,s.settings):t.settings=s.settings},data:function(t,s,r){e(s.selector).data(s.name,s.value)},invoke:function(t,s,r){var a=e(s.selector);a[s.method].apply(a,s.arguments)},restripe:function(t,s,r){e("> tbody > tr:visible, > tr:visible",e(s.selector)).removeClass("odd even").filter(":even").addClass("odd").end().filter(":odd").addClass("even")},add_css:function(t,s,r){e("head").prepend(s.data);var a,o=/^@import url\("(.*)"\);$/gim;if(document.styleSheets[0].addImport&&o.test(s.data))for(o.lastIndex=0;a=o.exec(s.data);)document.styleSheets[0].addImport(a[1])},updateBuildId:function(t,s,r){e('input[name="form_build_id"][value="'+s.old+'"]').val(s.new)}}}(jQuery);;
