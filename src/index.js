import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "url";

const p = fileURLToPath(new URL("../public/", import.meta.url));
const p2 = fileURLToPath(new URL("../views/", import.meta.url));


const bare = createBareServer("/bare/");
const app = express();

app.set('view engine', 'pug');
app.set('views', p2);

// Load our publicPath first and prioritize it over UV.
app.use(express.static(p));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use("/uv/", express.static(uvPath));

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/hwhelp', (req, res) => {
  res.render('hwhelp')
})

app.get('/panic', (req, res) => {
  res.render('panic')
})

app.get('/games', (req, res) => {
  res.render('games')
})

app.get('/contactus', (req, res) => {
  res.redirect('/discord')
})

app.get('/discord', (req, res) => {
  res.redirect("https://discord.gg/homeworkhelp")
})

app.get('/privacy', (req, res) => {
  res.render("privacy")
})

app.get('/links', (req, res) => {
  res.render("links")
})

app.get('/use', (req,res) => {
  if (!req.query.game) {
    return res.redirect('/hwhelp')
  }
  let game = req.query.game

  res.render('use', {game: game})
})


// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 3010;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});
