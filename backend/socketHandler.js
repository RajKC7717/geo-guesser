// socketHandler.js
const socketIO = (io) => {
    let games = new Map();
  
    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);
      const storedSocketId = socket.handshake.auth.id;
      const roomId = socket.handshake.auth.roomId;
  
      console.log("🔄 Stored ID:", storedSocketId);
  
      if (storedSocketId) {
        const game = games.get(roomId);
        if (game) {
          const playerExists = game.players.some(
            (player) => player.id === storedSocketId
          );
  
          if (playerExists) {
            socket.join(roomId);
            io.to(roomId).emit("receiveGame", games.get(roomId));
          }
        }
      }
  
      socket.on("joinGame", (data) => {
        const roomCode = data.roomCode;
        const player = {
          name: data.name,
          color: data.chosenColor,
          position: [0, 0],
          id: socket.id,
        };
  
        console.log("🎮 joinGame:", player);
  
        if (!games.get(roomCode)) {
          games.set(roomCode, { players: [player] });
        } else {
          games.set(roomCode, {
            players: [...games.get(roomCode).players, player],
          });
        }
  
        io.to(roomCode).emit("receiveGame", games.get(roomCode));
      });
  
      socket.on("joinRoom", (data) => {
        const roomCode = data.roomCode;
        console.log("🔗 joinRoom:", roomCode);
        socket.join(roomCode);
        io.to(roomCode).emit("receiveGame", games.get(roomCode));
      });
  
      socket.on("getGame", (roomCode) => {
        socket.emit("receiveGame", games.get(roomCode));
      });
  
      socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
  
        for (const [roomCode, game] of games.entries()) {
          const updatedPlayers = game.players.filter(
            (player) => player.id !== socket.id
          );
          if (updatedPlayers.length === 0) {
            games.delete(roomCode);
          } else {
            games.set(roomCode, { players: updatedPlayers });
          }
  
          io.to(roomCode).emit("receiveGame", games.get(roomCode));
        }
      });
    });
  };
  
  export default socketIO;
  