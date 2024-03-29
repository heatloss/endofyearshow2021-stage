class Player {
  constructor(id, socket, name, role) {
    this.id = id
    this.x = 0
    this.y = 0
    this.name = name
    this.role = role
    this.$socket = socket
  }
  
  update(x,y,socket, id, name, role) {
    x = ((x / window.innerWidth) * 100).toFixed(2);
    y = ((y / window.innerHeight) * 100).toFixed(2); 
    this.emit(socket, id, name, role, x, y)
    return {
      id: id,
      x: x,
      y: y,
      name: name,
      role: role
    }
    
  }
  
  emit(socket, id, name, role, x, y) {
    console.log(socket)
    console.log({ friend: id, friendX: x, friendY: y, name: name, role: role})
    socket.client.emit('move',{ friend: id, friendX: x, friendY: y, name: name, role: role});
  }
  
}

class Friend extends Player {
  
  constructor(id, name, role){
    super()
    this.id = id;
    this.x  = 0;
    this.y  = 0;
    this.dx = 0;
    this.dy = 0;
    this.idx = 'friend-'+id;
    this.name = name
    this.role = role
    this.element = false;
  }
  
  newFriends(socket){
        socket.Friends = {}
  }
  
  message(msg) {
    console.log(msg)
  }
  
  add(friend, friends, fullFriend){
    const label = this.doLabel(friend.id);
    this.idx = label;
    if (!document.getElementById(label)){
    if (this.idx != "friend-undefined" && fullFriend){
    console.log(fullFriend.name)
    console.log(fullFriend.role)
    friends[label] = friend;
    this.element = document.createElement("div")
    this.element.id = this.idx
    this.element.classList.add('friend')
    this.element.classList.add(fullFriend.role)
    const name = document.createElement("div")
    name.classList.add("name")
    name.classList.add(fullFriend.role)
    name.innerHTML = fullFriend.name
    this.element.appendChild(name)
    document.getElementById("cursorscontainer").appendChild(this.element)
    document.getElementById(label).style.left = fullFriend.lastLocation[0] + '%' 
    document.getElementById(label).style.top = fullFriend.lastLocation[1] + '%'
    } else if (this.idx != "friend-undefined"){
    friends[label] = friend;
    this.element = document.createElement("div")
    this.element.id = this.idx
    this.element.classList.add('friend')
    document.getElementById("cursorscontainer").appendChild(this.element)
    }
      }
    }
   
  
  remove(id, friends){
    const label = this.doLabel(id);
    if (document.getElementById(label)){
    document.getElementById(label).remove()
    }
    
    if ( friends[label] ) {
        delete friends[label];
    }

  }
  
  update(data, friends){
    const label = this.doLabel(data.friend);
    // console.log(data)    
    if (document.getElementById(label)){
    document.getElementById(label).style.left = data.friendX + '%' 
    document.getElementById(label).style.top = data.friendY + '%'
    } else {
      console.log(data)
    if (label != "friend-undefined"){
    const friend = new Friend(data.friend, data.name, data.role);
    if (friend) {
    friends[label] = friend;
    this.element = document.createElement("div")
    this.element.id = label
    this.element.classList.add('friend')
    this.element.classList.add(data.role)
    const name = document.createElement("div")
    name.classList.add("name")
    name.classList.add(data.role)
    name.innerHTML = data.name
    this.element.appendChild(name)
    document.getElementById("cursorscontainer").appendChild(this.element)
    document.getElementById(label).style.left = data.friendX + '%' 
    document.getElementById(label).style.top = data.friendY + '%'
      }
    }
    }
  }
  
  updateName(id, player, Meeting, name, role, fullFriend){
        // window.app.mount(document.getElementById("app"));
    const label = this.doLabel(id);
    console.log(label)
    console.log(id, player, Meeting, name, role, fullFriend)
    console.log(document.getElementById(label)) //"undefined though???? FIX THE DATA VUE CAN'T SEE THE CURSOR THAT WAS ADDED DYNAMNICALLY WITHOUT IT" //undefined
    var labelwithquotes = "\"" + label + "\""
    console.log(labelwithquotes)
    console.log(document.body)
    console.log(document.getElementById(labelwithquotes)) //also undefined,,,, I need to add vue to these elements on creation.... but.........
          if (document.getElementById(label).classList.contains("undefined")){
        document.getElementById(label).classList.remove("undefined")
      }
    // console.log(document.getElementById(label).classList.contains(role))
    if (!document.getElementById(label).classList.contains(role)){
    document.getElementById(label).classList.add(role)
    const newName = document.createElement("div")
    newName.classList.add("name")
    newName.classList.add(role)
    newName.innerHTML = name
    if (document.getElementById(label).children.length < 2 ){
    document.getElementById(label).appendChild(newName)
    }
    }
  }
  
  doLabel(id){
    return 'friend-'+id;
  }
  
}

class Meeting {
  constructor(){
        this.player = false;
        this.friends = {}
        this.friend = new Friend();
        Meeting.bind(this)
  }
  
  createFriend(id, player, friends, name, role, fullFriend){
    if ( player && player == id ) {
    return;
    }
    const friend = new Friend(id, name, role);
    if (friend) {
      if (friend.name === undefined){
        
      }else {
        console.log(friend)
        this.friend.add(friend, friends, fullFriend);}
    }
    
  }
  
  removeFriend(self, id, meeting){
    this.friend.remove(id, this.friends);
}
  
  updateFriend(data){
    this.friend.update(data, this.friends)
  }
  
  updateFriendName(id, player, Meeting, name, role, fullFriend){
    this.friend.updateName(id, player, Meeting, name, role, fullFriend)
  }
  
    
}


export {Player, Friend, Meeting}