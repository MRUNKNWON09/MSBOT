const login = require("fca-unofficial");
const fs = require("fs");

const appStateFile = "./appstate.json";

if (!fs.existsSync(appStateFile)) {
  console.error("Error: appstate.json file not found!");
  process.exit(1);
}

const appState = require(appStateFile);

login({ appState }, (err, api) => {
  if (err) {
    console.error("Login error:", err);
    return;
  }

  api.setOptions({ listenEvents: true });

  api.listenMqtt((err, event) => {
    if (err) {
      console.error(err);
      return;
    }

    if (event.type === "message" && event.body) {
      const msg = event.body.toLowerCase().trim();
      const threadID = event.threadID;

      if (msg === "/start") {
        api.sendMessage("ami ready testing bot", threadID);
      }
    }
  });

  console.log("Bot started, waiting for messages...");
});
