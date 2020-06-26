const { Node, generateSecretKey } = require("flatend");
const { Readable } = require("stream");
const fs = require("fs");
var cv = require('opencv');
var window =  new cv.NamedWindow('Video', 0)

const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    addrs: [`:9000`],
    services: {},
  });

  setInterval(async () => {
    try {
      const stream = await node.push(["bootstrap"], {}, Readable.from([]));

      for await (const data of stream.body) {
        try {
          window.show(`${data}`);
        } catch (err) {

        }
        // try {
          // window.show(`${data}`);
          // window.blockingWaitKey(0, 50);
          // setInterval(async () => {
          //   var image = await camera.read( (err, im) => {
          //     if (err) throw err;
          //     data = im;
          //     console.log(im.size())
          //     if (im.size()[0] > 0 && im.size()[1] > 0) {
          //       if (err) throw err;
          //       window.show(im);
          //     }
          //     window.blockingWaitKey(0, 50);
          //   });
          //   return image
          // }, 100);
        // } catch (e) {
        //   console.log("Couldn't start camera:", e)
        // }
        console.log(
          `GOT ${data} byte(s) from service ["bootstrap"].`
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  }, 100);
};

main().catch((err) => console.error(err));