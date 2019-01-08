# Hello World API

A Hello World API, created as a homework assignment for the NodeJS Master Class.

## Installation

Just download or clone this repository.

You need NodeJS version 8 or higher for starting the server.

## Usage

You can start the server by executing

```bash
node index.js
```

or (if you have npm installed)

```bash
npm start
```

You can configure the server with the following environment variables.

Variable name | Explanation | Default value
--- | --- | ---
HTTP_PORT | Port for the HTTP server | 4000
HTTPS_PORT | Port for the HTTPS server | 4001
CERT | Path to the SSL certificate |
KEY | Path to the SSL key file |

An HTTPS server is launched only if both the `CERT` and `KEY` variable are set.

The server provides a single route, `/hello`, which sends back a message as a JSON object. The message includes the request payload.

## Examples

Start the HTTP server with default values.

```npm start```

Start the HTTP and HTTPS server on port 5000 and 5001, respectively. The SSL files are in a folder `https`.

```KEY=https/key.pem CERT=https/cert.pem HTTP_PORT=5000 HTTPS_PORT=5001 npm start```
