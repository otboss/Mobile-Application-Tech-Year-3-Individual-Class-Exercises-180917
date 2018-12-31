//THIS FILE SOLVES THE PERCENTAGE OF TRAFFIC PER ROUTE

const threads = require('threads');
const spawn   = threads.spawn;
const exec = require('child_process').exec;

const execute = function(command, callback){
    exec(command, { maxBuffer: 1024 * 5000 }, function (error, stdout, stderr) { 
        callback(error, stdout, stderr); 
    });
};

const threadCount = 4;
const inputFile = "mas64fft_r01.trace";
console.log("Input File: "+inputFile);
console.log("Number of Threads: "+String(threadCount)+"\n");
execute("wc -l ./"+inputFile, function(error, numberOfLines){
    var resultObject = { };
    numberOfLines = numberOfLines.split(" ")[0];
    const threadShare = Math.floor(numberOfLines / 4);
    var threadsArr = [];

    for(var x = 0; x < threadCount; x++){
        //GENERATES THE THREADS IN AN ARRAY
        threadsArr.push(spawn(function(input, done) {
            // NEW THREAD SPAWNED
            var resultObject = { };
            const threadStartLine = Math.floor(input[0]);
            const threadEndLine = Math.floor(input[1]);
            const inputFile = input[2];
            const threadId = input[3];
            const exec = require('child_process').exec;
            const execute = function(command, callback){
                exec(command, { maxBuffer: 1024 * 5000 }, function (error, stdout, stderr) { 
                    callback(error, stdout, stderr); 
                });
            };
            //DEFINITION OF HOW MUCH PARALLEL (ASYNC) PROCESSES EACH THREAD IS TO PROCESS. (ADJUST BASED ON INPUT SIZE)
            const parallelAsyncProcesses = 10;

            var generatePromise = function(startLine, endLine){
                return new Promise(function(resolve, reject){
                    execute("sed -n '"+startLine+","+endLine+"p;' "+inputFile, function(err, data, stderr){
                        if(err)
                            console.log(err)
                        var result = data.split("\n");
                        for(var x = 0; x < result.length; x++){
                            if(typeof(resultObject[JSON.stringify(result[x])]) == "undefined"){
                                resultObject[JSON.stringify(result[x])] = 1;
                            }
                            else{
                                resultObject[JSON.stringify(result[x])] += 1;
                            }
                        }
                        console.log("RANGE: "+startLine+" - "+endLine+" COMPLETED");
                        resolve(true);
                    });
                }).catch(function(err){
                    console.log(err);
                });
            }
    
            var promiseArr = [];
            var incrementer = Math.floor((threadEndLine - threadStartLine) / parallelAsyncProcesses);

            for(var x = 0; x < parallelAsyncProcesses; x++){
                if(x == parallelAsyncProcesses - incrementer){
                    promiseArr.push(generatePromise(threadEndLine-incrementer, threadEndLine));
                }
                else{
                    promiseArr.push(generatePromise(x*incrementer+1, (x+1)*incrementer));
                }
            }

            Promise.all(promiseArr).then(function(output){
                console.log("TASK COMPLETED ON THREAD "+String(threadId+1)+" killing..");
                done(resultObject);
            }).catch(function(error){
                console.log(error);
            });
        }));
    }
    
    var globalResultsObject = {};
    var threadsDone = 0;

    for(var x = 0; x < threadCount; x++){
        if(x == threadCount - 1){
            console.log("RANGE FOR THREAD "+String(x+1)+" IS "+String(numberOfLines-threadShare-1)+"-"+String(numberOfLines)+"\n");
            threadsArr[x].send([numberOfLines-threadShare-1, numberOfLines, inputFile, x]).on('message', function(response) {
                globalResultsObject = [globalResultsObject, response].reduce((a, obj) => {
                    Object.entries(obj).forEach(([key, val]) => {
                        a[key] = (a[key] || 0) + val;
                    });
                    return a;
                });                
                threadsDone++;
            });
        }
        else{
            console.log("RANGE FOR THREAD "+String(x+1)+" IS "+String(x*threadShare+1)+"-"+String((x+1)*threadShare));
            threadsArr[x].send([x*threadShare+1, (x+1)*threadShare, inputFile, x]).on('message', function(response) {
                globalResultsObject = [globalResultsObject, response].reduce((a, obj) => {
                    Object.entries(obj).forEach(([key, val]) => {
                        a[key] = (a[key] || 0) + val;
                    });
                    return a;
                });  
                threadsDone++;
            });
        }
    }
    
    var listner = setInterval(function(){
        if(threadsDone == threadCount){
            //ALL THERADS COMPLETED THEIR TASKS AT THIS POINT
            clearInterval(listner);    
            console.log("\nALL DONE");
            const routes = Object.keys(globalResultsObject);
            routes.forEach(function(key) {
                globalResultsObject[key] = globalResultsObject[key] / threadCount;
            });   
            var routesArr = [];
            var sourceCounter = {};
            for(var x = 0; x < routes.length; x++){
                var tmp = routes[x].split(',');
                if(typeof(tmp[1]) != "undefined" && typeof(tmp[2]) != "undefined"){
                    if(typeof(sourceCounter[tmp[1]]) == "undefined")
                        sourceCounter[tmp[1]] = 1;
                    else
                        sourceCounter[tmp[1]]++;
                    routesArr.push(
                        {
                        "time": tmp[0].replace(/"/g, ""), 
                        "source": tmp[1].replace(/"/g, ""), 
                        "destination": tmp[2].replace(/"/g, ""), 
                        "takers": globalResultsObject[routes[x]], 
                        "size": JSON.stringify(globalResultsObject[routes[x]] / routes.length * 100)+"%"
                        }
                    );
                }
            }

            for(var x = 0; x < routesArr.length; x++){
                var takersForRoute = parseInt(sourceCounter[routesArr[x]["source"]]);
                routesArr[x]["sizeForRoute"] = JSON.stringify(parseInt(routesArr[x]["takers"]) / takersForRoute * 100)+"%";
            }

            routesArr = routesArr.sort(function(a, b) {
                return parseFloat(b.takers) - parseFloat(a.takers);
            });
            console.log(sourceCounter);
            console.log(routesArr);
        }
    },1000);
});
