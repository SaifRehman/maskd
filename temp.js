var cv = require("opencv");
// const { Node, generateSecretKey } = require("flatend");
// const { Readable } = require("stream");
// const fs = require("fs");
// const send = async (ctx) => {
//     fs.createReadStream("bootstrap.js").pipe(ctx);
// }
// const main = async () => {
//   const node = await Node.start({
//     secretKey: generateSecretKey(),
//     bindAddrs: [`:9000`],
//     services: {
//       bootstrap: send
//     }
//   });
  setInterval(async () => {
    try {
        var camera =  new cv.VideoCapture(0);
        var window =  new cv.NamedWindow("Video", 0);
         camera.read(function(err, im) {
            if (err) throw err;
            console.log(JSON.stringify(im));
            if (im.size()[0] > 0 && im.size()[1] > 0) {
              if (err) throw err;
            //   window.show(im);
            }
            window.blockingWaitKey(0, 50);
          });
          // try {
          // } catch(err){
          //   const stream = await node.push(["node"], {}, Readable.from([]));
          // }
      } catch (e) {
        console.log("Couldn't start camera:", e);
      } 
  }, 100);

// };

// main().catch((err) => console.error(err));
