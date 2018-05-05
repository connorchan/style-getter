const COMMON_STYLE_PROPERTIES = ['height', 'width', 'font-size', 'color', 'background-color', 'line-height', 'border', 'border-radius', 'display', 'position', 'top', 'bottom', 'left', 'right', 'margin-top', 'margin-bottom', 'margin-right', 'margin-left', 'padding-top', 'padding-bottom', 'padding-right', 'padding-left', 'float', 'clear', 'background', 'background-image', 'background-size', 'text-align', 'box-sizing', 'text-decoration', 'list-style', 'font', 'text-transform', 'transform', 'vertical-align', 'opacity', 'font-family', 'font-weight', 'box-shadow', 'word-wrap', 'white-space', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'line-break', 'max-height', 'max-width', 'min-height', 'min-width', 'overflow', 'overflow-wrap', 'overflow-x', 'overflow-y', 'table-layout', 'visibility', 'z-index', 'word-break', 'background-repeat', 'background-position'];

const DEFAULT_VALUES = {'height': 'auto', 'width': 'auto', 'font-size': 'medium', 'background-color': 'rgba(0, 0, 0, 0);', 'line-height': 'normal', 'border': 'medium none', 'border-radius': '0', 'display': '?', 'position': 'static', 'top': 'auto', 'bottom': 'auto', 'left': 'auto', 'right': 'auto', 'margin-top': '0px', 'margin-bottom': '0px', 'margin-right': '0px', 'margin-left': '0px', 'padding-top': '0px', 'padding-bottom': '0px', 'padding-right': '0px', 'padding-left': '0px', 'float': 'none', 'clear': 'none', 'background-image': 'none', 'background-size': 'auto', 'background-repeat': 'repeat', 'background-position': '0% 0%', 'box-sizing': 'content-box', 'text-decoration': 'none', 'list-style': 'disc outside none', 'text-transform': 'none', 'transform': 'none', 'vertical-align': 'baseline', 'opacity': '1', 'font-weight': 'normal', 'box-shadow': 'none', 'word-wrap': 'normal', 'white-space': 'normal', 'flex': '0 1 auto', 'flex-basis': 'auto', 'flex-direction': 'row', 'flex-flow': 'row nowrap', 'flex-grow': '0', 'flex-shrink': '1', 'flex-wrap': 'nowrap', 'max-height': 'none', 'max-width': 'none', 'min-height': '0px', 'min-width': '0px', 'overflow': 'visible', 'overflow-x': 'visible', 'overflow-y': 'visible', 'overflow-wrap' : 'normal', 'table-layout': 'auto', 'visibility': 'visible', 'z-index': 'auto', 'word-break': 'normal'};

jQuery.fn.extend({
  getElementSelector: function() {
    var element = jQuery(this);
    var selector = element.get(0).nodeName.toLowerCase();

    if (typeof element.attr('id') !== 'undefined') {
      selector += ('#' + element.attr('id'));
    }

    if (typeof element.attr('class') !== 'undefined') {
      let classes = element.attr('class').replace(/\s/g, '.');
      selector += ('.' + classes);
    }

    return selector;
  }
});

function getElementCSS(selector) {
  var styleString = selector + " {\n";

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

function getElementInlineStyles(selector) {
  var styleString = 'style: ';

  for (var i = 0; i < COMMON_STYLE_PROPERTIES.length; i++) {
    let thisProperty = COMMON_STYLE_PROPERTIES[i];
    let thisStyle = jQuery(selector).css(thisProperty);
    let defaultValue = DEFAULT_VALUES[thisProperty];

    if (typeof defaultValue === 'undefined' || thisStyle !== defaultValue) {
      styleString += (thisProperty + ': ' + thisStyle + '; ');
    }
  }
  console.log(styleString);
}

function getDescendantStyles(selector) {
  var rootSelector = jQuery(selector).getElementSelector();
  var descendants = jQuery(selector).find('*');
  var alreadyPrinted = {};

  descendants.each(function(i) {
    let thisSelector = descendants.eq(i).getElementSelector();
    if (!alreadyPrinted[thisSelector]) {
      console.log(getElementCSS(thisSelector));
      alreadyPrinted[thisSelector] = true;
    }
  });
}

function getElementAndDescendantStyles(selector) {
  getElementCSS(selector);
  getDescendantStyles(selector);
}
