//array of common CSS properties
const COMMON_STYLE_PROPERTIES = ["background", "background-color", "background-image", "background-position", "background-repeat", "background-size", "border", "border-radius", "bottom", "box-shadow", "box-sizing", "clear", "color", "display", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-family", "font-size", "font-weight", "height", "left", "line-break", "line-height", "list-style", "margin-bottom", "margin-left", "margin-right", "margin-top", "max-height", "max-width", "min-height", "min-width", "opacity", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding-bottom", "padding-left", "padding-right", "padding-top", "position", "right", "table-layout", "text-align", "text-decoration", "text-transform", "top", "transform", "vertical-align", "visibility", "white-space", "width", "word-break", "word-wrap", "z-index"];

//default values for common CSS properties
const DEFAULT_VALUES = {'height': 'auto', 'width': 'auto', 'font-size': 'medium', 'background-color': 'rgba(0, 0, 0, 0);', 'line-height': 'normal', 'border': 'medium none', 'border-radius': '0', 'display': '?', 'position': 'static', 'top': 'auto', 'bottom': 'auto', 'left': 'auto', 'right': 'auto', 'margin-top': '0px', 'margin-bottom': '0px', 'margin-right': '0px', 'margin-left': '0px', 'padding-top': '0px', 'padding-bottom': '0px', 'padding-right': '0px', 'padding-left': '0px', 'float': 'none', 'clear': 'none', 'background-image': 'none', 'background-size': 'auto', 'background-repeat': 'repeat', 'background-position': '0% 0%', 'box-sizing': 'content-box', 'text-decoration': 'none', 'list-style': 'disc outside none', 'text-transform': 'none', 'transform': 'none', 'vertical-align': 'baseline', 'opacity': '1', 'font-weight': 'normal', 'box-shadow': 'none', 'word-wrap': 'normal', 'white-space': 'normal', 'flex': '0 1 auto', 'flex-basis': 'auto', 'flex-direction': 'row', 'flex-flow': 'row nowrap', 'flex-grow': '0', 'flex-shrink': '1', 'flex-wrap': 'nowrap', 'max-height': 'none', 'max-width': 'none', 'min-height': '0px', 'min-width': '0px', 'overflow': 'visible', 'overflow-x': 'visible', 'overflow-y': 'visible', 'overflow-wrap' : 'normal', 'table-layout': 'auto', 'visibility': 'visible', 'z-index': 'auto', 'word-break': 'normal', 'line-break': 'auto'};

//try to write a specific selector for a particular element
//jQuery("selector").getElementSelector();
jQuery.fn.extend({
  getElementSelector: function() {
    const element = jQuery(this);
    var selector = element.get(0).nodeName.toLowerCase();

    if (typeof element.attr('id') !== 'undefined') {
      selector += ('#' + element.attr('id'));
    }

    if (typeof element.attr('class') !== 'undefined') {
      let classes = element.attr('class').replace(/\s/g, '.');
      selector += ('.' + classes);
    }

    return selector;
  },
  getElementSelectorWithParents: function() {
    var selector = '';
    const element = jQuery(this);
    const parents = element.parents();

    for (var i = (parents.length - 1); i > -1; i--) {
      let currentElement = parents.eq(i);
      let currentNodeName = currentElement.get(0).nodeName.toLowerCase();
      if (currentNodeName && (currentNodeName !== 'body' && currentNodeName !== 'html')) {
        selector += ' ' + currentElement.getElementSelector();
      }
    }
    return selector + ' ' + element.getElementSelector();
  }
});

//output styles for an element in a CSS-like way
function getElementCSS(selector) {
  var styleString = selector + ' {\n';

  for (var i = 0; i < COMMON_STYLE_PROPERTIES.length; i++) {
    let thisProperty = COMMON_STYLE_PROPERTIES[i];
    let thisStyle = jQuery(selector).css(thisProperty);
    let defaultValue = DEFAULT_VALUES[thisProperty];

    if (typeof defaultValue === 'undefined' || thisStyle !== defaultValue) {
      styleString += ('\t' + thisProperty + ': ' + thisStyle + ';\n');
    }
  }

  styleString += '}\n';

  console.log(styleString);
}

//output an element's styles in an inline fashion
function getElementInlineStyles(selector) {
  var styleString = 'style=\"';

  for (var i = 0; i < COMMON_STYLE_PROPERTIES.length; i++) {
    let thisProperty = COMMON_STYLE_PROPERTIES[i];
    let thisStyle = jQuery(selector).css(thisProperty);
    let defaultValue = DEFAULT_VALUES[thisProperty];

    if (typeof defaultValue === 'undefined' || thisStyle !== defaultValue) {
      styleString += (thisProperty + ': ' + thisStyle.replace(/\"/g, '\'') + '; ');
    }
  }
  styleString += '\"'
  console.log(styleString);
}

//output the styles for all of an element's descendants in a CSS-like way
function getDescendantStyles(selector, withParents) {
  const descendants = jQuery(selector).find('*');
  var alreadyPrinted = {};

  descendants.each(function(i) {
    let thisSelector = withParents ? descendants.eq(i).getElementSelectorWithParents() : descendants.eq(i).getElementSelector();

    if (!alreadyPrinted[thisSelector]) {
      console.log(getElementCSS(thisSelector));
      alreadyPrinted[thisSelector] = true;
    }
  });
}

//output the styles for an element AND all of its descendants in a CSS-like way
function getElementAndDescendantStyles(selector, withParents) {
  withParents = withParents || false;

  getElementCSS(selector);
  getDescendantStyles(selector, withParents);
}
