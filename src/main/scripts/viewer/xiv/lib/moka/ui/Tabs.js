/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog
goog.require('goog.dom');
goog.require('goog.object');
goog.require('goog.events');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.ui.TabPane');
goog.require('goog.ui.TabPane.TabPage');

// moka
goog.require('moka.style');
goog.require('moka.ui.Component');
goog.require('moka.ui.ScrollableContainer');




/**
 * moka.ui.Tabs are the tabs that occur at the bottom
 * of the xiv.ui.ViewBox.  They are only visible when a viewable is in the 
 * xiv.ui.ViewBox. These tabs are multi-purpose and could be used for 
 * information, object togling, image adjusting, etc.
 * @constructor
 * @extends {moka.ui.Component}
 */
goog.provide('moka.ui.Tabs');
moka.ui.Tabs = function () {
    goog.base(this);

    /**
     * @type {!goog.ui.TabPane}
     * @private
     */
    this.googTabPane_ = new goog.ui.TabPane(this.getElement());
}
goog.inherits(moka.ui.Tabs, moka.ui.Component);
goog.exportSymbol('moka.ui.Tabs', moka.ui.Tabs)



/**
 * @type {!string} 
 * @const
 */
moka.ui.Tabs.ID_PREFIX =  'moka.ui.Tabs';



/**
 * @enum {string} 
 * @const
 */ 
moka.ui.Tabs.CSS_SUFFIX = {
    TAB: 'tab',
    TAB_ACTIVE: 'tab-active',
    TAB_HOVERED: 'tab-hovered',
    TABPAGE: 'tabpage',
    TABPAGE_ACTIVE: 'tabpage-active',
    TABICON: 'tabicon',
    TABICON_MOUSEOVER: 'tabicon-mouseover',
    SCROLLGALLERY: 'scrollgallery'
}



/**
 * @type {!string}
 * @private
 */
moka.ui.Tabs.prototype.iconRoot_ = '';



/**
 * @type {!number}
 * @private
 */
moka.ui.Tabs.prototype.lastActiveTab_ = 0;



/**
 * @type {!number}
 * @private
 */
moka.ui.Tabs.prototype.prevActiveTab_ = 0;



/**
 * @type {Object}
 * @private
 */
moka.ui.Tabs.prototype.Tabs_;



/**
 * @type {!number}
 * @private
 */
moka.ui.Tabs.prototype.tabHeight_ = 15;



/**
 * As stated.
 * @param {!number} h
 * @public
 */
moka.ui.Tabs.prototype.setTabHeight = function(h){
    this.tabHeight_ = (goog.isNumber(h) && (h > -1)) ? h : this.tabHeight_;
    this.updateStyle();
}


/**
 * @return {!number}
 * @public
 */
moka.ui.Tabs.prototype.getTabHeight = function(){
    return this.tabHeight_;
}



/**
 * @return {!number} The index of the last active tab.
 * @public
 */
moka.ui.Tabs.prototype.getLastActiveTab = function(){
    return this.lastActiveTab_;
}



/**
 * @return {!number} The index of the previous active tab (before last active).
 * @public
 */
moka.ui.Tabs.prototype.getPreviousActiveTab = function(){
    return this.prevActiveTab_;
}



/**
 * Adds multiple tabs by calling on the internal 'addTab' function.
 * @param {!Array.string} tabTitles The titles of the tabs to add.
 * @public
 */
moka.ui.Tabs.prototype.addTabs = function(tabTitles) {
    goog.array.forEach(tabTitles, function(tabTitle){
	this.addTab(tabTitle);
    }.bind(this))
}



/**
 * Clears all of the tabs.
 *
 * @public
 */
moka.ui.Tabs.prototype.reset = function() {	
    var count = /**@type {!number}*/ goog.object.getCount(this.Tabs_);
    while (count > 0) {
	this.googTabPane_.removePage(count - 1)
	count--;
    }
    goog.object.forEach(this.Tabs_, function(tabObj, key){	
	goog.object.forEach(tabObj, function(tabObj2, key2){
	    delete tabObj2;
	}.bind(this))
    }.bind(this))
}
   


/**
 * Conducts the necessary CSS / stylesheet adjustments
 * when a tab is activated or clicked.
 *
 * @param {!number} activeTabNum The reference active tab number.
 * @public
 */
moka.ui.Tabs.prototype.setActive = function (activeTabNum) {	
    // Call goog.ui.TabPane select method.
    this.prevActiveTab_ = this.lastActiveTab_;
    this.lastActiveTab_ = activeTabNum;
    this.googTabPane_.setSelectedIndex(activeTabNum);
    this.setActiveTabElt_(activeTabNum);
    this.setActiveTabPage_(activeTabNum);
}




