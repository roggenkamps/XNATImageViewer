/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.object');

// xiv
goog.require('xiv.ui.ctrl.XtkController');
goog.require('xiv.ui.ctrl.DisplayAll');
goog.require('xiv.ui.ctrl.MasterOpacity');
goog.require('xiv.ui.ctrl.TwoThumbSliderController');
goog.require('xiv.ui.ctrl.ColorPaletteController');



/**
 *
 * @constructor
 * @extends {xiv.ui.ctrl.XtkController}
 */
goog.provide('xiv.ui.ctrl.MasterController3D');
xiv.ui.ctrl.MasterController3D = function() {
    goog.base(this);


    /**
     * @type {!Array.<X.Object>}
     * @private
     */
    this.xObjs_ = [];
}
goog.inherits(xiv.ui.ctrl.MasterController3D, xiv.ui.ctrl.XtkController);
goog.exportSymbol('xiv.ui.ctrl.MasterController3D', xiv.ui.ctrl.MasterController3D);


/**
 * @type {!string} 
 * @const
 * @expose
 */
xiv.ui.ctrl.MasterController3D.ID_PREFIX =  'xiv.ui.ctrl.MasterController3D';



/**
 * @enum {string}
 * @public
 */
xiv.ui.ctrl.MasterController3D.CSS_SUFFIX = {};



/**
 * @param {!X.Object} xObj
 * @public
 */
xiv.ui.ctrl.MasterController3D.prototype.add = function(xObj) {
    window.console.log('MASTER CONTROLLER ADDING', xObj);

    this.xObjs_.push(xObj);

    if (this.xObjs_.length == 1){

	goog.dom.append(document.body, this.getElement());
	var displayAll =  new xiv.ui.ctrl.DisplayAll();
	goog.events.listen(displayAll, 
			   xiv.ui.ctrl.XtkController.EventType.CHANGE, 
			   function(e){
			       window.console.log("CHECK!", e.checked);
			   })
	this.subControllers.push(displayAll);
	goog.dom.append(this.getElement(), displayAll.getElement());


	var masterOpacity = new xiv.ui.ctrl.MasterOpacity();
	this.subControllers.push(masterOpacity);
	goog.dom.append(this.getElement(), masterOpacity.getElement());


	var twoThumb = new xiv.ui.ctrl.TwoThumbSliderController();
	this.subControllers.push(twoThumb);
	goog.dom.append(this.getElement(), twoThumb.getElement());


	var colorPalette = new xiv.ui.ctrl.ColorPaletteController();
	this.subControllers.push(twoThumb);
	goog.dom.append(this.getElement(), colorPalette.getElement());


	this.getElement().style.position = 'absolute';
	this.getElement().style.left = '10%';
	this.getElement().style.top = '30%';
	this.getElement().style.height = '200px';
	this.getElement().style.width = '400px';
	this.getElement().style.backgroundColor = 'rgba(20,200,20,1)';
	this.getElement().style.opacity = 1;
	this.getElement().style.zIndex = 4000;
	window.console.log('sub', this.getElement());





	//this.addMasterControls_();


	
    }
}


/**
 * @param {!X.Object} xObj
 * @public
 */
xiv.ui.ctrl.MasterController3D.prototype.addMasterControls_ = goog.nullFunction;



/**
 * @param {!string} labelTitle;
 * @public
 */
xiv.ui.ctrl.MasterController3D.prototype.disposeInternal = function() {
    goog.base(this, 'disposeInternal');
    
    goog.array.clear(this.xObjs_);
    delete this.xObjs_;

    window.console.log("need to implement dispose methods" + 
		       " for MasterController3D");
}



