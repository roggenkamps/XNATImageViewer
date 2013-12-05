/** 
* @author amh1646@rit.edu (Amanda Hartung)
* @author sunilk@mokacreativellc.com (Sunil Kumar)
*/

/**
 * Google closure includes
 */

/**
 * utils includes
 */


/**
 * viewer-widget includes
 */
goog.require('XnatViewerWidget');
goog.require('XnatViewerGlobals');




/**
 * Thumbnail is the parent class of Slicer and Dicom thumbnails.
 *
 * @constructor
 * @param {Object, Object=}
 * @extends {XnatViewerWidget}
 */
goog.provide('Thumbnail');
Thumbnail = function (properties, opt_args) {

    var that = this;
    XnatViewerWidget.call(this, utils.dom.mergeArgs(opt_args, {'id' : 'Thumbnail'}));



    //------------------
    // Properties object
    //------------------    
    this._properties = properties;



    //------------------
    // Image
    //------------------
    this._image = new Image();
    this._image.src = this._properties['thumbnailImageSrc'];
    this._element.appendChild(this._image)

    
    
    //------------------
    // Add displayText element
    //------------------
    this._displayText = utils.dom.makeElement("div", this._element, "DisplayText");



    //------------------
    // Set _displayText
    //------------------
    var headerText = '';
    switch(this._properties['category'].toLowerCase())
    {
    case 'dicom':
	headerText = "Scan " + this._properties['sessionInfo']["Scan"]['value'];
	break;
    case 'slicer':
	headerText = this._properties['Name'].split(".")[0];
	break;
    }



    //------------------
    // Other metadata queries
    //------------------
    this._displayText.innerHTML += "<b><font size = '3'>" + headerText  + "</font></b><br>";
    this._displayText.innerHTML += this._properties['sessionInfo']["Format"]['value'].toString().toUpperCase()  + "<br>";
    this._displayText.innerHTML += 'Expt: ' + this._properties['sessionInfo']['experiments'];



    //------------------
    // Set Hover Methods
    //------------------
    this.setHoverListeners(true);
	
    

    //------------------
    // Call defaults
    //------------------
    that.setHovered(false);



    //------------------
    // Set Styles
    //------------------
    goog.dom.classes.set(this._element, Thumbnail.ELEMENT_CLASS);
    goog.dom.classes.set(this._image, Thumbnail.IMAGE_CLASS);
    goog.dom.classes.set(this._displayText, Thumbnail.TEXT_CLASS);


    
    //------------------
    // Set image onload
    //------------------
    this._image.onload = function () {	
	if (that._onloadCallbacks) {
	    goog.array.forEach(that._onloadCallbacks, function (callback) { callback(); })	
	}
    }
}
goog.inherits(Thumbnail, XnatViewerWidget);
goog.exportSymbol('Thumbnail', Thumbnail);




Thumbnail.CSS_CLASS_PREFIX = /**@type {string} @const*/ goog.getCssName('xiv-thumbnail');
Thumbnail.ELEMENT_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.CSS_CLASS_PREFIX, '');
Thumbnail.IMAGE_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.CSS_CLASS_PREFIX, 'image');
Thumbnail.TEXT_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.CSS_CLASS_PREFIX, 'displaytext');
Thumbnail.DRAGGING_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.CSS_CLASS_PREFIX, 'dragging');
Thumbnail.SELECTED_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.CSS_CLASS_PREFIX, 'selected');
Thumbnail.ELEMENT_MOUSEOVER_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.ELEMENT_CLASS, 'mouseover');
Thumbnail.IMAGE_MOUSEOVER_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.IMAGE_CLASS, 'mouseover');
Thumbnail.TEXT_MOUSEOVER_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.TEXT_CLASS, 'mouseover');
Thumbnail.ELEMENT_ACTIVE_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.ELEMENT_CLASS, 'highlight');
Thumbnail.ELEMENT_ACTIVE_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.ELEMENT_CLASS, 'active');
Thumbnail.IMAGE_ACTIVE_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.IMAGE_CLASS, 'active');
Thumbnail.TEXT_ACTIVE_CLASS = /**@type {string} @const*/ goog.getCssName(Thumbnail.TEXT_CLASS, 'active');




/**
 * @type {?Object}
 * @const
 */
Thumbnail.prototype._properties = null;




/**
 * @type {?Image}
 * @protected
 */	
Thumbnail.prototype._image = null;




/**
 * @type {?Element}
 * @protected
 */	
Thumbnail.prototype._displayText = null;




