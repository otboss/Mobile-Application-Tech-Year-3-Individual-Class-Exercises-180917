//THIS FILE SOLVES THE PERCENTAGE OF TRAFFIC PER ROUTE

const threads = require('threads');
const spawn   = threads.spawn;
const exec = require('child_process').exec;
const fs = require('fs');

const execute = function(command, callback){
    exec(command, { maxBuffer: 1024 * 5000 }, function (error, stdout, stderr) { 
        callback(error, stdout, stderr); 
    });
};

//FIRST GET NUMBER OF LINES IN FILE

var threadsArr = [];


for(var x = 0; x < 3; x++){
	threadsArr.push(spawn(function(data, done) {
		// Everything we do here will be run in parallel in another execution context.
		// Remember that this function will be executed in the thread's context,
		// so you cannot reference any value of the surrounding code.
		const exec = require('child_process').exec;
		const fs = require('fs');
		const execute = function(command, callback){
			exec(command, { maxBuffer: 1024 * 5000 }, function (error, stdout, stderr) { 
				callback(error, stdout, stderr); 
			});
		};	  
		var resultObject = { };
		var fileLength = 0;
		
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
		
		
		done({ string : JSON.stringify(resultObject), integer : parseInt(input.string) });
	}));
}




process.argv.forEach(function (val, index, array) {
    const inputFile = val;
    if(typeof(array[2]) == "undefined"){
		throw new Error("Please specify and input file parameter!\n\n");
	}
    var resultObject = { };
    var fileLength = 0;
    
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

    const getFactors = function(num){
        var str = "0";
        for (var i = 1; i <= num; i++) {
            if (num % i == 0) {
                str += ',' + i;
            }
        }
        return(str.split(",").map(function(item){item = parseInt(item); return item}));
    }  


    execute('wc '+inputFile, function(err, data, stderr){
        fileLength = data.split(' ')[1];
        var factors = getFactors(fileLength);
        var splitter = 1;
        for(var x = 2; x < factors.length; x++){
            if(fileLength / factors[x] <= 20){
                try{
                    splitter = factors[x];
                    break;
                }
                catch(err){
                    splitter = factors[x-1];
                }
            }
            try{
                splitter = factors[2];
            }
            catch(err){
                console.log(err);
            }
        }

        var asyncArr = [];
        for(var x = 1; x < fileLength; x+=splitter){
            asyncArr.push(generatePromise(x, x+splitter));
        }

        Promise.all(asyncArr).then(function(data){
            
            
            const routes = Object.keys(resultObject);
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
                        "takers": resultObject[routes[x]], 
                        "size": JSON.stringify(resultObject[routes[x]] / routes.length * 100)+"%"
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
            console.log(sourceCounter)
            console.log(routesArr);

            /*fs.writeFile("./output.txt", JSON.stringify(resultObject),function(err){
                
            });*/
        });   
    });
});


