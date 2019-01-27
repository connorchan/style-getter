//array of common CSS properties
const COMMON_STYLE_PROPERTIES = ["background", "background-color", "background-image", "background-position", "background-repeat", "background-size", "border", "border-radius", "bottom", "box-shadow", "box-sizing", "clear", "color", "display", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-family", "font-size", "font-weight", "height", "left", "line-break", "line-height", "list-style", "margin-bottom", "margin-left", "margin-right", "margin-top", "max-height", "max-width", "min-height", "min-width", "opacity", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding-bottom", "padding-left", "padding-right", "padding-top", "position", "right", "table-layout", "text-align", "text-decoration", "text-transform", "top", "transform", "vertical-align", "visibility", "white-space", "width", "word-break", "word-wrap", "z-index"];

//default values for common CSS properties
const DEFAULT_VALUES = {'height': 'auto', 'width': 'auto', 'font-size': 'medium', 'background-color': 'rgba(0, 0, 0, 0)', 'line-height': 'normal', 'border': 'medium none', 'border-radius': '0px', 'display': '?', 'position': 'static', 'top': 'auto', 'bottom': 'auto', 'left': 'auto', 'right': 'auto', 'margin-top': '0px', 'margin-bottom': '0px', 'margin-right': '0px', 'margin-left': '0px', 'padding-top': '0px', 'padding-bottom': '0px', 'padding-right': '0px', 'padding-left': '0px', 'float': 'none', 'clear': 'none', 'background-image': 'none', 'background-size': 'auto', 'background-repeat': 'repeat', 'background-position': '0% 0%', 'box-sizing': 'content-box', 'text-decoration': 'none', 'list-style': 'disc outside none', 'text-transform': 'none', 'transform': 'none', 'vertical-align': 'baseline', 'opacity': '1', 'font-weight': 'normal', 'box-shadow': 'none', 'word-wrap': 'normal', 'white-space': 'normal', 'flex': '0 1 auto', 'flex-basis': 'auto', 'flex-direction': 'row', 'flex-flow': 'row nowrap', 'flex-grow': '0', 'flex-shrink': '1', 'flex-wrap': 'nowrap', 'max-height': 'none', 'max-width': 'none', 'min-height': '0px', 'min-width': '0px', 'overflow': 'visible', 'overflow-x': 'visible', 'overflow-y': 'visible', 'overflow-wrap' : 'normal', 'table-layout': 'auto', 'visibility': 'visible', 'z-index': 'auto', 'word-break': 'normal', 'line-break': 'auto'};

/**
* Try to write a specific selector for an element, using its id and classes when available
*
* @return {string} Attempted selector for a jQuery element
*/
jQuery.fn.extend({
  getElementSelector: function() {
    const element = jQuery(this);
    var selector = element.get(0).nodeName.toLowerCase();

    if (typeof element.attr('id') !== 'undefined' && element.attr('id') !== "") {
      selector += ('#' + element.attr('id'));
    }

    if (typeof element.attr('class') !== 'undefined') {
      let classes = jQuery.trim(element.attr('class'));
      if (classes !== "") {
          classes = classes.replace(/\s/g, '.');
          selector += ('.' + classes);
      }
    }

    return jQuery.trim(selector);
  },
  /**
  * Try to write a selector for a given element in the context of its parents
  *
  * @return {string} Attempted selector for a jQuery element
  */
  getElementSelectorWithParents: function() {
    var selector = '';
    const element = jQuery(this);
    const parents = element.parents();

    for (var i = (parents.length - 1); i > -1; i--) {
      let currentElement = parents.eq(i);
      let currentNodeName = currentElement.get(0).nodeName.toLowerCase();
      if (currentNodeName && (currentNodeName !== 'body' && currentNodeName !== 'html')) {
        selector +=  (selector.length > 0) ? ' > ' : ' ';
        selector += currentElement.getElementSelector();
      }
    }
    return jQuery.trim(selector + ' > ' + element.getElementSelector());
  }
});

/**
* Takes in a string representing style output, concatenates new styles to it, then returns it.
*
* @param {boolean} getInline true if the output is inline, false or undefined for default CSS-like output
* @param {string} styleString String containing the style output
* @param {string} property Property to be appended to the output string
* @param {string} style Style to be appended to the output string
* @return {string} The updated styleString output
*/
function concatenateStyleString(getInline, styleString, property, style) {
  getInline ? (styleString += (property + ': ' + style.replace(/\"/g, '\'') + '; ')) : (styleString += ('\t' + property + ': ' + style + ';\n'));
  return styleString;
}

/**
* Outputs styles for an element in either a CSS-like way, or inline
*
* @param {string} selector The selector of the root element whose styles you want
* @param {boolean} getInline true to print the style as an inline style attribute, false or undefined to output like CSS
*/
function getElementStyles(selector, getInline) {
  getInline = getInline || false;
  var styleString = getInline? 'style=\"' : (selector + ' {\n');

  for (var i = 0; i < COMMON_STYLE_PROPERTIES.length; i++) {
    let thisProperty = COMMON_STYLE_PROPERTIES[i];
    let thisStyle = jQuery(selector).css(thisProperty);
    let defaultValue = DEFAULT_VALUES[thisProperty];

    if ((typeof defaultValue === 'undefined' || thisStyle !== defaultValue) && thisStyle !== '') {
      switch (thisProperty) {
        case 'border':
        if (thisStyle && thisStyle.indexOf('0px none') === -1) {
          styleString = concatenateStyleString(getInline, styleString, thisProperty, thisStyle);
        }
          break;
        case 'background':
          if (thisStyle && thisStyle.indexOf('rgb') === -1 && thisStyle.indexOf('none repeat scroll') === -1) {
            styleString = concatenateStyleString(getInline, styleString, thisProperty, thisStyle);
          }
          break;
        case 'text-decoration':
          if (thisStyle && thisStyle.indexOf('none solid') === -1) {
            styleString = concatenateStyleString(getInline, styleString, thisProperty, thisStyle);
          }
          break;
        default:
          styleString = concatenateStyleString(getInline, styleString, thisProperty, thisStyle);
      }
    }
  }

  getInline ? (styleString = jQuery.trim(styleString) + '\"') : (styleString += '}\n');

  console.log(styleString);
}

/**
* Outputs the styles for all of an element's descendants in a CSS-like way
*
* @param {string} selector The selector of the root element whose styles you want
* @param {boolean} withParents Optional — true to output selectors in context of their parents, false or undefined otherwise
*/
function getDescendantStyles(selector, withParents) {
  const descendants = jQuery(selector).find('*');
  var alreadyPrinted = {};

  descendants.each(function(i) {
    let thisSelector = withParents ? descendants.eq(i).getElementSelectorWithParents() : descendants.eq(i).getElementSelector();

    if (!alreadyPrinted[thisSelector]) {
      console.log(getElementStyles(thisSelector));
      alreadyPrinted[thisSelector] = true;
    }
  });
}

/**
* Outputs the styles of an element AND all of its descendants in a CSS-like way
*
* @param {string} selector The selector of the root element whose styles you want
* @param {boolean} withParents Optional — true to output selectors in context of their parents, false or undefined otherwise
*/
function getElementAndDescendantStyles(selector, withParents) {
  withParents = withParents || false;

  getElementStyles(selector);
  getDescendantStyles(selector, withParents);
}
