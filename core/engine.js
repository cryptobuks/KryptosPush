'use strict';
var request = require('request');
var cheerio = require('cheerio');
var dbUtil = require("../config/dbUtil");
var ObjectId = require('mongodb').ObjectID;

module.exports.print = function(message) {
	console.log(message);
};

/**
   Utility method to check whether a link has already crawled or not.
*/
var isCrawled = function(crawledUrls, url) {
	var found = false;
	for (var i = 0; i < crawledUrls.length; i++) {
		if (crawledUrls[i] == url) {
			found = true;
		}
	}
	return found;
};

/**
   Utility method to check whether a link is added to the social count or not.
*/
var isLinkAdded = function(socialcount, type, link) {
	var found = false;
	for (var i = 0; i < socialcount[type].length; i++) {
		if (socialcount[type][i] == link) {
			found = true;
		}
	}
	return found;
}

var isValidRequest = function(req){
	if(req.body.url == null || req.body.url == undefined || req.body.url.length == 0){
		return false;
	}
	return true;
}

var normalizeUrl = function(req) {
	var url = req.body.url;
	if(url.indexOf("http") === 0) {
		return url;
	} else if(url.indexOf("www") === 0) {
		return "https://" + url;
	} else {
		return "https://"  + url;
	}
}

var isSafeLink = function(baseurl, href) {
	if (href == null || href == undefined) {
		return false;
	}
	href = href.toLowerCase();	
	if(href == "/") {
		return false;
	}
	/*if (href.indexOf("=") != -1 || href.indexOf("#") != -1) {
		return false;
	}*/
	if(href.indexOf(".pdf") != -1  || href.indexOf(".ppt") != -1
			|| href.indexOf(".pptx") != -1 || href.indexOf(".doc") != -1) {
			return false;
	}
	if(href.indexOf(baseurl) != -1 
			&& href.indexOf(".pdf") == -1  && href.indexOf(".ppt") == -1
			&& href.indexOf(".pptx") == -1 && href.indexOf(".doc") == -1) {
			return true;
	}

	if ((href.indexOf("http") == -1 && href.indexOf("mailto") == -1 
			&& href.indexOf("www") == -1 && href.indexOf("javascript:") == -1 )) {
		return true;
	}	
	return false;		
}

var checkAndUpdateImages = function(href,socialcount, spidy) {
	if (href === null || href === undefined) {
		return;
	}
	if (!isLinkAdded(socialcount, "images", href)) {
		//console.log(href);
		socialcount.images.push(href);
		spidy.social.images.push(href);
	}
}

var checkAndUpdateCounter = function(href, socialcount, spidy) {
	if (href === null || href === undefined) {
		return;
	}
	if (href.indexOf("facebook.com") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "facebook", href)) {
			//console.log(href);
			socialcount.facebook.push(href);
			spidy.social.fb.push(href);
		}
	}
	if (href.indexOf("twitter.com") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "twitter", href)) {
			//console.log(href);
			socialcount.twitter.push(href);
			spidy.social.tw.push(href);
		}
	}
	if (href.indexOf("youtube.com") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "youtube", href)) {
			//console.log(href);
			socialcount.youtube.push(href);
			spidy.social.yt.push(href);
		}
	}
	if (href.indexOf("googleplus.com") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "googleplus", href)) {
			//console.log(href);
			socialcount.googleplus.push(href);
			spidy.social.gp.push(href);
		}
	}
	if (href.indexOf("linkedin.com") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "linkedin", href)) {
			//console.log(href);
			socialcount.linkedin.push(href);
			spidy.social.li.push(href);
		}
	}
	if (href.indexOf("rss") != -1) {
		//console.log(href);
		if (!isLinkAdded(socialcount, "rss", href)) {
			//console.log(href);
			socialcount.rss.push(href);
			spidy.social.rss.push(href);
		}
	}
}

