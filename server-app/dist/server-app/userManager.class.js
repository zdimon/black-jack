"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserManager {
    constructor() {
        this.users = [];
    }
    addUser(username) {
        this.users.push(username);
        this.createBot(username);
    }
    deleteUser(username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === username) {
                this.users.splice(this.users.indexOf(username), 1);
            }
        }
    }
    checkUser(username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === username) {
                return true;
            }
        }
        return false;
    }
    getUsers() {
        return this.users;
    }
    createBot(username) {
        let bot = {
            username: 'BotFor' + username,
            account: 100,
            is_stoped: false,
            points: 0,
        };
        var name = 'BotFor' + username;
        var is_exist = false;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i] === name) {
                is_exist = true;
            }
        }
        if (!is_exist)
            this.users.push(name);
        console.log(this.users);
    }
    clearDeadRooms(io) {
        for (let user of this.users) {
            let is_exist = false;
            console.log(`Cleaning ${user}`);
            var sockets = io.sockets.sockets;
            for (let socketId in sockets) {
                if (sockets[socketId].username == user)
                    is_exist = true;
            }
            if (!is_exist)
                this.users.splice(this.users.indexOf(user), 1);
        }
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=userManager.class.js.map