var http = require( 'http' ), 
    request = require('request') ;

var port = 8080 ;

function getImgUrls( json ) {

	var imgURLs = [  ] ,
	    ob = JSON.parse( json ) ;

	if( ob.items && ob.items.length > 0 ) {
		for( var i =0 ; i < ob.items.length ; i++ ) {

			imgURLs.push( { "img" : ob.items[ i ].link } ) ;

		}

	} else {

		imgURLs.push( {'error': 'no images'} );
	}

	return imgURLs ;

}

function getPage( query , callback ) {

		query = query.replace( /\s/g , '+' ) ;

		var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyDpk6NjaoUoCZas9H88I4Nj1qbADI8v5B4&cx=005103682113723793081:kfelzv-ar2g&searchType=image&q=" + query ;

		request( url , function (error, response, body) {

			if (!error && response.statusCode === 200) {

				var results = getImgUrls( body ) ;

				callback( results ) ;

			} else {
				callback( { 'error' : 'an error occured' } ) ;
			}

		});

}

var server = http.createServer( function ( req , res ) {

	var url = req.url ;

	if( url  == '/' ) {

		res.end( 'welcome' ) ;

	} else {
		
		var url = url.substr( 1 , url.length - 1 ) ;

		getPage( url , function(data){

			res.writeHead( 200 , { 'Content-Type': 'application/json' } ) ;
			res.end( JSON.stringify( data ) ) ;

		} ) ;
	}
} ) ;

server.listen( process.env.PORT || port ) ;