var triggerSpidy = function(baseurl, spidy) {
	var crawledUrls = [];
    var crawlcount = 0;
    var crawlcompleted = 0;
    var socialcount = {
        "twitter": [],
        "facebook": [],
        "youtube": [],
        "linkedin": [],
        "googleplus": [],
        "rss" : [],
        "images" : []
    };
    var queue = 0;
	var crawl = function(url, level, spidy) {
		if (isCrawled(crawledUrls, url)) {
			return;
		} else {
			crawledUrls.push(url);
		}
		if(crawlcount >= 500 || level > 2) {
			return;		
		}
		crawlcount++;
		queue++;
		spidy.queue = crawlcount;
		//console.log("Crawling : " + crawlcount + " : " + url + " : " + level);

		request({uri : url, timeout : 5000, maxRedirects : 20}, function(error, response, html) {
			queue--;
			crawlcompleted++;
			spidy.linkscrawled = crawlcompleted; 
			var id = new ObjectId(spidy._id);
			dbUtil.getConnection(function(db){
				db.collection("T_SYSTEM_CRAWLER_SESSIONS").replaceOne({"_id": id}, spidy, function(err, result2){
					if (err) {
		  				console.error("Mongo save error : "  + err);
		  			}
				});
			});
			/*spidy.save(function (err, spidys) {
	  			if (err) {
	  				console.error("Mongo save error : "  + err);
	  			}
	  			//console.log(spidys);  			
			});*/
			// First we'll check to make sure no errors occurred when making the request
			if (!error) {
				var $ = {};
				try {
				   $ = cheerio.load(html);
				   $('img').each(function() {
						var href = $(this).attr('src');
						if (href != null && href != undefined) {
							checkAndUpdateImages(href, socialcount, spidy);
						}
				   });				   
				   $('iframe').each(function() {
						var href = $(this).attr('src');
						if (href != null && href != undefined) {
							checkAndUpdateCounter(href, socialcount, spidy);
						}
				   });				 	
					$('a').each(function() {
						var href = $(this).attr('href');
						//console.log(href);
						checkAndUpdateCounter(href, socialcount, spidy);
						//console.log(href + " : " + isSafeLink(baseurl, href) + " : " + baseurl);
						if (href != null && href != undefined && (isSafeLink(baseurl, href))) {							
							if(href.indexOf(baseurl) != -1) {
								if (!isCrawled(crawledUrls, href)) {
									crawl(href, level + 1, spidy);
								}
							}else {
								if (!isCrawled(crawledUrls, href)) {
									crawl(baseurl + "/" + $(this).attr('href'), level + 1, spidy);
								}
							}
						}
					});
				}catch(exc) {
					console.log("Chreio Exception " +  exc);
				}				
			} else {		
				if(crawlcount == 1 && url == baseurl) {
					if(baseurl.indexOf("https://") == 0) {
						baseurl = baseurl.replace("https://","http://");
						crawl(baseurl, 0,spidy);
					}
					console.log('Error.. for ' + url + " " + crawlcount);
				}		
				
			}
			//console.log(queue + " " + url);
			if(queue  === 0) {
				spidy.status = "Completed";
				//console.log("Completed...!!!!!");
				var id = new ObjectId(spidy._id);
				dbUtil.getConnection(function(db){
					db.collection("T_SYSTEM_CRAWLER_SESSIONS").replaceOne({"_id": id}, spidy, function(err, result2){
						if (err) {
		  					console.error("Mongo save error : "  + err);
		  				}
					});
				});
				/*spidy.save(function (err, spidys) {
  					if (err) {
  					   console.error("Mongo save error : "  + err);
  					}
				});*/
			}
		})
	}

	crawl(baseurl, 0,spidy);
}

module.exports.isCrawled = isCrawled;
module.exports.isLinkAdded = isLinkAdded;
module.exports.isValidRequest = isValidRequest;
module.exports.normalizeUrl = normalizeUrl;
module.exports.triggerSpidy = triggerSpidy;
