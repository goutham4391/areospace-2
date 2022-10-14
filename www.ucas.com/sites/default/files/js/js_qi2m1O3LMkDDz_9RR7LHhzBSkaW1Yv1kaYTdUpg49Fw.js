(function ($) {
  Drupal.behaviors.geofieldMapInit = {
    attach: function (context, settings) {
      // Init all maps in Drupal.settings.
      if (settings.geofield_gmap) {
        $.each(settings.geofield_gmap, function (mapid, options) {
          $('#' + mapid).once('geofield-gmap', function () {
            geofield_gmap_initialize({
              lat: options.lat,
              lng: options.lng,
              zoom: options.zoom,
              latid: options.latid,
              lngid: options.lngid,
              searchid: options.searchid,
              mapid: options.mapid,
              widget: options.widget,
              map_type: options.map_type,
              confirm_center_marker: options.confirm_center_marker,
              click_to_place_marker: options.click_to_place_marker
            });
          });
        });
      }
    }
  };
})(jQuery);

var geofield_gmap_geocoder;
var geofield_gmap_data = [];

// Center the map to the marker location.
function geofield_gmap_center(mapid) {
  google.maps.event.trigger(geofield_gmap_data[mapid].map, 'resize');
  geofield_gmap_data[mapid].map.setCenter(geofield_gmap_data[mapid].marker.getPosition());
}

// Place marker at the current center of the map.
function geofield_gmap_marker(mapid) {
  if (geofield_gmap_data[mapid].confirm_center_marker) {
    if (!window.confirm('Change marker position ?')) return;
  }

  google.maps.event.trigger(geofield_gmap_data[mapid].map, 'resize');
  var position = geofield_gmap_data[mapid].map.getCenter();
  geofield_gmap_data[mapid].marker.setPosition(position);
  geofield_gmap_data[mapid].lat.val(position.lat());
  geofield_gmap_data[mapid].lng.val(position.lng());

  if (geofield_gmap_data[mapid].search) {
    geofield_gmap_geocoder.geocode({'latLng': position}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          geofield_gmap_data[mapid].search.val(results[0].formatted_address);
        }
      }
    });
  }
}

