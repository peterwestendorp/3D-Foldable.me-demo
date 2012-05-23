// JSLint options (see also config/jslint.yml):
/*global  window, alert, confirm, $ */

(function() {
  var $bodyPartsSelector = $("ul.body-parts-selector"),
      $body3d = $('html.csstransforms3d body'),
      $hipsterPreview = $(".hipster-preview", $body3d),
      $dude = $(".hipster"),
      $linkList = $(".link-list"),
      $links = $("li a", $linkList),
      changeSides,
      connectScroll,
      cssTransforms = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
      disconnectScroll,
      el = document.createElement('div'),
      has3DSupport = false,
      isAnimating = false,
      parts = [],
      prop,
      property,
      resetColorList,
      setBodyPart,
      setColorList,
      yAngle = -30,
      _i,
      _len;

  // select the right transform prefix
  for(_i = 0, _len = cssTransforms.length; _i < _len; _i++) {
    prop = cssTransforms[_i];
    if(typeof el.style[prop] !== "undefined") property = prop;
  }

  if($("html.csstransforms3d body").length > 0){
    has3DSupport = true;
  }


  if(has3DSupport){
    setTimeout(function(){
      $dude[0].style[property] = "rotateX(-15deg) rotateY("+yAngle+"deg)";
    },2000);

    // model rotation on arrow key down
    $body3d.on("keydown", function(e) {
      if(!isAnimating) {
        isAnimating = true;
        switch (e.keyCode) {
          case 37:
            yAngle -= 90;
            break;
          case 39:
            yAngle += 90;
        }
        $dude[0].style[property] = "rotateX(-15deg) rotateY(" + yAngle + "deg)";

        setTimeout(function(){
          isAnimating = false;
        }, 1000);
      }
    });

    $(".hipster-preview p.instructions a").on("click", function(e){
        e.preventDefault();

        if(!isAnimating){
          isAnimating = true;

          if($(this).hasClass("left")){
            yAngle -= 60; //left
          }

          else if($(this).hasClass("right")){
            yAngle += 60; //right
          }

          $dude[0].style[property] = "rotateX(-15deg) rotateY("+yAngle+"deg)";

          setTimeout(function(){
            isAnimating = false;
          }, 1000);
        }
    });

    // rotate model on click on rotate buttons
    changeSides = function(e) {
      e.preventDefault();

      var $target = $(e.target);
      yAngle = 360 * Math.round(yAngle / 360);

      $links.removeClass("active");
      $target.addClass("active");
      $dude.removeClass("front back left right");

      if($target.hasClass("front")) {
        $dude.addClass("front");
        yAngle = yAngle - 30;
        $dude[0].style[property] = "rotateX(-15deg) rotateY(" + yAngle + "deg)";
      }
      if($target.hasClass("back")) {
        $dude.addClass("back");
        yAngle = yAngle - 210;
        $dude[0].style[property] = "rotateX(-15deg) rotateY(" + yAngle + "deg)";
      }
      if($target.hasClass("right")) {
        $dude.addClass("right");
        yAngle = yAngle - 120;
        $dude[0].style[property] = "rotateX(-15deg) rotateY(" + yAngle + "deg)";
      }
      if($target.hasClass("left")) {
        $dude.addClass("left");
        yAngle = yAngle - 300;
        $dude[0].style[property] = "rotateX(-15deg) rotateY(" + yAngle + "deg)";
      }
    };
    $links.on("click", changeSides);
  }

  // set selected bodypart on model
  setBodyPart = function($radioBtn) {
    var part,
        setImage,
        sourceUrl = $radioBtn.data("source-url"),
        targetPartType = $radioBtn.data("part-type"),
        _j,
        _len2,
        _results = [];

    setImage = function(partType) {
      if(targetPartType === partType) {
        $(".hipster ." + partType).css("background-image", "url(" + sourceUrl + ")");
        return;
      }
      //skin has to be set on all surfaces
      if(targetPartType === "skin") {
        $(".hipster-preview .surface").css("background-image", "url(" + sourceUrl + ")");
      }
    };

    for (_j = 0, _len2 = parts.length; _j < _len2; _j++) {
      part = parts[_j];
      _results.push(setImage(part));
    }
    return _results;
  };

  // set colorlist for selected bodypart
  setColorList = function(clickElm, $colorHolder) {
    $colorHolder.html("");
    $colorHolder.append($("ul.part-colors", clickElm));
  };

  // reset colorlist
  resetColorList = function($activeElm, $colorHolder) {
    $activeElm.append($colorHolder.html());
    $colorHolder.html("");
  };

  // set eventlisteners on bodypart items, and (re)set active states
  $bodyPartsSelector.each(function(i, partSelector) {
    var $checkedInputs,
        $colorHolder;

    $(">li", partSelector).each(function(i, elm) {
      parts.push($(elm).data("part-name"));
    });

    $(">li", partSelector).on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $colorHolder = $(".color-holder", $(partSelector).parent()),
          $oldActiveElm = $("li.active ul.part-elements>li.active", partSelector),
          $partList = $("li.active ul.part-elements", partSelector);

      resetColorList($oldActiveElm, $colorHolder);
      setColorList($("li.active", this), $colorHolder);

      $(">li", partSelector).removeClass("active");
      $(this).addClass("active");
    });

    $("li ul.part-elements>li", partSelector).on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $colorHolder = $(".color-holder", $(partSelector).parent()),
          $oldActiveElm = $("li.active ul.part-elements>li.active", partSelector);

      resetColorList($oldActiveElm, $colorHolder);
      setColorList(this, $colorHolder);

      $oldActiveElm.removeClass("active");
      $(this).addClass("active");

      $("li:first-child label", $colorHolder).click();
    });

    $("body").on("click", "ul.part-colors li label", function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $radioBtn;

      $radioBtn = $("input[type=radio]", e.currentTarget);
      $radioBtn.attr("checked", "checked");
      setBodyPart($radioBtn);
    });

    $checkedInputs = $("input[type=radio][checked=checked]", partSelector);
    $checkedInputs.parents("ul.part-colors").parent().addClass("active");
    setColorList($("li.active ul.part-elements>li.active"), $(".color-holder", $(partSelector).parent()));
  });

}).call(this);
