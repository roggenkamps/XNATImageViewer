/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.ui.MenuButton');
goog.require('goog.style');
goog.require('goog.async.Delay');
goog.require('goog.ui.MenuItem');
goog.require('goog.array');
goog.require('goog.ui.Menu');
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.dom');
goog.require('goog.fx');

// utils
goog.require('moka.dom');
goog.require('moka.style');
goog.require('moka.fx');
goog.require('moka.ui.Component');



/**
 * moka.ui.IconRotateMenu allows viewers to toggle between
 * the anatamical view planes, 3D planes, and multiple
 * view planes of the viewable data.
 *
 * @constructor
 * @extends {moka.ui.Component}
 */
goog.provide('moka.ui.IconRotateMenu');
moka.ui.IconRotateMenu = function () {	
    goog.base(this);


    /**
     * @private
     * @type {Element}
     */
    this.holder_ = goog.dom.createDom("div", {
	'id' : this.constructor.ID_PREFIX + 
	    '_Holder_' + goog.string.createUniqueString(),
	'class': moka.ui.IconRotateMenu.MENUHOLDER_CLASS
    })
    goog.dom.append(this.getElement(), this.holder_);


    /**
     * @private
     * @type {Element}
     */
    this.icon_ = goog.dom.createDom("img", {
	'id': this.constructor.ID_PREFIX + 
	    '_Icon_' + goog.string.createUniqueString(),
	'class': moka.ui.IconRotateMenu.ICON_CLASS
    });	
    goog.dom.append(this.getElement(), this.icon_);


    /**
     * @private
     * @type {!goog.ui.Menu}
     */   
    this.menu_ = new goog.ui.Menu();


    /**
     * @private
     * @type {Object.<string, moka.ui.menuItemCollection>}
     */
    this.menuItems_ = {};



    this.menu_.render(this.holder_);
    goog.dom.classes.add(this.menu_.getElement(), 
			 moka.ui.IconRotateMenu.MENU_CLASS);
    this.setMenuInteraction();  
    //this.setHighlightedIndex(0);


    this.setMenuIconSrc('/xnat/images/viewer/xiv/ui/ViewLayoutMenu/menu.png')
    moka.ui.IconRotateMenu.Layouts  = {
	'SAGITTAL' : 'Sagittal',
	'CORONAL': 'Coronal',
	'TRANSVERSE': 'Transverse',
	'THREE_D': '3D',
	'CONVENTIONAL': 'Conventional',
	'FOUR_UP': 'Four-Up',
    }
    this.addMenuItem(goog.object.getValues(
	moka.ui.IconRotateMenu.Layouts), [
	    '/xnat/images/viewer/xiv/ui/ViewLayout/sagittal.png',
	    '/xnat/images/viewer/xiv/ui/ViewLayout/coronal.png',
	    '/xnat/images/viewer/xiv/ui/ViewLayout/transverse.png',
	    '/xnat/images/viewer/xiv/ui/ViewLayout/3d.png',
	    '/xnat/images/viewer/xiv/ui/ViewLayout/conventional.png',
	    '/xnat/images/viewer/xiv/ui/ViewLayout/four-up.png',
	]);
}
goog.inherits(moka.ui.IconRotateMenu, moka.ui.Component);
goog.exportSymbol('moka.ui.IconRotateMenu', moka.ui.IconRotateMenu)



/**
 * @enum {string}
 * @public
 */
moka.ui.IconRotateMenu.EventType = {
    ITEM_SELECTED: 'item_selected',
};



/**
 * @type {!Object}
 * @public
 */
moka.ui.menuItemCollection = {
    ITEM : null,
    CONTENT: null,
    ICON: null
}



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.ID_PREFIX =  'moka.ui.IconRotateMenu';



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.CSS_CLASS_PREFIX =
goog.string.toSelectorCase(moka.ui.IconRotateMenu.ID_PREFIX.toLowerCase().
			   replace(/\./g,'-'));



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.ELEMENT_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.CSS_CLASS_PREFIX, '');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.MENUHOLDER_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.CSS_CLASS_PREFIX, 'menuholder');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.ICON_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.CSS_CLASS_PREFIX, 'icon');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.ICON_HOVERED_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.ICON_CLASS, 'hovered');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.MENU_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.CSS_CLASS_PREFIX, 'menu');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.MENUITEM_CONTENT_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.CSS_CLASS_PREFIX, 'menuitem');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.MENUITEM_CONTENT_HIGHLIGHT_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.MENUITEM_CONTENT_CLASS, 'highlight');



