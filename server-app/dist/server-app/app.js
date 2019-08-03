"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const deck_class_1 = require("../client-app/src/app/class/deck.class");
const userManager_class_1 = require("./userManager.class");
const roomManager_class_1 = require("./roomManager.class");
const uuidv1 = require('uuid/v1');
var rooms = {};
var room_ids = [];
var UM = new userManager_class_1.UserManager();
var RM = new roomManager_class_1.RoomManager();
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});
io.on('connection', function (socket) {
    console.log('a user connected ');
    socket.on("getNewDeck", () => {
        console.log('Getting a new Deck of card!');
        let deck = new deck_class_1.Deck();
        deck.shuffleDeck(3);
        socket.deck = deck;
        socket.score = 0;
        socket.emit("action:getDeck", deck);
    });
    // Система авторизации пользователей
    //// Проверка на существование логина
    socket.on("checkLogin", (username) => {
        if (!UM.checkUser(username)) {
            var answer = { 'status': 0, message: 'Ok' };
        }
        else {
            var answer = { 'status': 1, message: 'This user exists! Try another name plz!' };
        }
        socket.emit('action:checkLoginResult', answer);
    });
    socket.on("login", (username) => {
        UM.addUser(username);
        console.log(`login ${username}`);
        //UM.clearDeadRooms(io);
        socket.username = username;
        socket.broadcast.emit("action:getUsersOnline", UM.getUsers());
        socket.emit("action:login", { username: username });
    });
    socket.on("unlogin", (username) => {
        console.log(`Unlogin ${username}`);
        UM.deleteUser(username);
        socket.broadcast.emit("action:getUsersOnline", UM.getUsers());
        socket.emit("action:logout");
    });
    socket.on("getUsersOnline", () => {
        console.log('Getting users online!');
        console.log(UM.getUsers());
        socket.emit("action:getUsersOnline", UM.getUsers());
    });
    socket.on('disconnect', function () {
        UM.deleteUser(socket.username);
        socket.broadcast.emit("action:getUsersOnline", UM.getUsers());
    });
    //////////////////////
    /// Комнаты
    var createNewGame = (data) => {
        let room = rooms[data.room_uuid];
        room.status = 'active';
        room.winner = 'undefined';
        for (let user of room.users) {
            if (data.username != user.username && user.username.indexOf('BotFor') == -1) {
                room.current_player = user.username;
                let card1 = room.deck.getCard();
                card1.faceUp();
                user.cards.push(card1);
            }
        }
        for (let user of room.users) {
            user.points = 0;
            user.cards = [];
            user.is_stoped = false;
        }
        room.deck = new deck_class_1.Deck();
        room.deck.shuffleDeck(3);
        //console.log(room);
        var sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var s = sockets[socketId];
            for (let user of room.users) {
                if (s.username === user.username) {
                    console.log(`send geting card to ${user.username}`);
                    s.emit('action:getRoom', room);
                }
            }
        }
    };
    socket.on('createRoom', function (data) {
        let room = roomManager_class_1.RoomManager.createRoom(data.owner, data.opponent);
        rooms[room.uuid] = room;
        var sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var s = sockets[socketId];
            for (let user of room.users) {
                if (s.username === user.username) {
                    console.log(`send invitation to ${user.username}`);
                    s.emit('action:createRoom', room);
                }
            }
        }
    });
    socket.on('getRoom', function (data) {
        console.log(`Getting room ${data.uuid} of ${socket.username}`);
        console.log(rooms);
        socket.emit('action:getRoom', rooms[data.uuid]);
    });
    socket.on("getCard", (data) => {
        console.log('Getting a new card!');
        let room = rooms[data.room_uuid];
        room.getCardByUser(data.username);
        //console.log(room);
        var sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var s = sockets[socketId];
            for (let user of room.users) {
                if (s.username === user.username) {
                    console.log(`send geting card to ${user.username}`);
                    room.hideOpponentCards(user.username);
                    s.emit('action:getRoom', room);
                }
            }
        }
    });
    var botMove = (socket, room) => {
        for (let user of room.users) {
            if (user.username.indexOf('BotFor') != -1) {
                room.getCardByUser(user.username);
                if (user.points < 17) {
                    console.log('Bot get card');
                    setTimeout(() => { botMove(socket, room); }, 2500);
                }
                else {
                    console.log('Bot finish');
                    room.stopGettingCardByUser(user.username);
                    /*
                    setTimeout(()=>{
                      console.log('Bot start');
                      let data = {room_uuid: room.uuid, username: user.username};
                      createNewGame(data);
                    },5000)
                    */
                }
                socket.emit('action:getRoom', room);
            }
        }
    };
    socket.on("stopGettingCard", (data) => {
        console.log('Stop getting card!');
        let room = rooms[data.room_uuid];
        botMove(socket, room);
        room.stopGettingCardByUser(data.username);
        //console.log(room);
        var sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var s = sockets[socketId];
            for (let user of room.users) {
                if (s.username === user.username) {
                    console.log(`send geting card to ${user.username}`);
                    room.hideOpponentCards(user.username);
                    s.emit('action:getRoom', room);
                }
            }
        }
    });
    socket.on("newGame", (data) => {
        console.log('New game!');
        createNewGame(data);
    });
    socket.on("changeBet", (data) => {
        let room = rooms[data.room_uuid];
        if (data.type == 'plus') {
            room.bet += 10;
        }
        else {
            room.bet -= 10;
        }
        var sockets = io.sockets.sockets;
        for (var socketId in sockets) {
            var s = sockets[socketId];
            for (let user of room.users) {
                if (s.username === user.username) {
                    s.emit('action:getRoom', room);
                }
            }
        }
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
//# sourceMappingURL=app.js.map