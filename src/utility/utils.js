var request = require('request');


export function search(searchText, sortData, page, perPage, cb) {
	var params = {
		q:searchText,
		sort:sortData,
		page:page,
		per_page:perPage
	}
	var options = {
		"url":"https://api.github.com/search/repositories",
		"method":"GET",
		qs:params,
		"headers":{
			"Accept":"application/vnd.github.mercy-preview+json",
		}
	}
	request(options, function (error, response, body) {
		if(error) {
			cb(error)
		} else {
			if(response.statusCode && response.statusCode === 200) {
				if(body && typeof(body) === "string"){
					body = JSON.parse(body)
				}
		  		// console.log('body:', body); // Print the HTML for the Google homepage.
				cb(null, body)
			}
		}
	})
}



