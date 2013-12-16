var GutCheck;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
GutCheck = {
  init: function() {
    this.Nav.init();
    this.Homepage.init();
    this.Lightboxes.init();
    this.SiteControls.init();
    this.Survey();
    return this.YouTube.init();
  }
};
GutCheck.Video = (function() {
  function Video(container, options) {
    this.container = container;
    this.id = $(container).attr('data-youtubeid');
    this.videoId = "video-" + this.id;
    this.options = options || {};
    this.height = this.options.height || 360;
    this.width = this.options.width || 640;
    this.embedSWF();
  }
  Video.prototype.setAPI = function() {
    return this.api || (this.api = $("#" + this.videoId).get(0));
  };
  Video.prototype.play = function() {
    this.setAPI();
    return this.api.playVideo();
  };
  Video.prototype.embedSWF = function() {
    var atts, attsString, k, params, urlParams, v;
    atts = {
      id: this.videoId,
      wmode: 'transparent'
    };
    urlParams = {
      enablejsapi: 1,
      playerapiid: this.videoId,
      hd: 1
    };
    params = {
      allowScriptAccess: "always",
      allowfullscreen: true,
      showinfo: 0,
      showsearch: 0,
      controls: 1,
      autohide: 1,
      rel: 0,
      version: 3,
      modestbranding: 1,
      wmode: 'transparent'
    };
    urlParams = $.extend({}, urlParams, params);
    attsString = ((function() {
      var _results;
      _results = [];
      for (k in urlParams) {
        v = urlParams[k];
        _results.push("" + k + "=" + v);
      }
      return _results;
    })()).join("&amp;");
    return swfobject.embedSWF("http://www.youtube.com/e/" + this.id + "?" + attsString, this.videoId, this.width, this.height, "10", null, null, params, atts);
  };
  return Video;
})();
GutCheck.VideoCollection = (function() {
  __extends(VideoCollection, Array);
  function VideoCollection() {
    VideoCollection.__super__.constructor.apply(this, arguments);
  }
  VideoCollection.prototype.push = function(video) {
    VideoCollection.__super__.push.call(this, video);
    return this.cue(video);
  };
  VideoCollection.prototype.stopAll = function() {
    return this.invoke(__bind(function(video) {
      return this.cue(video);
    }, this));
  };
  VideoCollection.prototype.invoke = function(callback) {
    var video, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      video = this[_i];
      _results.push(callback.call(this, video));
    }
    return _results;
  };
  VideoCollection.prototype.cue = function(video) {
    video.player.stopVideo();
    return video.player.cueVideoById(video.id);
  };
  return VideoCollection;
})();
GutCheck.Videos = new GutCheck.VideoCollection();
window.onYouTubePlayerReady = function(id) {
  var player;
  player = document.getElementById(id);
  id = id.match(/video-(.*)/)[1];
  GutCheck.Videos.push({
    id: id,
    player: player
  });
  return $(document).trigger('YouTube.playerReady', [id, player]);
};
GutCheck.YouTube = (function() {
  var container, init, randomizeVideos, setupScrollable, setupVideos, thumbs, thumbsContainer, updateHashTo;
  thumbs = container = thumbsContainer = null;
  init = function() {
    container = $('#videos');
    thumbsContainer = $('.thumbs', container);
    thumbs = $('.video', thumbsContainer);
    if (container.length > 0) {
      randomizeVideos();
      setupScrollable();
      return setupVideos();
    }
  };
  randomizeVideos = function() {
    var filter, id, selected;
    id = window.location.hash.split('#')[1];
    filter = "[data-youtubeid=" + id + "]";
    selected = thumbs.filter(filter);
    thumbs = thumbs.sort(function(a, b) {
      if ($(a).is(filter)) {
        return -1;
      } else if ($(b).is(filter)) {
        return 1;
      } else {
        return 0.5 - Math.round(Math.random()) - 0.5;
      }
    });
    thumbsContainer.empty().append(thumbs);
    return updateHashTo(thumbs.eq(0).attr('data-youtubeid'));
  };
  updateHashTo = function(hash) {
    return window.location.hash = "#" + hash;
  };
  setupVideos = function() {
    return thumbs.each(function(i, e) {
      return new GutCheck.Video(this);
    });
  };
  setupScrollable = function() {
    var scrollable, slideshowContainer;
    slideshowContainer = $('<div class="slideshow slideshow_container"><a href="#next" class="next"><span>next</span></a><a href="#prev" class="prev"><span>prev</span></a></div>').insertAfter(thumbsContainer).append(thumbsContainer);
    scrollable = slideshowContainer.scrollable({
      items: '.thumbs',
      next: '.next',
      prev: '.prev'
    });
    if (thumbs.length <= 1) {
      $('.next, .prev', slideshowContainer).hide();
    }
    slideshowContainer.bind('onSeek', function(e) {
      var api, newHash;
      api = slideshowContainer.data('scrollable');
      GutCheck.Videos.stopAll();
      newHash = api.getItems().removeClass('selected').eq(api.getIndex()).addClass('selected').attr('data-youtubeid');
      return updateHashTo(newHash);
    });
    return thumbs.eq(0).addClass('selected');
  };
  return {
    init: init
  };
})();
GutCheck.SiteControls = {
  init: function() {
    return $('.print').click(function(e) {
      e.preventDefault();
      return window.print();
    });
  }
};
GutCheck.Homepage = {
  init: function() {
    var vid;
    vid = new GutCheck.Video($('#main .video')[0], {
      height: 546,
      width: 970
    });
    $('#previdstill').click(function(e) {
      e.preventDefault();
      $(this).parents('#main').animate({
        height: '546'
      }, 500);
      $(this).fadeOut();
      return vid.play();
    });
    return $(document).trigger('homepage.imageScroll.complete');
  }
};
GutCheck.defaultLightboxOptions = {
  modal: true,
  position: 'center',
  resizable: false,
  autoOpen: false,
  draggable: false,
  minWidth: 600,
  maxHeight: 600,
  closeOnEscape: true
};
GutCheck.Survey = function() {
  var ask, askWidth, cancel, close, cookie, intentionalClose, loadSurvey, setCookie, startTimer, stopTimer, surveyIframe, takeSurveyButton, timer, trigger;
  timer = null;
  trigger = $('#survey-button');
  ask = $('#ask');
  surveyIframe = $('<iframe src="https://spreadsheets2.google.com/embeddedform?formkey=dGJuYVp4X2w0OWxxSU56NmRFWjZhQnc6MQ" width="570" height="600" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>').css({
    overflowX: 'hidden',
    margin: '-15px',
    padding: '15px',
    width: '570px',
    height: '600px'
  });
  cookie = $.cookie('gutcheck-survey');
  askWidth = "" + (ask.outerWidth()) + (parseInt(ask.css('margin-left'), 10)) + "px";
  intentionalClose = function(e) {
    e.preventDefault();
    setCookie();
    return close(e);
  };
  close = function(e) {
    e.preventDefault();
    startTimer(5 * 60 * 1000);
    return ask.animate({
      opacity: 0,
      left: "-" + askWidth
    }, 300);
  };
  loadSurvey = function(e) {
    e.preventDefault();
    return surveyIframe.ready(function() {
      var lightbox;
      close(e);
      stopTimer();
      lightbox = $('<div></div>').dialog(GutCheck.defaultLightboxOptions);
      lightbox.append(surveyIframe);
      lightbox.dialog('option', 'title', 'Gutcheck Feedback');
      lightbox.dialog('open');
      return setCookie();
    });
  };
  startTimer = function(duration) {
    stopTimer();
    if ($.cookie('gutcheck-survey') !== 'true') {
      return timer = setTimeout(function() {
        return trigger.click();
      }, duration);
    }
  };
  stopTimer = function() {
    return clearTimeout(timer);
  };
  setCookie = function() {
    return $.cookie('gutcheck-survey', 'true');
  };
  takeSurveyButton = $('.buttons.confirm', ask).click(loadSurvey);
  cancel = $('a[href~=#close]', ask).click(intentionalClose);
  trigger.click(function(e) {
    stopTimer();
    e.preventDefault();
    ask.css({
      left: "-" + askWidth,
      position: 'absolute',
      opacity: 0
    }).show().animate({
      opacity: 1,
      left: 0
    }, 300);
    return setTimeout(function() {
      return close(e);
    }, 6000);
  });
  return startTimer(60 * 1000);
};
GutCheck.Lightboxes = {
  init: function() {
    return this.setupExternalLightboxes();
  },
  setupExternalLightboxes: function() {
    var externalLinkLBTemplate;
    externalLinkLBTemplate = "<div class='external_link lightbox'>                               <h2>Thank you for visiting!<br /><br />We hope your visit was informative and enjoyable.</h2>                               <h3>You will now access: <strong class='location'><a href=':location'>:location</a></strong></h3>                             </div>";
    return $('body a[href^="http://"]:not(".no-popup")').click(function(e) {
      var externalLinkLBContent, externalLinkLightbox, location;
      e.preventDefault();
      location = this.href;
      externalLinkLBContent = $(externalLinkLBTemplate.replace(/:location/g, location));
      externalLinkLightbox = externalLinkLBContent.dialog(GutCheck.defaultLightboxOptions);
      externalLinkLightbox.dialog('option', 'title', 'You are now leaving gutcheck.nci.nih.gov');
      externalLinkLightbox.dialog('open');
      return setTimeout(function() {
        var newWin;
        newWin = window.open(location);
        if (!newWin) {
          window.location.href = location;
        }
        return externalLinkLightbox.dialog('close').remove();
      }, 2000);
    });
  }
};
GutCheck.Nav = {
  init: function() {
    var desc_items, items;
    items = $('nav dl a');
    desc_items = $('nav .description li');
    return $('a', desc_items).hover(function(e) {
      var $this, navItem, targetClass, targets;
      e.preventDefault();
      items.removeClass('focused');
      desc_items.removeClass('focused');
      $this = $(this);
      targetClass = $this.attr('data-highlight-class');
      targets = $('nav .' + targetClass).addClass('focused');
      return navItem = $this.parent().addClass('focused');
    }, function(e) {
      items.removeClass('focused');
      return desc_items.removeClass('focused');
    });
  }
};
$(function() {
  return GutCheck.init();
});