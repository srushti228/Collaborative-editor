const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var multer = require('multer');
var bodyParser = require('body-parser');
var db = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const  port = process.env.PORT || 5000;
const users = {}
/* App */
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket traffic
io.on('connection', (socket) => {
    // Relay chat data to all clients
   
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
      })
      
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
      })
      
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
      })
    
    socket.on('myInputUpdate', function(data) {
        socket.broadcast.emit('myInputUpdate', data);
    });
});


db.connect('mongodb://localhost:27017/editor', {useNewUrlParser: true, useUnifiedTopology: true });
db.connection.once('open',(err)=>{
    if(err)
        console.log("error in db connection");
    else
        console.log("db connected");
    
});
var schema = new db.Schema({
    
    doc_name: String,
    doc: String
});
var model = db.model("file",schema);

app.post("/",(req,res)=>{
  
  var data = new model({
    doc : req.body.data,
  
  doc_name: req.body.doc_name
});

  console.log(data);
  data.save((err,doc)=> {
    if(!err) {res.send(doc);console.log(doc);}
    else console.log("error in saving");
});

});


