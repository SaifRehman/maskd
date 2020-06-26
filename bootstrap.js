var cv = require('opencv');
const {
  Node,
  generateSecretKey
} = require("flatend");
const {
  Readable
} = require("stream");
const fs = require("fs");
const send = async (ctx) => {
  fs.createReadStream("bootstrap.js").pipe(ctx);
}
const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    bindAddrs: [`:9000`],
    services: {
      bootstrap: send
    }
  });
  const handler = async (im) => {
    console.log('immm iss', im)
    const stream = await node.push(["bootstrap"], {}, Readable.from(im));
    return im;
  }
  try {
    var camera = await new cv.VideoCapture(0);
    var window = await new cv.NamedWindow('Video', 0)
    setInterval(async () => {
      // const example = async () => {
      var image = await camera.read( (err, im) => {
        if (err) throw err;
        console.log(im.size())
        if (im.size()[0] > 0 && im.size()[1] > 0) {
          if (err) throw err;
          window.show(im);
          try{
            handler(im).then(data => {
              console.log(data);
            }, error => {
              // console.log('we have an error', err)
            })
          } catch(err){
            console.log('fuci', err)
          }
        }
        window.blockingWaitKey(0, 50);
      });
      return image
    // }
    // example().then(img => {
    //   console.log('img iss',img);
      
    // }, error => {
    //   console.log('error')
    // })
    }, 100);
  } catch (e) {
    console.log("Couldn't start camera:", e)
  }
};

main().catch((err) => console.error(err));