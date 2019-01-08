/*
 * Hello World API
 *
 * Sends a polite greeting in JSONB format when you post something to /hello.
 *
 * Usage: HTTP_PORT=4000 node index.js
 */

const fs = require("fs");
const http = require("http");
const https = require("https");
const url = require("url");
const { StringDecoder } = require("string_decoder");

// get the HTTP port from the HTTP_PORT environment variable, or use port 4000 if that fails
const httpPort = !isNaN(parseInt(process.env.HTTP_PORT))
  ? parseInt(process.env.HTTP_PORT)
  : 4000;

// get the HTTPS port from the HTTPS_PORT environment variable, or use port 4001 if that fails
const httpsPort = !isNaN(parseInt(process.env.HTTPS_PORT))
  ? parseInt(process.env.HTTPS_PORT)
  : 4001;

// get the key and certificate from the CERT and KEY environment variablres (which may be undefined)
const cert = process.env.CERT;
const key = process.env.KEY;

// define the request listener
const requestListener = (req, res) => {
  // parse the URL
  const parsedUrl = url.parse(req.url, true);

  // get the (trimmed) path
  const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");

  // choose the handler for the path
  const pathHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : notFoundHandler;

  // read in the request payload
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", data => {
    buffer += decoder.write(data);
  });

  // create and send the response
  req.on("end", () => {
    // collect the request data
    const data = {
      trimmedPath,
      payload: buffer
    };

    // call the handler
    pathHandler(data, (statusCode, payload) => {
      // Set the response content type to JSON
      res.setHeader("Content-Type", "application/json");

      // Set the status code
      res.writeHead(statusCode);

      // Include the payload
      const payloadObject = typeof payload === "object" ? payload : {};
      res.end(JSON.stringify(payloadObject));
    });
  });
};

// define the hello handler
const helloHandler = ({ payload }, callback) => {
  const message = `Hello Valued Caller!
  
Thank you for calling this API. You have sent the following payload:

${payload}`;
  callback(200, { message });
};

// define the Not Found handler
const notFoundHandler = ({ trimmedPath }, callback) => {
  callback(404, { error: `Not Found: ${trimmedPath}` });
};

// define the router object
const router = {
  hello: helloHandler
};

// create the HTTP server
const httpServer = http.createServer(requestListener);

// start the HTTP server
httpServer.listen(httpPort, () =>
  console.log(`The server is listening on http://localhost:${httpPort}`)
);

// also create and start an HTTPS server if a key and certificate have been provided
if (cert && key) {
  // create the HTTPS server
  const serverOptions = {
    cert: fs.readFileSync(cert),
    key: fs.readFileSync(key)
  };
  const httpsServer = https.createServer(serverOptions, requestListener);

  // start the HTTPS server
  httpsServer.listen(httpsPort, () =>
    console.log(`The server is listening on https://localhost:${httpsPort}`)
  );
}
