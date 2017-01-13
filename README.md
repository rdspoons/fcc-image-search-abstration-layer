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

