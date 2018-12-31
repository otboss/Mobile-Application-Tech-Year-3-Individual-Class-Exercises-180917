const threads = require('threads');
const spawn   = threads.spawn;

var threadsArr = [];


process.argv.forEach(function (val, index, array) {
    if(typeof(array[2]) == "undefined" || 0%parseInt(array[2]) != 0){
		throw new Error("Please specify the number of images parameter!\n\n");
	}
	const numberOfPictures = array[2];	
	//LET'S USE 4 THREADS
	for(var x = 0; x < 4; x++){
		threadsArr.push(spawn(function(data, done){
			const request = require('request');
			const imgConvert = require('image-convert');
			const fs = require('fs');		
			const threadId = data[2];
			const fetchImage = function(link, fname){
				return new Promise(function(resolve, reject){
					imgConvert.fromURL({
						url: link,
						quality: 80,
						output_format:"png",
						size: 300
					},function(err,buffer,file){
						if(!err){
							console.log(buffer);
							fs.writeFile("./imgs/"+fname+".png", buffer, (err) => {
							  if (err) throw err;
							  console.log('The file has been saved!');
							  resolve(true);
							});	
						}
						else{
							console.log(err);
						}
					});
				});
			}		
			fetchImage(data[0], data[1]);
			done({ string : "success", integer : threadId });
		}));
	}

	var img_urls = ['https://dummyimage.com/256x256/000/fff.jpg',
					'https://dummyimage.com/320x240/fff/00.jpg',
					'https://dummyimage.com/640x480/ccc/aaa.jpg',
					'https://dummyimage.com/128x128/ddd/eee.jpg',
					'https://dummyimage.com/720x720/111/222.jpg'];		

	for(var x = 1; x < numberOfPictures; x++){
		threadsArr[x%4].send([img_urls[x%5], String(x), x%4]);
	}
	
	console.log("\nstarted..\n");
	throw new Error("\n\nMain thread killed. Running in the background..\nThreads will be killed upon completion\n\n");
});

