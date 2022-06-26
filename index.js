import * as mockttp from "mockttp";

import { ethers } from "ethers";

let node_upstream = "http://3.12.189.246:10002";
let proxy_port    = 8343;
const provider_selfhosted = new ethers.providers.JsonRpcProvider(node_upstream);

// const server = require("mockttp").getLocal();

const server = mockttp.getLocal();

async function main() {
  server.forAnyRequest().thenForwardTo(node_upstream, {
    beforeRequest: async (request) => {
      var req_json = await request.body.getJson();
      if(request.body.text && req_json) {
        if("method" in req_json) {
          if( req_json["method"] == 'eth_call') {
            let new_object = req_json;
            // new_object["params"][0]["data"] = '';
            console.log(JSON.stringify(new_object));
            return;
          }
        }
      }
      // console.log(request.body.text);
    }
  });


  server.forAnyRequest().withBodyIncluding("eth_sendRawTransaction").thenForwardTo(node_upstream, {
    beforeRequest: async (request) => {
      console.log("YAY!!!!!!!1");
      // console.log(request);
      // console.log("YAY!!!!!!!2");
      // console.log(request.body);
      // console.log("YAY!!!!!!!3");
      // console.log(request.body.text);
      var req_json = await request.body.getJson();
      console.log("YAY!!!!!!!4");
      console.log(req_json);
      // if(request.body.text && req_json) {
      //   if("method" in req_json) {
      //     if( req_json["method"] == 'eth_call') {
      //       let new_object = req_json;
      //       // new_object["params"][0]["data"] = '';
      //       console.log("YAY!!!!!!!5");
      //       console.log(JSON.stringify(new_object));
      //       return;
      //     }
      //   }
      // }
      // console.log(request.body.text);
    }
  });


  // server.forAnyRequest().withBodyIncluding("eth_sendRawTransaction").thenCallback((request) => {
  //   importantLog("FOUND TX TO INTERCEPT");
  //   if (request.body.text) {
  //     console.log(request.body.text);
  //     const interpret_as_json = JSON.parse(request.body.text);
  //     const txy = ethers.utils.parseTransaction(interpret_as_json.params[0])
  //     metamask_tx = txy;
      
  //     console.log("YAY!!!!!!!");

  //   }
  //   //return "close"
  //   server.stop();
  //   return "close";
  // })


  await server.start(proxy_port);

  // Print out the server details:
  console.log(`Server running on port ${server.port}`);
}

main();
