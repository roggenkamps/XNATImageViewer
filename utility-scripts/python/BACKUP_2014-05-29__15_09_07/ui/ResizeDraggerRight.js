/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 * @author unkown email (uchida)
 */

// goog


// nrg
goog.require('nrg.ui.ResizeDragger');




/**
 * @constructor
 * @extends {nrg.ui.ResizeDragger}
 * @param {!Element} resizee The element that will be resized.
 */
goog.provide('goog.ui.ResizeDraggerRight');
nrg.ui.ResizeDraggerRight = function(resizee) {
    goog.base(this, 'right', resizee);
};
goog.inherits(nrg.ui.ResizeDraggerRight, nrg.ui.ResizeDragger);
goog.exportSymbol('nrg.ui.ResizeDraggerRight', nrg.ui.ResizeDraggerRight);



/**
 * @type {!string} 
 * @const
 */
nrg.ui.ResizeDraggerRight.ID_PREFIX =  'nrg.ui.ResizeDraggerRight';



/**
 * @enum {string} 
 * @const
 */ 
nrg.ui.ResizeDraggerRight.CSS_SUFFIX = {}



/**
 * @public
 */
nrg.ui.ResizeDraggerRight.calculateDraggerLimits = function() {
    this.draggerLimitLeft = this.resizeePos.left + this.minSize.width + 
	this.horizDraggerOffset; 
    this.draggerLimitRight = this.boundaryPos.right + this.horizDraggerOffset; 
    this.draggerLimitWidth = this.draggerLimitRight -  this.draggerLimitLeft;
}
goog.exportSymbol('nrg.ui.ResizeDraggerRight.calculateDraggerLimits', 
		  nrg.ui.ResizeDraggerRight.calculateDraggerLimits);



/**
 * @public
 */
nrg.ui.ResizeDraggerRight.resizeMethod = function() {
    //
    // Calculate the deltaX
    // 
    var deltaX = (this.isAnimating) ? 
	// when animating (slightly more involved calculation)
        this.handlePos.x - this.resizeePos.right + this.horizDraggerOffset : 	
        // when dragging (slightly less involved calculation)
	this.Dragger.clientX - this.Dragger.startX;
    var width = this.resizeeSize.width + deltaX;

    //
    // Resize
    //
    goog.style.setWidth(this.resizee, Math.min(
	// At least minwidth
	Math.max(width, this.minSize.width),
	// At max the boundary width
	this.boundarySize.width))
    

    //
    // For safety, make sure handle is the same top as the element
    //
    //goog.style.setPosition(this.getElement(), this.handlePos.x,
    //this.resizeePos.y)
}
goog.exportSymbol('nrg.ui.ResizeDraggerRight.resizeMethod', 
		  nrg.ui.ResizeDraggerRight.resizeMethod);




/**
 * @inheritDoc
 */ 
nrg.ui.ResizeDraggerRight.prototype.update = function(updateDims) {
    //
    // Do nothing if dragging or animating.
    //
    if (this.Dragger.isDragging() ||  this.isAnimating) {return};

    //
    // Call superclass
    //
    goog.base(this, 'update', updateDims);

    //
    // Reset limits
    //
    this.Dragger.setLimits(new goog.math.Rect(
	// X
	this.draggerLimitLeft, 
	// Y
	this.resizeePos.y, 
	// W
	this.draggerLimitWidth,
	// H
	0
    ))

    //
    // Set the left of the dragger
    //
    goog.style.setPosition(this.getElement(), 
			   this.resizeePos.right + this.horizDraggerOffset,
			   this.resizeePos.y);

    //
    // Set the height of the dragger
    //
    goog.style.setHeight(this.getElement(), this.resizeeSize.height);
}



/**
 * inheritDoc
 */
nrg.ui.ResizeDraggerRight.prototype.getSlideTrajectory = function(limitType) {
    goog.base(this, 'getSlideTrajectory');
    return {
	//
	// Start coordinate is the same
	//
	start: new goog.math.Coordinate(this.handlePos.x, this.handlePos.y),

	//
	// End coordinate
	//
	end: (limitType == 'MIN') ? 
	    new goog.math.Coordinate(this.draggerLimitLeft, this.handlePos.y) 
	    :
	    new goog.math.Coordinate(this.draggerLimitRight, this.handlePos.y)
    }
}
