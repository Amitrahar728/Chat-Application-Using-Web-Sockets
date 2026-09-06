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

//asking env for port if vaha nhi h tohh 8080 utha lo 
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

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

  socket.on('close', () => {
    allSockets = allSockets.filter(x => x.socket !== socket);
    console.log(`User disconnected | remaining: ${allSockets.length}`);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
