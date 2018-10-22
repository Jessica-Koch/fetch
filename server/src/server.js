const app = require('./app');
const http = require('http')

const port = parseInt(process.env.PORT, 10) || 5000;
app.set('port', port)
server.listen(port);

server.on('listening', () => {
    console.log(`server is listening for requests on port ${server.address().port}`);
})