// import { WebSocketServer , WebSocket } from 'ws'; 
// // websocket hmesha install kro bcs java m apna bhi ek websocket hota hai 

// const wss = new WebSocketServer({port : 8080});

// interface User {
//     socket: WebSocket;
//     room : string;
// }
// let usercount =0;
// let allSockets : User[] = []; // ek global variable jo msgs store krega 

// wss.on("connection" , (socket)=>{


//     socket.on("message" , (message)=>{
//         const parsedmessage= JSON.parse(message as unknown as string);
//         if(parsedmessage.type == "join"){
//             allSockets.push({
//                 socket, 
//                 room : parsedmessage.payload.roomId
//             })
//         }
//         if(parsedmessage.type == "chat"){
//             const currentUser = allSockets.find((x) => x.socket == socket);
//             const currentRoom = currentUser?.room;
//             if (!currentRoom) return;

//             for(let i = 0; i < allSockets.length; i++){
//                 if(allSockets[i]?.room === currentRoom){
//                     allSockets[i]?.socket.send(parsedmessage.payload.message);
//                 }
//             }
//         }
//     })
// })

// // now this code is perfectly working going to particular room which we need 





























// //  whenever connection made this socket callback is called with reference to this socket 
// // wss.on("connection" , (socket)=>{
// //     allSockets.push(socket); // yaha saare socket store hogaye 

// //     usercount = usercount + 1; // jab bhi new connect hoga add hojayega count m ;

// //     console.log("user connected #" + usercount);

// //     socket.on("message" , (message) =>{
// //         console.log("message received " + message.toString());
// //         for(let i =0; i<allSockets.length ; i++){ // yaha hmne jo bhi connected sockets hai unko bhej diya 
// //             const s = allSockets[i];
// //             s?.send(message.toString() + ": sent from the server from");
// //         }
// //     })
// //     socket.on("disconnect" , ()=>{
// //         allSockets = allSockets.filter(x => x != socket )
// //     })

// // })




import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });  // we created a websocket server 

interface User {
  socket: WebSocket;
  room: string;
}
// we can use a map approach here but we defined a array here which will provide more depth
let allSockets: User[] = [];

// wss.on  is similar to we can say a express route but there are no methods here list post and get 
// every time connection is build with server of some user a new socket is created 
wss.on('connection', (socket) => {
  socket.on('message', (message) => {
    const parsed = JSON.parse(message as unknown as string);
    
    if (parsed.type === 'join') {
      allSockets.push({ socket, room: parsed.payload.roomId });
      console.log(`User joined room: ${parsed.payload.roomId} | total: ${allSockets.length}`);
    }

    if (parsed.type === 'chat') {
      const currentUser = allSockets.find(x => x.socket === socket);
      const currentRoom = currentUser?.room;
      if (!currentRoom) return;



      for (const user of allSockets) {
        if (user.room === currentRoom && user.socket !== socket) {
          user.socket.send(parsed.payload.message);
        }
      }
    }
  });

  socket.on('close', () => { // the time when some user is leaving the rooms

    allSockets = allSockets.filter(x => x.socket !== socket);
    console.log(`User disconnected | remaining: ${allSockets.length}`);

  });
});

console.log('WebSocket server running on ws://localhost:8080');


 

// in websockets we can only send strings so we have to convert everything in string 



// first we do wss.on and socket.on and this creates a one way communication between browser and server 
// sent back by socket.send() to send msg from server to browser



// then comes the message is broadcasted to everyone connected to the server .
// every time wss.on happens all the sockets will be pushed inside a array of sockets outside defined globally defined as let allsockets: WebSocket[] = [];
// and define a for(let i =0; allSockets.length; i++){
//  const s = allSockets[i]; and then s.send() the message to them which is recieved via socket.on("message" , (message))} // the time we hit this message point 
// as the socket have a type of Websocket(click kr krke hum type bhi dikha shkte h iska) and then install Websocket also at top from ws and Define the type of array 



// Room logic in websockets :
// we will create a array of Type USER interface which consist of socket and particular room id 




// furthermore we can introduce more websocket servers and we can also introduce a PUB sub at top of servers 
// we can define avatarurl and name of the user via creating their profiles and login window 
