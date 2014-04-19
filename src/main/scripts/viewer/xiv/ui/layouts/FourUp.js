/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.string');
goog.require('goog.array');

// moka
goog.require('moka.string');

// xiv
goog.require('xiv.ui.layouts.XyzvLayout');



/**
 * xiv.ui.layouts.FourUp
 *
 * @constructor
 * @extends {xiv.ui.layouts.XyzvLayout}
 */
goog.provide('xiv.ui.layouts.FourUp');
xiv.ui.layouts.FourUp = function() { 
    goog.base(this); 
}
goog.inherits(xiv.ui.layouts.FourUp, xiv.ui.layouts.XyzvLayout);
goog.exportSymbol('xiv.ui.layouts.FourUp', xiv.ui.layouts.FourUp);



/**
 * @type {!string}
 * @public
 */
xiv.ui.layouts.FourUp.TITLE = 'Four-Up';



/**
 * Event types.
 * @enum {string}
 * @public
 */
xiv.ui.layouts.FourUp.EventType = {}



/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ui.layouts.FourUp.ID_PREFIX =  'xiv.ui.layouts.FourUp';



/**
 * @enum {string}
 * @public
 */
xiv.ui.layouts.FourUp.CSS_SUFFIX = {
    X: 'x',
    Y: 'y',
    Z: 'z',
    V: 'v'
}



/**
 * @type {!number} 
 * @const
 */
xiv.ui.layouts.FourUp.MIN_PLANE_WIDTH = 20;



/**
 * @type {!number} 
 * @const
 */
xiv.ui.layouts.FourUp.MIN_PLANE_HEIGHT = 20;



/**
 * @inheritDoc
 */
xiv.ui.layouts.FourUp.prototype.setupLayoutFrame_X = function(){
    goog.base(this, 'setupLayoutFrame_X');

    //
    // Set the plane resizable
    //
    this.setLayoutFrameResizable('X', ['RIGHT', 'TOP', 'TOP_RIGHT']);

    //
    // Listen for the RESIZE event.
    //
    goog.events.listen(this.LayoutFrames['X'].getResizable(), 
		       moka.ui.Resizable.EventType.RESIZE,
		       this.onLayoutFrameResize_X.bind(this));

    goog.events.listen(this.LayoutFrames['X'].getResizable(), 
		       moka.ui.Resizable.EventType.RESIZE_END,
		       this.updateStyle.bind(this));
}



/**
 * @override
 * @param {!Event} e
 */
xiv.ui.layouts.FourUp.prototype.onLayoutFrameResize_X = function(e){

    var planePos = goog.style.getPosition(this.LayoutFrames['X'].getElement());
    var planeSize = goog.style.getSize(this.LayoutFrames['X'].getElement());


    //
    // Y PLANE
    //
    goog.style.setPosition(
	this.LayoutFrames['Y'].getElement(), 
	planeSize.width,
	planePos.y);
    goog.style.setSize(
	this.LayoutFrames['Y'].getElement(), 
	this.currSize.width - planeSize.width,
	planeSize.height);


    //
    // Z PLANE
    //
    goog.style.setPosition(
	this.LayoutFrames['Z'].getElement(), 0, 0);
    goog.style.setSize(
	this.LayoutFrames['Z'].getElement(), planeSize.width, planePos.y);



    //
    // V PLANE
    //
    goog.style.setPosition( this.LayoutFrames['V'].getElement(), 
			    planeSize.width, 0);
    goog.style.setSize(this.LayoutFrames['V'].getElement(), 
	this.currSize.width - planeSize.width, planePos.y);


    //
    // CHEAT Make the X RIGHT handle 100% of the height
    //
    var xRightHandle = 
	this.LayoutFrames['X'].getResizable().getResizeDragger('RIGHT').getHandle();
    xRightHandle.style.top = '0px';
    xRightHandle.style.height = (this.currSize.height).toString() + 'px';


    //
    // Required!
    //
    this.dispatchResize();
}



/**
* @inheritDoc
*/
xiv.ui.layouts.FourUp.prototype.updateStyle = function(){
    goog.base(this, 'updateStyle');
    this.updateStyle_X();
}


/**
 * @inheritDoc
 */
xiv.ui.layouts.FourUp.prototype.updateStyle_X = function() {
    //
    // Boundary
    //
    goog.style.setPosition(
	this.LayoutFrames['X'].getResizable().getBoundaryElement(), 
	this.minLayoutFrameWidth_, this.minLayoutFrameHeight_);

    goog.style.setSize(
	this.LayoutFrames['X'].getResizable().getBoundaryElement(), 
	this.currSize.width - this.minLayoutFrameWidth_ * 2,
	this.currSize.height - this.minLayoutFrameHeight_ * 2);

    //
    // Make the X TOP handle 100% of the width
    //
    var xTopHandle = 
	this.LayoutFrames['X'].getResizable().getResizeDragger('TOP').getHandle();
    xTopHandle.style.left = '0px';
    xTopHandle.style.width = (this.currSize.width).toString() + 'px';


    //
    // IMPORTANT!!!
    //
    this.LayoutFrames['X'].getResizable().update();


    //
    // CHEAT Make the X RIGHT handle 100% of the height
    //
    var xRightHandle = 
	this.LayoutFrames['X'].getResizable().getResizeDragger('RIGHT').getHandle();
    xRightHandle.style.top = '0px';
    xRightHandle.style.height = (this.currSize.height).toString() + 'px';
}



/**
* @inheritDoc
*/
xiv.ui.layouts.FourUp.prototype.disposeInternal = function(){
    goog.base(this, 'disposeInternal');
    
}