/**
 * @type {!string} 
 * @const
*/
moka.ui.IconRotateMenu.MENUITEM_ICON_CLASS = 
    goog.getCssName(moka.ui.IconRotateMenu.MENUITEM_CONTENT_CLASS, 'icon');



/**
 * @const
 * @type {number}
 */	
moka.ui.IconRotateMenu.animationDuration = 700



/**
 * @const
 * @type {number}
 */	
moka.ui.IconRotateMenu.mouseoutHide = 
    moka.ui.IconRotateMenu.animationDuration + 800; 



/**
 * @type {string}
 */
moka.ui.IconRotateMenu.prototype.prevSelectedItem_ = undefined;



/**
 * @type {string}
 */
moka.ui.IconRotateMenu.prototype.currSelectedItem_ = undefined;



/**
 * @private
 * @type {boolean}
 */
moka.ui.IconRotateMenu.prototype.menuVisible_ = false;



/**
 * @return {!Element}
 * @public
 */
moka.ui.IconRotateMenu.prototype.getMenuHolder = function(src) {
    return this.holder_;
}



/**
 * @return {!Element}
 * @public
 */
moka.ui.IconRotateMenu.prototype.getMenuIcon = function(src) {
    return this.icon_;
}



/**
 * @param {!string} src
 * @public
 */
moka.ui.IconRotateMenu.prototype.setMenuIconSrc = function(src) {
    this.icon_.src = src;
}



/**
 * @param {!string} title
 * @public
 */
moka.ui.IconRotateMenu.prototype.setMenuItemIconSrc = function(title, src) {
    this.menuItems_[title].ICON.src = src;
}



/**
 * @param {!string} The title.
 * @return {!number}
 */
moka.ui.IconRotateMenu.prototype.getIndexFromTitle = function(title) {
    return goog.object.getKeys(this.menuItems_).indexOf(title);
}



/**
 * @param {!string} The title.
 * @return {!number}
 */
moka.ui.IconRotateMenu.prototype.getTitleFromIndex = function(index) {
    return goog.object.getKeys(this.menuItems_)[index];
}



/**
 * @param {!number} The title.
 * @return {moka.ui.}
 */
moka.ui.IconRotateMenu.prototype.getItemCollectionFromIndex = function(ind) {
    return this.menuItems_[goog.object.getKeys(this.menuItems_)[ind]];
}



/**
 * @param {!Array.string | !string} itemTitles The titles of the menu items.
 * @param {!Array.string | !string} opt_iconSrc The optional sources for the
 *    menu item icons.
 * @throws {Error} If the a title is already taken.
 * @public
 */
moka.ui.IconRotateMenu.prototype.addMenuItem = function(itemTitles, 
							opt_iconSrc) {

    itemTitles = goog.isString(itemTitles) ?  [itemTitles] : itemTitles;
    opt_iconSrc = opt_iconSrc || [];
    opt_iconSrc = goog.isArray(opt_iconSrc) ? opt_iconSrc : [opt_iconSrc];
    
    var item = /**@type {goog.ui.MenuItem}*/ null;
    var childNodes = /**@type {{length: number}}*/ null;
    var content = /**@type {Element}*/ null;
    var icon = /**@type {Element}*/ null;
    
    goog.array.forEach(itemTitles, function(title, i){
	if (this.menuItems_[title]){
	    throw new Error(title + ' is already in use!');
	}
	
	// create the menu item.
	item = new goog.ui.MenuItem(title)
	this.menu_.addItem(item);

	// Modify the content element.
	content = item.getContentElement();
	goog.dom.classes.add(content,
			     moka.ui.IconRotateMenu.MENUITEM_CONTENT_CLASS);
	content.title = title;

	// Set the icon.
	icon = goog.dom.createDom("img", {
	    'id':  moka.ui.IconRotateMenu.ID_PREFIX + 
		'_MenuItemIcon_' + goog.string.createUniqueString(),
	    'class' : moka.ui.IconRotateMenu.MENUITEM_ICON_CLASS
	});

	// Set the icon src, if available.
	icon.src = (i <= opt_iconSrc.length - 1) ? opt_iconSrc[i] : null;
	goog.dom.append(content, icon);

	
	// Store the item.
	this.menuItems_[title] = goog.object.clone(moka.ui.menuItemCollection);
	this.menuItems_[title].ITEM = item;
	this.menuItems_[title].CONTENT = content;
	this.menuItems_[title].ICON = icon;
    }.bind(this))    
}



/**
 * Sets a menu item active either by its index number or title. 
 * @param {!number | !string} indexOrTitle Either the index or the title to 
 *    set the item selected.
 * @param {boolean=} opt_deactivateOthers Optional: whether to deactive other
 *    selected items.  Defaults to true.
 * @throws {Error} If title is invalid.
 */
