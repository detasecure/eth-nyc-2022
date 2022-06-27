import * as mockttp from "mockttp";

import { ethers } from "ethers";

let node_upstream = "<IP>:10002";
let proxy_port    = 8343;
const provider_selfhosted = new ethers.providers.JsonRpcProvider(node_upstream);

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
    }
  });


  server.forAnyRequest().withBodyIncluding("eth_sendRawTransaction").thenForwardTo(node_upstream, {
    beforeRequest: async (request) => {
      var req_json = await request.body.getJson();
      console.log("YAY!!!!!!!4");
      console.log(req_json);
    }
  });


  await server.start(proxy_port);

  // Print out the server details:
  console.log(`Server running on port ${server.port}`);
}

main();
