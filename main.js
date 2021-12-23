const { app, BrowserWindow } = require("electron");

let mainWindow = null;

app.on("ready", () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadFile(__dirname + "/src/html/login.html");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