moka.ui.IconRotateMenu.prototype.setSelected = 
function(indexOrTitle, opt_deactivateOthers) {

    // Set index, assert value
    var index = /**@param {!number}*/ indexOrTitle;
    if (goog.isString(index)) {
	if (!this.menuItems_[index]){
	    throw new Error(index + ' does not exist!');
	}
	index = this.getIndexFromTitle(index);
    } 

    // Record the view layouts, previous and current.
    this.prevSelectedItem_ = this.currSelectedItem_ ? 
	this.currSelectedItem_ : indexOrTitle;
    this.currSelectedItem_ = indexOrTitle;

    // Highlight / unhighlight the relevant menu items.
    this.setHighlightedIndex(index);

    this.dispatchEvent({
	type: moka.ui.IconRotateMenu.EventType.ITEM_SELECTED,
	index: index,
	title: this.getItemCollectionFromIndex(index).ITEM.getContent()
    });
}




/**
 * Manages the menu interaction EVENTS related to 
 * clicking and hovering over certain menu elements.
 * Calls on the internal 'animateMenu' method for the
 * slide and fade aspects.
 */
moka.ui.IconRotateMenu.prototype.setMenuInteraction = function() {

    var isHovered = false;
    var delay = /** @type {?goog.async.Delay)}*/ null;
    var mouseoutDate = /** @type {?number}*/ null;
    var hidePos = [-200,25];
    var showPos = [-5,25]; 
    var suspendOtherClicks = false;



    //------------------
    // Countdown method after the user opens the 
    // menu.
    //------------------
    var closeCountdown = function(opt_delay) {
	var dateObj = new Date();
	var delayTime = (opt_delay !==undefined) ? opt_delay : 
	    moka.ui.IconRotateMenu.mouseoutHide;
	mouseoutDate = dateObj.getTime();
	delay = new goog.async.Delay(function(){ 
	    determineMenuHideable(delayTime) }, delayTime);
	delay.start();
    }



    //------------------
    // Checks if the menu is at a hideable state based
    // on the timer mechanism or the mouseHover.
    //------------------   
    var determineMenuHideable = function(delayTime) {

	//
	// Close menu when 1) not hovered, 2) the delay of mouseout is 
	// greater than the 'moka.ui.IconRotateMenu.mouseoutHide limit'.
	//
	var dateObj = new Date();
	if (!isHovered && ((dateObj.getTime() - mouseoutDate) >= delayTime)) { 
	    toggleMenu(false);}
    }



    //------------------
    // Define the 'toggleMenu' method (show or hide by
    // positioning (slide) and fading accordingly.)
    //------------------
    var toggleMenu = function(opt_arg){
	if (opt_arg !== undefined) {


	    //
	    // 'opt_arg' could be a boolean (programmatic calling of method).
	    //
	    if (typeof opt_arg === 'boolean') {this.menuVisible_ = !opt_arg}


	    //
	    // 'opt_arg' could be the event (UI calling of method).
	    //
	    else { moka.dom.stopPropagation(opt_arg)}
	}
	this.menuVisible_ = !this.menuVisible_   

	
	//
	// Animate the menu in if it's visible.
	// Utilises the internal 'animateMenu' method.
	//
	if (this.menuVisible_){
	    goog.style.showElement(this.holder_, this.menuVisible_);
	    this.animateMenu(hidePos, showPos);


	//
	// Animate the menu out if it's not visible.
	// Utilises the internal 'animateMenu' method.
	//
	} else {
	    this.animateMenu(showPos, hidePos, function(){
		goog.style.showElement(this.holder_, this.menuVisible_);
	    }.bind(this));
	    suspendOtherClicks = false;
	}
    }.bind(this)



    //------------------
    // Onclick:  Show or hide the menu
    //------------------
    goog.events.listen(this.getElement(), goog.events.EventType.CLICK, 
		       function (event) {
	if (!suspendOtherClicks){
	    window.console.log("CLCIK");
	    toggleMenu(event);
	    closeCountdown(2500);
	}
    });



    //------------------
    // Mouseover / Mouseout hover over a menuItem.
    //------------------
    goog.events.listen(this.holder_, goog.events.EventType.MOUSEOVER, 
		       function (event) {
	isHovered = true;
    });
    goog.events.listen(this.holder_, goog.events.EventType.MOUSEOUT, 
		       function (event) {
	isHovered = false;
	closeCountdown();
    });



    //------------------
    // Mouseover / Mouseout hover over the main icon.
    //------------------
    moka.style.setHoverClass(this.icon_, 
			      moka.ui.IconRotateMenu.ICON_HOVERED_CLASS);



    //------------------
    // Onclick: Menu items (i.e. the view planes) - select
    // the view planes.
    //------------------
    goog.events.listen(this.menu_, 'action', function(e) {

	//
	// Still propagates to the menu, that's why we have this
	// variable.
	//
	suspendOtherClicks = true;
	moka.dom.stopPropagation(e);
	var selInd = e.target.getId();
	window.console.log("Propagate plane select event here", selInd);
	this.setSelected(parseInt(selInd.replace(/:/g, ''), 10));
	//
	// We set this to false because we want the menu
	// to go away if the user lingers on the clicked menu item.
	//
	isHovered = false;
	closeCountdown(700);
    }.bind(this));  
}



