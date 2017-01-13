Google image search abstration layer

Use:
http://<host>/search-term[?offset=N]
where N is a positive Natural number.

Reults:
Returned is a page of results representd in JSON as an array of object literals.
Each page contains 10 results.
The returned fields are:
img, alt and (hosting web)page, 

Actual:
http://<host>/disco ball
Retruns:
[{"img":"https://openclipart.org/image/2400px/svg_to_png/191143/1392845552.png","alt":"Learn more at openclipart.org","page":"https://www.pinterest.com/pin/164240717636106435/"}, ... ]

http://<host>/black bears
returns the 1st page of results.

http://<host>/black bears?offset=3
returns the 3rd page of results.

http://<host>
returns the last 10 query terms.

Dependencies:
npm http
npm url
npm request
npm mongodb
A Custom Google Search
Environment Variables:
 MONGOLAB_URI=<URI of Mongo DB>
 GOOGLE_API_KEY=<Google API key for the Google Custom Search>
 GOOGLE_CX_NUM=<Number of the Google Custom Search>
 GOOGLE_CX_APP=<App id of the Google Custom Search>

example Google CX: 0123456789:abcd-efg
 Number (CX_NUM) = 0123456789
 App id (CX_APP) = abcd-efg
