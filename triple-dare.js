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

        var container = $dom.ancestor(e.target, "a"),
            img = $dom.descendants(container, "img");

        // change container
        console.log($dom.siblings(container.parentNode));
        $dom.addClass(container.parentNode, "selected");
        $dom.removeClass($dom.siblings(container.parentNode), "selected");

        // change image
        $dom.get("#obstacles div.column img")[0].src = img[0].src.replace(/\.png$/i, "_460.png");

        return false;
    });
});
