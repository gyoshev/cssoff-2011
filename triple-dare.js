$dom.closest = function(element, selector) {
    return $dom.is(element, selector) ? element : $dom.ancestor(element,selector);
};

$dom.siblings = function(element) {
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

$dom.onclick = function(elements, handler) {
    var handlerProxy = function(e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return handler(e);
    };

    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = handlerProxy;
    }
};

$dom.onready(function() {
    var obstacles = $dom.get("#obstacles a");

    $dom.onclick(obstacles, function(e) {
        e.preventDefault();

        var container = $dom.closest(e.target, "a"),
            img = $dom.descendants(container, "img");

        // change container styles
        var siblings = $dom.siblings(container.parentNode)
        for (var i = 0; i< siblings.length; i++) {
            $dom.removeClass(siblings[i], "selected");
        }
        $dom.addClass(container.parentNode, "selected");

        var info = $dom.get("#obstacles div.column")[0];

        // change image
        $dom.descendants(info, "img")[0].src = img[0].src.replace(/\.png$/i, "_460.png");

        // change text
        $dom.descendants(info, "h3")[0].innerHTML = img[0].alt;
        $dom.descendants(info, "h4")[0].innerHTML = $dom.descendants(container, ".description")[0].innerHTML;

        return false;
    });
});
