/**
 * @author sunilk@mokacreativellc.com (Sunil Kumar)
 */

// goog


// utils
goog.require('utils.array');
goog.require('utils.xnat');
goog.require('utils.xnat.Viewable');



/**
 * @constructor
 * @extends {utils.xnat.Viewable}
 */
goog.provide('utils.xnat.Viewable.Scan');
utils.xnat.Viewable.Scan = function(experimentUrl, viewableJson) {
    this['category'] = 'Scan';
    goog.base(this, experimentUrl, viewableJson);
}
goog.inherits(utils.xnat.Viewable.Scan, utils.xnat.Viewable);
goog.exportSymbol('utils.xnat.Viewable.Scan', utils.xnat.Viewable.Scan);



/**
 * @const
 * @type {!string}
 */
utils.xnat.Viewable.Scan['folderQuerySuffix'] = 'scans';


/**
 * @const
 * @type {!string}
 */
utils.xnat.Viewable.Scan['fileQuerySuffix'] = '/files';


/**
 * @const
 * @type {!string}
 */
utils.xnat.Viewable.Scan['fileContentsKey'] = 'URI';



/**
 */
utils.xnat.Viewable.Scan.prototype.makeFileUrl = function(xnatFileObj) {
    return utils.xnat.graftUrl(this['experimentUrl'], 
	      xnatFileObj[utils.xnat.Viewable.Scan['fileContentsKey']], 
			   'experiments');

}



utils.xnat.Viewable.Scan.prototype.getThumbnailImage = function(opt_callback){
    //
    // Select the image in the middle of the list to 
    // serve as the thumbnail after sorting the fileURIs
    // using natural sort.
    //
    this['files'] = this['files'].sort(utils.array.naturalCompare);
    var imgInd = Math.floor((this['files'].length) / 2);
    //window.console.log(this['files'], this['files'].length, imgInd);
    this['thumbnailUrl'] = this['files'][imgInd];
}



/**
 * Function for sorting scan objects.
 *
 * @param {!Object.<String, String | Object.<String, String | Object>} a 
 *    First scan object to compare. 
 * @param {!Object.<String, String | Object.<String, String | Object>} b 
 *   Second scan object to compare.
 * @public 
 */
utils.xnat.Viewable.Scan.sortCompare = function(a,b) {
    if (a['sessionInfo']['Scan']['value'][0].toLowerCase() < 
	b['sessionInfo']['Scan']['value'][0].toLowerCase())
	return -1;
    if (a['sessionInfo']['Scan']['value'][0].toLowerCase() > 
	b['sessionInfo']['Scan']['value'][0].toLowerCase())
	return 1;
    return 0;
}




