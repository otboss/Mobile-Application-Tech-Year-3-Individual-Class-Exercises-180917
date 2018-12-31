const threads = require('threads');
const spawn = require('threads').spawn;
 
const thread = spawn(function (input, done) {
  // Remember that this function will be run in another execution context.
  done("HELLO WORLD");
});

var res = [];

thread
  .send([ 9, 12 ])
  // The handlers come here: (none of them is mandatory)
  .on('message', function(response) {
    console.log(response)
    //res.push(response);
    thread.kill();
  });

  setTimeout(function(){
    console.log(res);
  }, 5000);
  