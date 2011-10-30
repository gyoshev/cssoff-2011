(function($) {
    $.closest = function(element, selector) {
        return $dom.is(element, selector) ? element : $dom.ancestor(element,selector);
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
            e.target = e.target || e.srcElement;
            return handler(e);
        };

        for (var i = 0, len = elements.length; i < len; i++) {
            elements[i].onclick = handlerProxy;
        }
    };

    $.onready(function() {
        // obstacles
        var obstacles = $.get("#obstacles a");

        $.onclick(obstacles, function(e) {
            e.preventDefault();

            var descendants = $.descendants,
                container = $.closest(e.target, "a"),
                img = $.descendants(container, "img");

            // change container styles
            var siblings = $.siblings(container.parentNode)
            for (var i = 0; i < siblings.length; i++) {
                $.removeClass(siblings[i], "selected");
            }

            $.addClass(container.parentNode, "selected");

            var info = $.get("#obstacles div.column")[0];

            // change image
            descendants(info, "img")[0].src = img[0].src.replace(/\.png$/i, "_460.png");

            // change text
            descendants(info, "h3")[0].innerHTML = img[0].alt;
            descendants(info, "h4")[0].innerHTML = descendants(container, ".description")[0].innerHTML;

            return false;
        });

        // clock
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
    });
})($dom);
