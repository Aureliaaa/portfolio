/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "150px";
    }

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginTop = "0";
    }

var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };

var index = 1;
$("nav.indicators ul li").bind("click",indicator);
setCurrentPoject();

function indicator(){
		$("nav.indicators ul li").unbind("click");

		index = $(this).index();

		setCurrentPoject();
	}

function setCurrentPoject() {

			if(index > $("nav.indicators ul li").length-1){
					index = 1;
			}
			if(index < 1){
					index = $("nav.indicators ul li").length-1;
			}

			var currentItem = $("nav.indicators ul li")[index];

			if(!$(currentItem).hasClass("current")){

				var parentleft = ($(currentItem).parent().offset().left)+10;

				var position = $(currentItem).offset().left - parentleft;

				var diff = position - ($("nav.indicators ul li.current").offset().left - parentleft);

				var direction = "left";

				if(diff < 0){
					direction = "left";
				}else{
					direction = "right";
				}

				slideshow(direction,position,diff);

			}
	}


$(".indicators ul li").on("click", function() {


  if ($(this).hasClass("current")) {
    return false;
  } else {
    var parentleft = ($(this).parent().offset().left) + 10;

    var position = $(this).offset().left - parentleft;

    var diff = position - ($("nav.indicators ul li.current").offset().left - parentleft);

    var direction = "left";

    if (diff < 0) {
      direction = "left";
    } else {
      direction = "right";
    }

    slideshow(direction, position, diff);

  }
});

function slideshow(direction,position,diff) {

		if(direction == "left"){
			$("nav.indicators ul li.current").css({"left":position+"px","width":(Math.abs(diff)+20)+"px"});
			setTimeout(function () {
				$("nav.indicators ul li.current").css({"width":"20px"});
				bindNavigation();
			},500);
		}else{
			$("nav.indicators ul li.current").css({"width":(Math.abs(diff)+20)+"px"});
			setTimeout(function () {
				$("nav.indicators ul li.current").css({"left":position+"px","width":"20px"});
				bindNavigation();
			},400);
		}

	}

function bindNavigation() {
		$("nav.indicators ul li").bind("click",indicator);
  
  
	}

// Full Page Scroll //

document.addEventListener('wheel', scrollPage);

function scrollPage(e) {
  var nodesName = ['HEADER', 'SECTION', 'FOOTER'];
  console.log(e.target.nodeName);
  if (nodesName.includes(e.target.nodeName)) {
    var next = e.target.nextElementSibling;
    var prev = e.target.previousElementSibling;
  } else {
    var next = e.target.closest(nodesName).nextElementSibling;
    var prev = e.target.closest(nodesName).previousElementSibling;
  }
  
  if (e.deltaY < 0) {
    e.preventDefault();
    if(nodesName.includes(prev.nodeName)) {
      verticalScroll(prev, 1500, 'easeInOutCubic');
      e.target.closest(nodesName).classList.remove('active')
      prev.classList.add('active')
    }
    
  } else if (e.deltaY > 0) {
    e.preventDefault();
    if(nodesName.includes(next.nodeName)) {
      verticalScroll(next, 1500, 'easeInOutQuad', runAfter);
      e.target.closest(nodesName).classList.remove('active');
      next.classList.add('active');
    }
  } else {
    return false;
  }
}

function runAfter() {
  console.log('after');
}

function verticalScroll(destination) {
  var duration = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];
  var easing = arguments.length <= 2 || arguments[2] === undefined ? 'linear' : arguments[2];
  var callback = arguments[3];
  var easings = {
    easeInOutQuad: function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  };
  
  console.log(easings.easeInOutQuad);
  
  var start = window.pageYOffset;
  var startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
  console.log("documentHeight " + documentHeight);
  console.log("windowHeight " + windowHeight);
  console.log("destinationOffset " + destinationOffset);
  console.log("destinationOffsetToScroll " + destinationOffsetToScroll);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    var now = 'now' in window.performance ? performance.now() : new Date().getTime();
    var time = Math.min(1, (now - startTime) / duration);
    var timeFunction = easings[easing](time);
    window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));

    if (window.pageYOffset === destinationOffsetToScroll) {
      if (callback) {
        callback();
      }
      return;
    }
    
    requestAnimationFrame(scroll);
  }
  
  scroll();
}