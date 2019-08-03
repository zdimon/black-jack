export class UserManager {
  users: string[] = [];

  addUser(username: string): void {
      this.users.push(username);
      //this.createBot(username);
  }


  deleteUser(username: string): void {
    for(let i=0; i<this.users.length; i++)
    {
        if(this.users[i]===username){
          this.users.splice(this.users.indexOf(username),1);
        }
    }
  }
  checkUser(username: string): boolean{
    for(let i=0; i<this.users.length; i++)
    {
        if(this.users[i]===username){
          return true;
        }
    }
    return false;
  }

  getUsers(): any{
    return this.users;
  }

  createBot(username: string){
    let bot = {
      username: 'BotFor'+username,
      account: 100,
      is_stoped: false,
      points: 0,
    }
    var name = 'BotFor'+username;
    var is_exist = false;
    for(let i=0; i<this.users.length; i++)
    {
        if(this.users[i]===name){
          is_exist = true;
        }
    }
    if(!is_exist) this.users.push(name);
    console.log(this.users);
  }

  clearDeadRooms(io: any){
    for(let user of this.users){
      let is_exist = false;
      console.log(`Cleaning ${user}`)
      var sockets = io.sockets.sockets;
      for(let socketId in sockets){
        if (sockets[socketId].username == user) is_exist = true;
      }
      if(!is_exist && user.indexOf('BotFor') == -1) this.users.splice(this.users.indexOf(user),1);
    }
  }

}