/**
 * As stated.
 *
 * @return {!Array.Element} The tab elements.
 * @public
 */
moka.ui.Tabs.prototype.getTabElements = function() {
    var elts = /**@type {!Array.Element}*/ [];
    goog.object.forEach(this.Tabs_, function(tabObj, key){
	elts.push(tabObj['tab']);
    });
    return elts;
}



/**
 * As stated.
 *
 * @return {!Array.Element} The page elements.
 * @public
 */
moka.ui.Tabs.prototype.getTabPage = function() {
    var elts = /**@type {!Array.Element}*/ [];
    goog.object.forEach(this.Tabs_, function(tabObj, key){
	elts.push(tabObj['content']);
    });
    return elts;
}



/**
 * As stated.
 *
 * @return {!Array.Element} The icon elements.
 * @public
 */
moka.ui.Tabs.prototype.getTabIcons = function() {
    var elts = /**@type {!Array.Element}*/ [];
    goog.object.forEach(this.Tabs_, function(tabObj, key){
	elts.push(tabObj['icon']);
    });
    return elts;
}



/**
 * Adds a tab.  Utilises the tabObject_ object to create
 * tabs, their icons and pages.
 *
 * @param {!string} tabTitle The title of the tab to add.
 * @throws {Error} If tab with tabTitle already exists.
 * @public
 */
moka.ui.Tabs.prototype.addTab = function(tabTitle) {

    this.Tabs_ = (this.Tabs_) ? this.Tabs_ : {};

    // Check exists, error out.
    if (this.Tabs_ && this.Tabs_[tabTitle]) {
	throw new Error(tabTitle + ' is an already existing tab!');
    }

    // create Tab
    var tab = /**@type {!Element}*/ this.createTabElt_(tabTitle);
    goog.dom.append(this.getElement(), tab);

    //  create Tab icon		
    var tabIcon = /**@type {!Element}*/ this.createTabIcon_(tabTitle);
    goog.dom.append(tab, tabIcon);


    //  create Tab page	
    var content = /**@type {!Element}*/ this.createTabPage_(tabTitle);
    moka.style.setStyle(content, moka.style.dims(this.getElement(), 'width'))
    goog.dom.append(this.getElement().parentNode, content);

    // create Create goog TabPage object
    var googTab = /**@type {!goog.ui.TabPane.TabPage}*/ 
    new goog.ui.TabPane.TabPage(content, tabTitle)


    // Add to tabPane
    this.googTabPane_.addPage(googTab);

    // store
    this.storeTab_(tabTitle, tab, tabIcon, content, googTab);

    // style
    this.updateStyle();

    // set events
    this.clearEventListeners_();
    this.setClickEvents_();
    this.setHoverEvents_();
    this.deactivateAll();
    this.setActive(0);
}



/**
 * Adds either an object or an element to the contents
 * of a tab page.  The contents is always a moka.ui.ScrollableContainer, which
 * can accept either Objects of Elements as part of its input method.
 *
 * @param {!string} tabName The name of the tab.
 * @param {!Object|!Element|!moka.ui.ScrollableContainer} contents The 
 *    contents.
 * @public
 */
moka.ui.Tabs.prototype.setTabPageContents = function (tabName, contents) {
    // Add the tab page if it's not there.
    if (!this.Tabs_ || !this.Tabs_[tabName]){ this.addTab(tabName) };

    var scrollableContainer = /**@type {moka.ui.ScrollableContainer}*/ null;

    // Make or use existing scrollable container...
    if (contents instanceof moka.ui.ScrollableContainer) {
	scrollableContainer = contents;
	this.Tabs_[tabName]['content'].appendChild(
	    scrollableContainer.getElement());
    }
    else {
	scrollableContainer = new moka.ui.ScrollableContainer()
	this.Tabs_[tabName]['content'].appendChild(
	    scrollableContainer.getElement());
	scrollableContainer.addContents(contents);
	//window.console.log("CONTENTS", contents);
	//window.console.log(scrollableContainer.getPageDict());
    }

    // Set the scrollable container class.
    goog.dom.classes.add(scrollableContainer.getElement(), 
			 moka.ui.Tabs.CSS.SCROLLGALLERY);
}



/**
 * @param {!string} tabTitle The title of the tab to add.
 * @return {!Element} The created element.
 * @private
 */
moka.ui.Tabs.prototype.createTabElt_ = function(tabTitle) {
    return goog.dom.createDom('div', {
	'id': 'Tab_' + goog.string.createUniqueString(),
	'class' : moka.ui.Tabs.CSS.TAB,
	'title': tabTitle,
    });
}


/**
 * @param {!string} tabTitle The title of the tab to set the image for.
 * @return {!string} The src of the image.
 * @private
 */