// Init google map.
function geofield_gmap_initialize(params) {
  geofield_gmap_data[params.mapid] = params;
  jQuery.noConflict();

  if (!geofield_gmap_geocoder) {
    geofield_gmap_geocoder = new google.maps.Geocoder();
  }

  var location = new google.maps.LatLng(params.lat, params.lng);
  var options = {
    zoom: params.zoom,
    center: location,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    scaleControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE
    }
  };

  switch (params.map_type) {
    case "ROADMAP":
      options.mapTypeId = google.maps.MapTypeId.ROADMAP;
      break;
    case "SATELLITE":
      options.mapTypeId = google.maps.MapTypeId.SATELLITE;
      break;
    case "HYBRID":
      options.mapTypeId = google.maps.MapTypeId.HYBRID;
      break;
    case "TERRAIN":
      options.mapTypeId = google.maps.MapTypeId.TERRAIN;
      break;
    default:
      options.mapTypeId = google.maps.MapTypeId.ROADMAP;
  }

  var map = new google.maps.Map(document.getElementById(params.mapid), options);
  geofield_gmap_data[params.mapid].map = map;

  // Fix http://code.google.com/p/gmaps-api-issues/issues/detail?id=1448.
  google.maps.event.addListener(map, "idle", function () {
    google.maps.event.trigger(map, 'resize');
  });

  // Fix map issue in fieldgroups / vertical tabs
  // https://www.drupal.org/node/2474867.
  google.maps.event.addListenerOnce(map, "idle", function () {
    // Show all map tiles when a map is shown in a vertical tab.
    jQuery('#' + params.mapid).closest('div.vertical-tabs').find('.vertical-tab-button a').click(function () {
      google.maps.event.trigger(map, 'resize');
      geofield_gmap_center(params.mapid);
    });
    // Show all map tiles when a map is shown in a collapsible fieldset.
    jQuery('#' + params.mapid).closest('fieldset.collapsible').find('a.fieldset-title').click(function () {
      google.maps.event.trigger(map, 'resize');
      geofield_gmap_center(params.mapid);
    });
  });

  // Place map marker.
  var marker = new google.maps.Marker({
    map: map,
    draggable: params.widget
  });
  geofield_gmap_data[params.mapid].marker = marker;
  marker.setPosition(location);

  if (params.widget && params.latid && params.lngid) {
    geofield_gmap_data[params.mapid].lat = jQuery("#" + params.latid);
    geofield_gmap_data[params.mapid].lng = jQuery("#" + params.lngid);
    if (params.searchid) {
      geofield_gmap_data[params.mapid].search = jQuery("#" + params.searchid);
      geofield_gmap_data[params.mapid].search.autocomplete({
        // This bit uses the geocoder to fetch address values.
        source: function (request, response) {
          geofield_gmap_geocoder.geocode({'address': request.term }, function (results, status) {
            response(jQuery.map(results, function (item) {
              return {
                label: item.formatted_address,
                value: item.formatted_address,
                latitude: item.geometry.location.lat(),
                longitude: item.geometry.location.lng()
              };
            }));
          });
        },
        // This bit is executed upon selection of an address.
        select: function (event, ui) {
          geofield_gmap_data[params.mapid].lat.val(ui.item.latitude);
          geofield_gmap_data[params.mapid].lng.val(ui.item.longitude);
          var location = new google.maps.LatLng(ui.item.latitude, ui.item.longitude);
          marker.setPosition(location);
          map.setCenter(location);
        }
      });

      // Geocode user input on enter.
      geofield_gmap_data[params.mapid].search.keydown(function (e) {
        if (e.which == 13) {
          var input = geofield_gmap_data[params.mapid].search.val();
          // Execute the geocoder
          geofield_gmap_geocoder.geocode({'address': input }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                // Set the location
                var location = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                marker.setPosition(location);
                map.setCenter(location);
                // Fill the lat/lon fields with the new info
                geofield_gmap_data[params.mapid].lat.val(marker.getPosition().lat());
                geofield_gmap_data[params.mapid].lng.val(marker.getPosition().lng());
              }
            }
          });
        }
      });

      // Add listener to marker for reverse geocoding.
      google.maps.event.addListener(marker, 'drag', function () {
        geofield_gmap_geocoder.geocode({'latLng': marker.getPosition()}, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              geofield_gmap_data[params.mapid].search.val(results[0].formatted_address);
              geofield_gmap_data[params.mapid].lat.val(marker.getPosition().lat());
              geofield_gmap_data[params.mapid].lng.val(marker.getPosition().lng());
            }
          }
        });
      });
    }

    if (params.click_to_place_marker) {
      // Change marker position with mouse click.
      google.maps.event.addListener(map, 'click', function (event) {
        var position = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        marker.setPosition(position);
        geofield_gmap_data[params.mapid].lat.val(position.lat());
        geofield_gmap_data[params.mapid].lng.val(position.lng());
        //google.maps.event.trigger(geofield_gmap_data[params.mapid].map, 'resize');
      });
    }

    geofield_onchange = function () {
      var location = new google.maps.LatLng(
        parseInt(geofield_gmap_data[params.mapid].lat.val()),
        parseInt(geofield_gmap_data[params.mapid].lng.val()));
      marker.setPosition(location);
      map.setCenter(location);
    };

    geofield_gmap_data[params.mapid].lat.change(geofield_onchange);
    geofield_gmap_data[params.mapid].lng.change(geofield_onchange);
  }
}
;
!function(t){"use strict";Drupal.behaviors.media_buto_akita={attach:function(e,i){t(".buto-akita-player",e).each((function(){if(t(this).hasClass("akita-player"))return!0;var e=t(this).attr("id").replace("buto_",""),a=i.media_buto[e],n="video";!0===a.is_playlist&&(n="playlist");var r="//js.buto.tv/"+n+"/"+JSON.stringify({object_id:e})+"/akita";t.getScript(r),t(this).bind("playerReady",(function(t){var i=Akita.playerInstances[this.getAttribute("data-instance-id")],n=0;!0===a.autoplay&&i.play(),i.eventEmitter.on("playing",(function(t){dataLayer.push({buto_id:e,title:a.title,client_id:a.client_id,event:"butoVideoPlaying"})})),i.eventEmitter.on("progress",(function(t){var i=Math.floor(t.data.event.target.duration)/4;Math.floor(t.data.event.target.currentTime)>n*i+i&&(n++,dataLayer.push({buto_id:e,title:a.title,client_id:a.client_id,progress:25*n+"%",event:"butoVideoProgress"}))})),i.eventEmitter.on("ended",(function(t){dataLayer.push({buto_id:e,title:a.title,client_id:a.client_id,progress:"100%",event:"butoVideoProgress"})}))}))}))}}}(jQuery);;
(function ($) {

Drupal.extlink = Drupal.extlink || {};

Drupal.extlink.attach = function (context, settings) {
  if (!settings.hasOwnProperty('extlink')) {
    return;
  }

  // Strip the host name down, removing ports, subdomains, or www.
  var pattern = /^(([^\/:]+?\.)*)([^\.:]{4,})((\.[a-z]{1,4})*)(:[0-9]{1,5})?$/;
  var host = window.location.host.replace(pattern, '$3$4');
  var subdomain = window.location.host.replace(pattern, '$1');

  // Determine what subdomains are considered internal.
  var subdomains;
  if (settings.extlink.extSubdomains) {
    subdomains = "([^/]*\\.)?";
  }
  else if (subdomain == 'www.' || subdomain == '') {
    subdomains = "(www\\.)?";
  }
  else {
    subdomains = subdomain.replace(".", "\\.");
  }

  // Build regular expressions that define an internal link.
  var internal_link = new RegExp("^https?://" + subdomains + host, "i");

  // Extra internal link matching.
  var extInclude = false;
  if (settings.extlink.extInclude) {
    extInclude = new RegExp(settings.extlink.extInclude.replace(/\\/, '\\'), "i");
  }

  // Extra external link matching.
  var extExclude = false;
  if (settings.extlink.extExclude) {
    extExclude = new RegExp(settings.extlink.extExclude.replace(/\\/, '\\'), "i");
  }

  // Extra external link CSS selector exclusion.
  var extCssExclude = false;
  if (settings.extlink.extCssExclude) {
    extCssExclude = settings.extlink.extCssExclude;
  }

  // Extra external link CSS selector explicit.
  var extCssExplicit = false;
  if (settings.extlink.extCssExplicit) {
    extCssExplicit = settings.extlink.extCssExplicit;
  }

  // Find all links which are NOT internal and begin with http as opposed
  // to ftp://, javascript:, etc. other kinds of links.
  // When operating on the 'this' variable, the host has been appended to
  // all links by the browser, even local ones.
  // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
  // available in jQuery 1.0 (Drupal 5 default).
  var external_links = new Array();
  var mailto_links = new Array();
  $("a:not(." + settings.extlink.extClass + ", ." + settings.extlink.mailtoClass + "), area:not(." + settings.extlink.extClass + ", ." + settings.extlink.mailtoClass + ")", context).each(function(el) {
    try {
      var url = this.href.toLowerCase();
      if (url.indexOf('http') == 0
        && ((!url.match(internal_link) && !(extExclude && url.match(extExclude))) || (extInclude && url.match(extInclude)))
        && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
        && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
        external_links.push(this);
      }
      // Do not include area tags with begin with mailto: (this prohibits
      // icons from being added to image-maps).
      else if (this.tagName != 'AREA' 
        && url.indexOf('mailto:') == 0 
        && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
        && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
        mailto_links.push(this);
      }
    }
    // IE7 throws errors often when dealing with irregular links, such as:
    // <a href="node/10"></a> Empty tags.
    // <a href="http://user:pass@example.com">example</a> User:pass syntax.
    catch (error) {
      return false;
    }
  });

  if (settings.extlink.extClass) {
    Drupal.extlink.applyClassAndSpan(external_links, settings.extlink.extClass);
  }

  if (settings.extlink.mailtoClass) {
    Drupal.extlink.applyClassAndSpan(mailto_links, settings.extlink.mailtoClass);
  }

  if (settings.extlink.extTarget) {
    // Apply the target attribute to all links.
    $(external_links).attr('target', settings.extlink.extTarget);
  }

  Drupal.extlink = Drupal.extlink || {};

  // Set up default click function for the external links popup. This should be
  // overridden by modules wanting to alter the popup.
  Drupal.extlink.popupClickHandler = Drupal.extlink.popupClickHandler || function() {
    if (settings.extlink.extAlert) {
      return confirm(settings.extlink.extAlertText);
    }
   }

  $(external_links).click(function(e) {
    return Drupal.extlink.popupClickHandler(e);
  });
};

/**
 * Apply a class and a trailing <span> to all links not containing images.
 *
 * @param links
 *   An array of DOM elements representing the links.
 * @param class_name
 *   The class to apply to the links.
 */
Drupal.extlink.applyClassAndSpan = function (links, class_name) {
  var $links_to_process;
  if (Drupal.settings.extlink.extImgClass){
    $links_to_process = $(links);
  }
  else {
    var links_with_images = $(links).find('img').parents('a');
    $links_to_process = $(links).not(links_with_images);
  }
  $links_to_process.addClass(class_name);
  var i;
  var length = $links_to_process.length;
  for (i = 0; i < length; i++) {
    var $link = $($links_to_process[i]);
    if ($link.css('display') == 'inline' || $link.css('display') == 'inline-block') {
      if (class_name == Drupal.settings.extlink.mailtoClass) {
        $link.append('<span class="' + class_name + '"><span class="element-invisible"> ' + Drupal.settings.extlink.mailtoLabel + '</span></span>');
      }
      else {
        $link.append('<span class="' + class_name + '"><span class="element-invisible"> ' + Drupal.settings.extlink.extLabel + '</span></span>');
      }
    }
  }
};

Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};
Drupal.behaviors.extlink.attach = function (context, settings) {
  // Backwards compatibility, for the benefit of modules overriding extlink
  // functionality by defining an "extlinkAttach" global function.
  if (typeof extlinkAttach === 'function') {
    extlinkAttach(context);
  }
  else {
    Drupal.extlink.attach(context, settings);
  }
};

})(jQuery);
;
