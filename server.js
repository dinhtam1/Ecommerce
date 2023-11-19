const app = require("./src/app");
const port = 3001
const server = app.listen(port, () => {
    console.log("listening on port " + port);
});

process.on('SIGINT' , () => {
    server.close( () => console.log("Server closed"));
})