moka.ui.Tabs.prototype.setTabIconImage_ = function(tabTitle, src) {
    //window.console.log("ICON", this.iconUrl);
    if (!this.Tabs_[tabTitle]) {
	throw new Error("Invalid tab!");
    }
    goog.dom.removeChildren(this.Tabs_[tabTitle]['icon']);
    goog.dom.append(this.Tabs_[tabTitle]['icon'], goog.dom.createDom('img', {
	'src' : src
    }))
}



/**
 * @param {!string} tabTitle The title of the tab icon to add.
 * @return {!Element} The created element.
 * @private
 */
moka.ui.Tabs.prototype.createTabIcon_ = function(tabTitle) {
    //window.console.log("ICON", this.iconUrl);

    var icon = /**@type {!Element}*/ goog.dom.createDom('div', {
	'id' : 'TabIcon_' + goog.string.createUniqueString(),
	'class' : moka.ui.Tabs.CSS.TABICON,
    });

    goog.dom.append(icon, goog.dom.createDom('div', {
	'class' : moka.ui.Tabs.CSS.TABICON
    }, tabTitle))

    
    return icon;
}



/**
 * @param {!string} tabTitle The title of the tab page to add.
 * @return {!Element} The created element.
 * @private
 */
moka.ui.Tabs.prototype.createTabPage_ = function(tabTitle) {
    return goog.dom.createDom('div', {
	'id' : 'TabPage_' + goog.string.createUniqueString(),
	'class': moka.ui.Tabs.CSS.TABPAGE,
	'label': tabTitle
    });
}


/**
 * @param {!string} tabTitle The tab title.
 * @param {!Element} tab The tab element.
 * @param {!Element} tabIcon The tab element icon.
 * @param {!Element} content The tabPage content element.
 * @param {!goog.ui.TabPane.TabPage} googTab The google TabPage.
 * @private
 */
moka.ui.Tabs.prototype.storeTab_ = 
function(tabTitle, tab, tabIcon, content, googTab){
    this.Tabs_ = (this.Tabs_) ? this.Tabs_ : {};
    this.Tabs_[tabTitle] = {
	'TabPage': googTab,
	'content': content,
	'tab': tab,
	'icon': tabIcon
    }
}



/**
 * Conducts the necessary CSS / stylesheet adjustments
 * when a tab is deactivated.
 *
 * @param {!number} ind The tab index to deactivate.
 * @public
 */
moka.ui.Tabs.prototype.deactivate = function (ind) { 
    goog.array.forEach(this.getTabElements(), function(tabElt, i){
	if (i === ind) {
	    this.deactivateTabElt_(tabElt);
	}
    }.bind(this))

    goog.array.forEach(this.getTabPage(), function(tabCont, i){
	if (i === ind) {
	    this.deactivateTabPage_(tabCont);
	}
    }.bind(this))
}



/**
 * Conducts the necessary CSS / stylesheet adjustments
 * when all tabs are deactivated.
 *
 * @public
 */
moka.ui.Tabs.prototype.deactivateAll = function () { 

    goog.array.forEach(this.getTabElements(), function(tabElt, i){
	this.deactivateTabElt_(tabElt);
    }.bind(this))

    goog.array.forEach(this.getTabPage(), function(tabCont, i){
	this.deactivateTabPage_(tabCont);
    }.bind(this))
}



/**
 * @inheritDoc
 */
moka.ui.Tabs.prototype.updateStyle = function () {

    if (!this.getElement().parentNode) { return };
    
    // Need to do this -- google takes it over.
    goog.dom.classes.add(this.getElement(), moka.ui.Tabs.ELEMENT_CLASS);


    var i = /**@type {!number}*/ 0;
    var tCount = /**@type {!number}*/ goog.object.getCount(this.Tabs_);
    var wPct = /**@type {!number}*/ 100/tCount; 
    var pHght = /**@type {!number}*/ 
	    parseInt(this.getElement().parentNode.style.height, 10);
    var borderMgn = /**@type {!number}*/ 0;
    
    goog.object.forEach(this.Tabs_, function(tObj){

	// Resize tab wPcts
	moka.style.setStyle(tObj['tab'], {
	    'width': (wPct).toString() + '%',
	    'height' : this.tabHeight_,
	    'left': (wPct * i).toString() + '%',
	})

	// Exit out if no parent node.
	if (!this.getElement().parentNode){ return };

	borderMgn = parseInt(moka.style.getComputedStyle(tObj['tab'], 
						'border-bottom-width'));
	borderMgn = (!borderMgn || isNaN(borderMgn) || 
		     !goog.isNumber(borderMgn)) ? 0 : borderMgn; 

	tObj['content'].style.top = 
	    (this.tabHeight_ - borderMgn).toString() + 'px';
	tObj['content'].style.height = 'calc(100% - ' + 
	    this.tabHeight_.toString() + 'px)',

	i++;
    }.bind(this))
}



