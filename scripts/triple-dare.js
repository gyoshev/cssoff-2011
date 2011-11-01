(function($) {
    $.closest = function(element, selector) {
        return $.is(element, selector) ? element : $.ancestor(element,selector);
    };

    $.each = function(elements, handler) {
        for (var i = 0; i < elements.length; i++) {
            handler.call(elements[i], i);
        }
    };

    $.siblings = function(element) {
        var result = [],
            currentElement = element.parentNode.lastChild;

        while (currentElement) {
            if (currentElement.nodeType == 1 && currentElement != element) {
                result.push(currentElement);
            }

            currentElement = currentElement.previousSibling;
        }

        return result.reverse();
    };

    $.onclick = function(elements, handler) {
        var handlerProxy = function(e) {
            e = e || window.event;
            if (!e.target) e.target = e.srcElement;
            if (!e.preventDefault) e.preventDefault = function() { e.cancelBubble = true; };
            return handler(e);
        };

        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].onclick = handlerProxy;
        }
    };

    $.getStyle = function(element, property) {
        var view = document.defaultView;

        if (element.currentStyle) {
            return element.currentStyle[property];
        } else if (view && view.getComputedStyle) {
            return view.getComputedStyle(element, "")[property];
        }
    };

    // FitText by Dave Rupert, adapted to $dom environment
    // original: https://github.com/davatron5000/FitText.js/blob/master/jquery.fittext.js
    $.fitText = function fitText(elements, compressor, options) {
        var minFontSize = (options && options.minFontSize) || Number.NEGATIVE_INFINITY,
            maxFontSize = (options && options.minFontSize) || Number.POSITIVE_INFINITY;

        compressor = compressor || 1;

        function resizer() {
            $.each(elements, function() {
                this.style.fontSize = Math.max(Math.min(
                        this.offsetWidth / (compressor*10),
                        parseFloat(maxFontSize)),
                        parseFloat(minFontSize)
                    ) + "px";
            });
        }

        resizer();

        if (!fitText.handlers) {
            fitText.handlers = [];
        }

        fitText.handlers.push(resizer);
    };

    window.onresize = function() {
        var handlers = $.fitText.handlers;
        if (handlers) {
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i]();
            }
        }
    };

    // 139bytes requestAnimFrame -- https://gist.github.com/997619
    var requestAnimationFrame = function(a,b){while(a--&&!(b=this["oR0msR0mozR0webkitR0r".split(0)[a]+"equestAnimationFrame"]));return b||function(a){setTimeout(a,15)}}(5)

    // Robert Penner cubic easeOut easing function
    function easeOut(t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    }

    $.animate = function(element, property, endValue, interval) {
        var startValue = element[property],
            startTime = +new Date(),
            endTime = startTime + interval;

        requestAnimationFrame(function draw(t) {
            t = t || +new Date();

            if (t > startTime + interval) {
                element[property] = endValue;
            } else {
                element[property] = easeOut(t - startTime, startValue, endValue - startValue, interval);
                requestAnimationFrame(draw);
            }
        });
    };

    var TripleDare = {
        initObstacles: function() {
            // obstacles
            var obstacles = $.get("#obstacles a");

            $.onclick(obstacles, function(e) {
                e.preventDefault();

                var descendants = $.descendants,
                    container = $.closest(e.target, "a"),
                    img = $.descendants(container, "img");

                // change container styles
                $.each($.siblings(container.parentNode), function() {
                    $.removeClass(this, "selected");
                });

                $.addClass(container.parentNode, "selected");

                var info = $.get("#obstacles div.column")[0];

                // change image
                descendants(info, "img")[0].src = img[0].src.replace(/\.png$/i, ".jpg");

                // change text
                descendants(info, "h3")[0].innerHTML = img[0].alt;
                descendants(info, "h4")[0].innerHTML = descendants(container, ".description")[0].innerHTML;

                return false;
            });
        },
        initClock: function() {
            var clock = $.get("#clock")[0];

            function pad(i) {
                return i < 10 ? "0" + i : i;
            }

            var secondsInterval = setInterval(function() {
                var secondsNode = clock.firstChild,
                    secondsRemaining = +secondsNode.nodeValue - 1;

                if (secondsRemaining == 0) {
                    clearInterval(secondsInterval);

                    // enable blinking
                    setInterval(function() {
                        secondsNode.nodeValue = secondsNode.nodeValue == "00" ? "" : "00";
                    }, 500);
                }

                secondsNode.nodeValue = pad(secondsRemaining);
            }, 1000);
        },
        initSelectBoxes: function() {
            function onChangeHandler(e) {
                var select = e.target || e.srcElement,
                    wrap = select.parentNode;

                wrap.removeChild(select.nextSibling);
                wrap.insertBefore(document.createTextNode(select.value), wrap.lastChild);
            }

            $.each($.get("select"), function() {
                var wrap = $.create("div.select");
                this.parentNode.insertBefore(wrap, this);

                wrap.style.width = this.offsetWidth + "px";
                wrap.style.height = this.offsetHeight + "px";
                wrap.style.marginRight = $.getStyle(this, "marginRight");

                wrap.appendChild(this);
                wrap.appendChild(document.createTextNode(this.value));
                wrap.appendChild($.create("span.arrow"));

                this.onchange = onChangeHandler;
                this.onkeyup = onChangeHandler;
            });
        },
        initScrollableNavigation: function() {
            if (history.pushState) {
                $.onclick($.get("nav a"), function(e) {
                    e.preventDefault();
                    var hash = e.target.getAttribute("href", 2);
                    history.pushState({}, window.title, hash);
                    $.animate(document.body, "scrollTop", $.get(hash)[0].offsetTop, 500);
                    $.animate(document.documentElement, "scrollTop", $.get(hash)[0].offsetTop, 500);
                });
            }
        },
        initFitText: function() {
            //$.fitText($.get("h1"), 1.807692307692308);
            //$.fitText($.get(".airing"), 4.272727272727273);
        }
    };

    $.onready(function() {
        TripleDare.initObstacles();
        TripleDare.initClock();
        TripleDare.initSelectBoxes();
        TripleDare.initFitText();
        TripleDare.initScrollableNavigation();
    });
})($dom);
