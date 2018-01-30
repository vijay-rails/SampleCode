/*
* Custom O(n) Intersect function
* We convert the first (longest) array to an object for constant time gets. We iterate through second array
* and check if value exists in object in linear time.
*/
module.exports = {
	//intersection checking postid to remove need for json formatting
	//JSON.parse(JSON.stringify(reporterPosts))
	intersectPostId: function (a,b) {
		var obj = {} // create empty object
		var result = [] // create empty array

		// convert array to object set
		for (var i = 0; i < a.length; i++) {
			obj[a[i].postid] = true;
		}

		for (var i = 0; i<b.length; i++) {
			if(obj[b[i].postid]) {
				result.push(b[i].postid);
			}
		}

		return result;
	}	
}

/* CODE SNIPPET FOR MAIN APP*/

//first param converted to hash for O(1) gets, first element should be the longest array
var commonPosts = intersectTypes.intersectPostId(userVotedPosts,reporterPosts)

/***************************/