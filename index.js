var http = require ( 'http' ) , 
    url = require ( 'url' ) ,
    request = require ('request') , 
    mongo = require ( 'mongodb' ).MongoClient ;

var dbURI = process.env.MONGOLAB_URI ,
    google = {
	key: process.env.GOOGLE_API_KEY ,
	num: process.env.GOOGLE_CX_NUM ,
	app: process.env.GOOGLE_CX_APP
    },
    port = 8080 ;

function getImgUrls ( json ) {

	var imgURLs = [  ] ,
	    ob = JSON.parse ( json ) ;

	if ( ob.items && ob.items.length > 0 ) {
		for ( var i =0 ; i < ob.items.length ; i++ ) {

			imgURLs.push ( { 
			
				"img"  : ob.items[ i ].link ,

				"alt"  : ob.items[ i ].snippet ,

				"page" : ob.items[ i ].image.contextLink

			} ) ;

		}

	} else {

		imgURLs.push ( {'error': 'no images'} );
	}

	return imgURLs ;

}

function getPage ( query , pageNum, callback ) {

		query = query.replace ( /\s/g , '+' ) ;

		// paginate search results with 10 results per page
		var uri = "https://www.googleapis.com/customsearch/v1?key=" + google.key 
			+ "&cx=" + google.num + ":" + google.app 
			+ "&start=" + pageNum
			+ "&num=10"
			+ "&searchType=image&q=" + query ;

		request ( uri , function (error, response, body) {

			if (!error && response.statusCode === 200) {

				var results = getImgUrls ( body ) ;

				callback ( results ) ;

			} else {
				callback ( { 'error' : 'an error occured' } ) ;
			}

		});

}

var server = http.createServer ( function ( req , res ) {

	mongo.connect ( dbURI , function ( err , db ) {

                if ( err ) throw err ;

		var uri = url.parse(req.url).pathname ,
                    terms = db.collection ( 'searchterm' ) ;

                if ( uri == '/' ) {

			terms.find( ).sort( { $natural : -1 } ).limit( 10 ).toArray(function(err, docs) {

				if (err) throw err ;
				
				var lastTerms = [ ] ;
				
				for ( var i = docs.length - 1 ; i >= 0 ; i-- ) {

					lastTerms.push ( { "term" : decodeURI ( docs[ i ].term ) } ) ;

				}
                        
				db.close ( ) ;

				res.writeHead ( 200 , { 'Content-Type': 'application/json' } ) ;

                        	res.end ( JSON.stringify ( lastTerms  ) ) ;

			});

                } else {
			
			var pageNum = url.parse( req.url , true ).query.page || 1 ;

			terms.insert ( { "term" :  uri } , function ( err,  data )  {
                        	if ( err ) throw err ;

				db.close ( ) ;

                        } ) ;

			getPage( uri , pageNum , function(data){

				res.writeHead( 200 , { 'Content-Type': 'application/json' } ) ;

				res.end( JSON.stringify( data ) ) ;

			} ) ;

		} ;
	} ) ;
} ) ;

server.listen ( process.env.PORT || port ) ;