/**
* @type {Object=}
* @private
*/
Thumbnail.prototype.hoverMethods_ = {}




/**
* @type {boolean}
* @private
*/
Thumbnail.prototype.isActive_ = false;




/**
* @type {Array}
* @protected
*/
Thumbnail.prototype._activatedCallbacks = [];




/**
 * @type {Array}
 * @protected
 */
Thumbnail.prototype._activatedCallbacks = [];





/**
 * Sets the thumbnail state to 'active'.  Applies the appropriate 
 * CSS for style changes.
 *
 * @param {boolean, boolean=} active Active state, opt_highlight_bg 
 * whether or not to highlight the background (false if it pertains
 * to thumbnails that have been dropped in a viewer).
 */
Thumbnail.prototype.setActive = function(active, opt_highlight_bg) {

    //utils.dom.debug("setActive", active, opt_highlight_bg);
    var that = this
    this.isActive_ = active;
    if (this.isActive_){
	if (opt_highlight_bg !== false) { goog.dom.classes.add(that._element, Thumbnail.ELEMENT_HIGHLIGHT_CLASS); }
	goog.dom.classes.add(that._element, Thumbnail.ELEMENT_ACTIVE_CLASS);
	goog.dom.classes.add(that._displayText, Thumbnail.TEXT_ACTIVE_CLASS);		
	goog.dom.classes.add(that._image, Thumbnail.IMAGE_ACTIVE_CLASS);		
	
    } else {
	goog.dom.classes.remove(that._element, Thumbnail.ELEMENT_HIGHLIGHT_CLASS);
	goog.dom.classes.remove(that._element, Thumbnail.ELEMENT_ACTIVE_CLASS);			
	goog.dom.classes.remove(that._displayText, Thumbnail.TEXT_ACTIVE_CLASS);		
	goog.dom.classes.remove(that._image, Thumbnail.IMAGE_ACTIVE_CLASS);
    }
}




/**
* @return {boolean}
*/
Thumbnail.prototype.getActive = function() {
    return this.isActive_;	
}




/**
* @return {Array.<string>}
*/
Thumbnail.prototype.getFiles = function() {
    return this._properties.files;	
}





/**
 * Applies the classes to the various objects when the mouse
 * hovers over the Thumbnail.
 *
 * @type {function(boolean)}
 * @private
 */
Thumbnail.prototype.setHovered = function(hovered) {
    var that = this;
    if (hovered){
	goog.dom.classes.add(that._element, Thumbnail.ELEMENT_MOUSEOVER_CLASS);			
	goog.dom.classes.add(that._displayText, Thumbnail.TEXT_MOUSEOVER_CLASS);		
	goog.dom.classes.add(that._image, Thumbnail.IMAGE_MOUSEOVER_CLASS);		
	
    } else {
	goog.dom.classes.remove(that._element, Thumbnail.ELEMENT_MOUSEOVER_CLASS);			
	goog.dom.classes.remove(that._displayText, Thumbnail.TEXT_MOUSEOVER_CLASS);		
	goog.dom.classes.remove(that._image, Thumbnail.IMAGE_MOUSEOVER_CLASS);
    }
}




/**
 * Sets the listener events for when the thumbnail is hovered on.
 *
 * @type {function(boolean)}
 * @private
 */
Thumbnail.prototype.setHoverListeners = function(set) {
    var that = this;
    var mouseover = function() { that.setHovered(true) };
    var mouseout = function() { that.setHovered(false) };

    if (set) {
	goog.events.listen(this._element, goog.events.EventType.MOUSEOVER, mouseover);
	goog.events.listen(this._element, goog.events.EventType.MOUSEOUT, mouseout);
    } else {
	goog.events.unlisten(this._element, goog.events.EventType.MOUSEOVER, mouseover);
	goog.events.unlisten(this._element, goog.events.EventType.MOUSEOUT, mouseout);
    }
}




/**
 * Callback array for when the thumbnail is activated.
 *
 * @type {function(function)}
 */
Thumbnail.prototype.addActivatedCallback = function (callback) {
    this._activatedCallbacks.push(callback)
}




/**
 * Clones the thumbnail to create a draggable element.
 *
 * @param {Element}
 */
Thumbnail.prototype.createDragElement = function(sourceEl) {
    var elt =  goog.dom.createDom('div', 'foo', 'Custom drag element');
    elt.style.color = "rgba(255,0,0,1)";
    elt.style.backgroundColor = "rgba(255,200,0,1)";
    elt.style.width = '200px';
    elt.style.height = '200px';
    
};