/**
 * Highlights the appropriate menuItem after the user 
 * has clicked on it, unhighlights the rest.
 *
 * @param {!number}
 */
moka.ui.IconRotateMenu.prototype.setHighlightedIndex = function(index) {

   
    window.console.log('setHighlight', index, this.getTitleFromIndex(index));
    //------------------
    // Highlight the menuitem.
    //------------------
    var highlightContent = 
    this.menuItems_[this.getTitleFromIndex(index)].CONTENT;

    goog.dom.classes.add(highlightContent, 
		moka.ui.IconRotateMenu.MENUITEM_CONTENT_HIGHLIGHT_CLASS);



    //------------------
    // Change the icon as well (to white).
    //------------------
    var iconContent = goog.dom.getElementByClass(
	moka.ui.IconRotateMenu.MENUITEM_ICON_CLASS, highlightContent);
    iconContent.src = iconContent.src;



    //------------------
    // Change main menu icon to the current
    // viewLayout.
    //------------------
    this.icon_.src = iconContent.src;



    //------------------
    // Adjust title.
    //------------------
    this.getElement().title  = "Select View Plane (" + 
	highlightContent.getAttribute('viewlayoutid') + ")";



    //------------------
    // Unhighlight from other contents.
    //------------------
    var menuContents = goog.dom.getElementsByClass(
	'goog-menuitem-content', this.menu_.getElement());
    for (var i = 0, len = menuContents.length; i < len; i++) {
	if (menuContents[i] !== highlightContent) {
	    goog.dom.classes.remove(menuContents[i], 
		moka.ui.IconRotateMenu.MENUITEM_CONTENT_HIGHLIGHT_CLASS);
	    iconContent = 
		goog.dom.getElementByClass(
		    moka.ui.IconRotateMenu.MENUITEM_ICON_CLASS, menuContents[i]);
	}
    }
}




/**
 * @return {String}
 */
moka.ui.IconRotateMenu.prototype.getSelectedMenuItem = function() {
    return this.currSelectedItem_;
}




/**
 * Animates the position and opacity of the xiv.ui.SelectedItem menu
 * (i.e. slides it and fades it in/out)/
 *
 * @param {Array.<number>, Array.<number>, function=}
 */
moka.ui.IconRotateMenu.prototype.animateMenu  = 
function (startPos, endPos, opt_callback) {
    //moka.dom.debug("Animate!");

    var animQueue = new goog.fx.AnimationParallelQueue();
    var easing = goog.fx.easing.easeOut;



    //------------------
    // Fade in when moving in the realm of the viewer
    //------------------
    if (startPos[0] < endPos[0]) {
	moka.fx.fadeInFromZero(this.holder_, 
				moka.ui.IconRotateMenu.animationDuration);
    } else {
	easing = goog.fx.easing.easeIn;
	moka.fx.fadeOut(this.holder_, 
			moka.ui.IconRotateMenu.animationDuration);
    }



    //------------------
    // Define Slide animation
    //------------------
    var slide = new goog.fx.dom.Slide(this.holder_, 
		startPos, endPos, 
			moka.ui.IconRotateMenu.animationDuration, easing)



    //------------------
    // End Callback
    //------------------
    goog.events.listen(animQueue, 'end', function() {
	if (opt_callback) { opt_callback() };
    })



    //------------------
    // Play animation.
    //------------------
    animQueue.add(slide);
    animQueue.play();
}



/** 
 * @inheritDoc 
 */
moka.ui.IconRotateMenu.prototype.disposeInternal = function() {
    moka.ui.IconRotateMenu.superClass_.disposeInternal.call(this);

    goog.object.forEach(this.menuItems_, function(item, pos){
	item.ITEM.dispose();
    })

};
