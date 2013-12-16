function HomeSections () {
  var main = $('#main'),
      sections = $('section', main),
      classes = sections.map(function(i, e) { return e.id.replace('#', ''); }).toArray();
  classes.push('splash');

  function reset () {
    main.removeClass(classes.join(" "));
  }

  function transitionTo (section) {
    reset();
    main.addClass(section).trigger('section_transition', [ sections.filter('#' + section) ]);
  }

  sections.click(function(e) {
    //e.preventDefault();

    if (main.hasClass('splash')) {
      transitionTo(this.id.replace('#', ''));
    } else if ($(e.target).hasClass('view_link')) {
      transitionTo(e.target.href.split('#')[1]);
    }
  });

  $(".scroll").click(function(event){
    //prevent the default action for the click event
    event.preventDefault();

    //get the full url - like mysitecom/index.htm#home
    var full_url = this.href;

    //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
    var parts = full_url.split("#");
    var trgt = parts[1];

    //get the top offset of the target anchor
    var target_offset = $("#"+trgt).offset();
    var target_top = target_offset.top;

    //goto that anchor by setting the body scroll top to anchor top
    $('html, body').animate({scrollTop:target_top}, 500);
  });

  $('#close', main).click(function(e) {
    e.preventDefault();
    transitionTo('splash');
  });
}

$(function() {
  HomeSections();
  $('#main').bind('section_transition', function(e, newSection) {
    var slideshow = $('.slideshow', newSection).slideshow('start');
  });
});
