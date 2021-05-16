const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
app.use(cors())
const server = require('http').Server(app);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const io = require('socket.io')(server);

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'));


app.get('/', (req,res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req,res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })
})


const PORT = process.env.PORT || 443;

server.listen( PORT, ()=>{
    console.log(`Server running on ${PORT}`);
});


