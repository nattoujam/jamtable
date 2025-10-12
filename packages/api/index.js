import { Server } from "socket.io";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const rooms = new Map();
const users = [];

const createUser = (id, name) => {
  const user = { id, name };
  users.push(user);
  return user;
};

const findUser = (id) => {
  return users.find((user) => user.id === id);
};

const app = new Hono();
app.use("/api/*", cors());
app.get("/api/rooms", (c) => c.json(rooms.values().toArray()));

const port = 8080;

const httpServer = serve({
  fetch: app.fetch,
  port,
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  socket.on("create-room", (userName, roomName) => {
    const roomId = Date.now();

    const user = createUser(socket.id, userName);
    const room = { id: roomId, name: roomName, users: [user] };

    rooms.set(roomId, room);

    socket.join(roomId);

    io.to(roomId).emit("update-room", room);
  });

  socket.on("enter-room", (userName, roomId) => {
    const user = createUser(socket.id, userName);
    const room = rooms.get(roomId);

    if (!room) {
      console.log("error", roomId, rooms.keys());
      socket.emit("error", `部屋がありません: ${roomId}`);
      return;
    }

    users.push(user);
    room.users.push(user);

    socket.join(roomId);

    io.to(roomId).emit("update-room", room);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    io.to(socket.id).emit("update-room", null);

    const room = rooms.get(roomId);

    if (!room) {
      io.to(socket.id).emit("error", `部屋がありません: ${roomId}`);
      return;
    }

    const newUsers = room.users.filter((user) => user.id != socket.id);
    room.users = newUsers;

    if (room.users.length > 0) {
      io.to(roomId).emit("update-room", room);
    } else {
      rooms.delete(roomId);
    }
  });

  socket.on("send-chat", (roomId, message, timestamp) => {
    const user = findUser(socket.id);

    console.log(users);
    console.log(socket.id);

    if (!user) {
      console.log("error", user);
      io.to(socket.id).emit("error", "ユーザーが見つかりません");
      return;
    }

    console.log(user.name, "message", message);

    io.to(roomId).emit("receive-chat", {
      userName: user.name,
      message,
      timestamp,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    for (const [roomId, room] of rooms.entries()) {
      const userIndex = room.users.findIndex((user) => user.id === socket.id);
      if (userIndex !== -1) {
        room.users.splice(userIndex, 1);

        if (room.users.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("update-room", room);
        }
        break;
      }
    }
  });
});
