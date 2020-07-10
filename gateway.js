const {
  Node,
  generateSecretKey
} = require("flatend");

const send = async(ctx) => {
  try{
    var abb =  await ctx.body({limit: 65536})
    console.log(abb );
  } catch (err){
    console.log('error')
    console.log(err)
  }

};

const main = async () => {
  const node = await Node.start({
    secretKey: generateSecretKey(),
    bindAddrs: [`:9000`],
    services: {
      node: send
    }
  });
};

main().catch((err) => console.error(err));