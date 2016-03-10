var http = require("http");
var https = require('https');

var server = http.createServer(function(request, ttResponse) {
  if(request.url.substr(0,6) == "/?url="){
    ttResponse.writeHead(200, {"Content-Type": "text/html"});
    ttResponse.write("<html>");
    ttResponse.write("<head>");
    ttResponse.write("<title>Trailhead Champions</title>");
    ttResponse.write("</head>");
    getTrailheadStats(ttResponse, request.url.substr(6,request.url.length));
  }
});

server.listen(8080);
console.log("Server is listening");

function getTrailheadStats(ttResponse, ttUrl){
  https.get(ttUrl, function (response) {  
    var data = "";
    response.on('data', function(res){
      data += res;
    });
    response.on('end', function(){
      var token = data.match(/(\?token=.*)\'\;/)[1];
      var pic = data.match(/\"(\/forums\/profilephoto\/\S*)\"/)[1];
      var name = data.match(/\<li class=\"user_name\">(.*)<\/li>/)[1];
      
      ttResponse.write("<body>");
      ttResponse.write("<div style=\"float:left; display:table; width:24%; height:100%\">");
      ttResponse.write("<div style=\"display:table-cell; vertical-align:middle\">");
      ttResponse.write("<h2 style=\"font-size:5em; text-align:center\">" + name + "</h2>");
      ttResponse.write("<img src=\"https://developer.salesforce.com" + pic + "\" style=\"display:block; margin:auto\"/>");

      // Print all of the news items on Hacker News 
      var jsdom = require("jsdom");
       
      jsdom.env({
        url: 'https://developer.salesforce.com/trailhead/profile' + token,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (err, window) {
          var $ = window.$;
          var points = $(".trailhead-total-points b")[0].textContent;

          ttResponse.write("<h2 style=\"font-size:10em; text-align:center\">" + points + "</h2>");
          ttResponse.write("</div>");
          ttResponse.write("</div>");
          ttResponse.write("<div style=\"float:left; display:table; width:74%; height:100%; text-align: center\">");
          ttResponse.write("<div style=\"display:table-cell;vertical-align:middle;overflow:hidden\">");

          $("img").each(function() {
            ttResponse.write("<img src=\"" + this.src + "\"/>\n");
          });

          ttResponse.write("</div>");
          ttResponse.write("</div>");
          ttResponse.write("</body>");
          ttResponse.write("</html>");
          ttResponse.end();
        }
      });
    })
    response.on('error', console.error)  
  })
}

