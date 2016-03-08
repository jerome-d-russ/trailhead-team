var https = require('https')  

https.get('https://developer.salesforce.com/forums/ForumsTrailheadProfile?userId=005F00000056D44IAE', function (response) {  
  var data = "";
  response.on('data', function(res){
  	data += res;
  });
  response.on('end', function(){
    //https://developer.salesforce.com/trailhead/profile
    var token = data.match(/(\?token=.*)\'\;/);
    console.log(token[1]);
    //https://developer.salesforce.com
    var pic = data.match(/\"(\/forums\/profilephoto\/\S*)\"/);
    console.log(pic[1]);

    var name = data.match(/\<li class=\"user_name\">(.*)<\/li>/);
    console.log(name[1]);

    // Print all of the news items on Hacker News 
    var jsdom = require("jsdom");
     
    jsdom.env({
      url: 'https://developer.salesforce.com/trailhead/profile' + token[1],
      scripts: ["http://code.jquery.com/jquery.js"],
      done: function (err, window) {
        var $ = window.$;
        var badges = [];
        $("img").each(function() {
          badges.push(this.src);
        });
        console.log(badges);
        var points = $(".trailhead-total-points b")[0].textContent;
        console.log(points);
      }
    });
  })
  response.on('error', console.error)  
})