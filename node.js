var cv = require('opencv');
const { Readable } = require("stream");

const {
  Node,
  generateSecretKey
} = require("flatend");
const send = async(ctx) => await ctx.body();

const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    bindAddrs: [`:9000`],
    services: {
      node: send
    }
  });

  setInterval( async () => {
    try {
      const stream = await node.push(["node"], {}, Readable.from([]));
      for await (const data of stream.body) {
        console.log(
          `GOT ${data} byte(s) from service ["node"].`
        );
      }
    } catch (err) {
      console.log('error')
      console.error(err.message);
    }
  }, 100);
};

main().catch((err) => console.error(err));