/**
 * @private
 */
moka.ui.Tabs.prototype.deactivateTabElt_ = function (tabElt) {
    goog.dom.classes.remove(tabElt, moka.ui.Tabs.CSS.TAB_ACTIVE);
    goog.dom.classes.set(tabElt, moka.ui.Tabs.CSS.TAB);
}



/**
 * @private
 */
moka.ui.Tabs.prototype.deactivateTabPage_ = function (tabCont) {
    goog.dom.classes.set(tabCont, moka.ui.Tabs.CSS.TABPAGE);
}



/**
 * Cycle through each tab, hightlighting the tab 
 * associated with ind, not hightlting the others.
 * @param {number} ind The reference active tab number.
 * @private
 */
moka.ui.Tabs.prototype.setActiveTabElt_ = function (ind) {
    //window.console.log("ACTIVATE TAB ELT", ind);
    goog.array.forEach(this.getTabElements(), function(tab, i) { 
	if (i === ind) {
	    tab.setAttribute('isActive', true);
	    goog.dom.classes.add(tab, moka.ui.Tabs.CSS.TAB_ACTIVE);
	}
    })	
}



/**
 * If there's an active tab, make the tab page border more prominent.
 *
 * @param {number} ind The reference active tab number.
 * @private
 */
moka.ui.Tabs.prototype.setActiveTabPage_ = function (ind) {
    goog.array.forEach(this.getTabPage(), function(tabPage, i) {
	if (ind === i){
	    goog.dom.classes.add(tabPage, moka.ui.Tabs.CSS.TABPAGE_ACTIVE);
	}	
    })	
}


/**
 * Clears all event listening callbacks for tabs.
 *
 * @private
 */
moka.ui.Tabs.prototype.clearEventListeners_ = function(){
    goog.array.forEach(goog.dom.getElementsByClass(moka.ui.Tabs.CSS.TAB, 
				this.getElement()), function(tab, i) { 
	goog.events.removeAll(tab);
    })
}



/**
 * Sets the default click events when a user clicks on a tab
 * (i.e. tab activation and tab deactivation).
 *
 * @private
 */
moka.ui.Tabs.prototype.setClickEvents_ = function() {
    // Cycle through each tab...
    goog.array.forEach(this.getTabElements(), function(tab, i) { 
	goog.events.listen(tab, goog.events.EventType.MOUSEUP, function(event) {
	    window.console.log("CLICK", i);
	    this.deactivateAll();
	    this.setActive(i);
	}.bind(this))
    }.bind(this))	
}



/**
 * Sets the default hover events, such as highlighting, when
 * the mouse hover's over the tab.
 *
 * @private
 */
moka.ui.Tabs.prototype.setHoverEvents_ = function() {
    goog.array.forEach(this.getTabElements(), function(tab, i) { 
	this.setTabMouseOver_(tab, i);
	this.setTabMouseOut_(tab, i);
    }.bind(this))	
}



/**
 * @param {!Element} tab The tab to apply the event listener to.
 * @param {!number} i The index of the tab.
 * @private
 */
moka.ui.Tabs.prototype.setTabMouseOver_ = function(tab, i) {
    goog.events.listen(tab, goog.events.EventType.MOUSEOVER, function() { 
	goog.dom.classes.add(tab, moka.ui.Tabs.CSS.TAB_HOVERED);
	
	// Set TabIcon style change (opacity) -- applies whether active 
	// or inactive
	goog.array.forEach(goog.dom.getElementsByClass(
	    this.TABICON_CLASS, tab), function(icon){
		goog.dom.classes.add(icon, 
			moka.ui.Tabs.CSS.TABICON_MOUSEOVER);
	    }.bind(this))
    }.bind(this))
}



/**
 * @param {!Element} tab The tab to apply the event listener to.
 * @param {!number} i The index of the tab.
 * @private
 */
moka.ui.Tabs.prototype.setTabMouseOut_ = function(tab, i) {
    goog.events.listen(tab, goog.events.EventType.MOUSEOUT, function(e) { 
	goog.dom.classes.remove(tab, moka.ui.Tabs.CSS.TAB_HOVERED);
	// TabIcon style change (opacity) -- applies whether active or inactive
	goog.array.forEach(goog.dom.getElementsByClass(
	    moka.ui.Tabs.CSS.TABICON, tab), function(icon){
		goog.dom.classes.remove(icon, 
				    moka.ui.Tabs.CSS.TABICON_MOUSEOVER);
	    }.bind(this))
    }.bind(this))
}




