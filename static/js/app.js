// Keep track of how many messages were sent
var messageLastSeen = {};
var myMessageCount = 0;
var missedMessages = 0;


// Keep track of where the mouse is and whether it's moved across a grid.
var mouseMoved = false;
var lastX, lastY;


/** Move mouse
* @param {number} x x coordinate.
* @param {number} y y coordinate.
*/
function mouseMove(x, y) {
   // Only one update per frame.
   if (mouseMoved) {
       return;
   }

   mouseMoved = (x != lastX || y != lastY);

   // Only color if you've moved a significant amount.
   if (mouseMoved) {

       lastX = x;
       lastY = y;
       console.log("new x: "+x);
       console.log("new y: "+y);
   }
}

/** Standard requestAnimFrame; see paulirish.com */
window.requestAnimFrame = (
   function(callback) {
     return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback) {
           window.setTimeout(callback, 1000 / 30);
         };
   })();

/** Draw canvas once per frame. */
function animate() {
 // draw
 //var canvas = document.getElementById('canvas');

 //render(canvas.getContext('2d'));
 // request new frame
 requestAnimFrame(function() {
   animate();
   // Send a message if you've moved.
   if (mouseMoved) {
     myMessageCount++;
     gapi.hangout.data.sendMessage(
         JSON.stringify([myMessageCount,
                         lastX,
                         lastY]));
     mouseMoved = false;
    console.log("sent message");
     console.log("hi rush");
    console.log("foo1: " + document.getElementById("foo1"));
    console.log("otherCursor: " + document.getElementById("otherCursor"));
    console.log("bar1: " + document.getElementById("bar1"));
    console.log("bye rush");
   }
 });
}



/** Draw missing packets, if packets are missing. */
function showLossRates() {
 var div = document.getElementById('eventsSent');
 var retVal = 'Missed messages: ' + missedMessages;

 div.innerHTML = retVal;
}

var missedPackets = 0;

/** Count any dropped packages.  Compare incoming message count
* to the number of messages we've seen; any discrepancy counts
* as one miss.
* @param {string} senderid Participant id of sender.
* @param {number} messageid last number send.
*/
function droppedPackageCount(senderid, messageid) {
 if (messageLastSeen[senderid] != messageid - 1) {
   missedPackets++;
 }
 messageLastSeen[senderid] = messageid;

 console.log('message id = ' + messageid);
}

/** Get a message.
* @param {MessageReceievedEvent} event An event.
*/
function onMessageReceived(event) {
 try {
   var data = JSON.parse(event.message);

   console.log("x-value:"+data[1]);
    console.log("y-value:"+data[2]);
     document.getElementById("otherCursor").style.left=otherX;
    document.getElementById("otherCursor").style.top=otherY;
   //droppedPackageCount(event.senderId, parseInt(data[0]));
   //showLossRates();
 } catch (e) {
   console.log(e);
 }
}

/** Kick off the app. */
function init() {
  console.log("initing");
  
 // When API is ready...
 gapi.hangout.onApiReady.add(
     function(eventObj) {
       if (eventObj.isApiReady) {
         try {
           gapi.hangout.data.onMessageReceived.add(onMessageReceived);

           document.onmousemove = function(e) {
             var ev = e || window.event;
             mouseMove(ev.clientX,
                       ev.clientY);
           };

           animate();
         } catch (e) {
           console.log('init:ERROR');
           console.log(e);
         }
       }
     });
}


// Wait for gadget to load.                                                       
gadgets.util.registerOnLoadHandler(init);

$(document).ready(function() {
    $(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
});
