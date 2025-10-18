import { Server } from "socket.io";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

const rooms = new Map();
const users = []; // { id: string | null, name: string }

const findUser = (id) => {
  return users.find((user) => user.id === id);
};

const app = new Hono();
app.use("/api/*", cors());

app.post("/api/login", async (c) => {
  const { userName } = await c.req.json();
  if (!userName) {
    return c.json({ error: "userName is required" }, 400);
  }
  let user = users.find((u) => u.name === userName);
  if (!user) {
    user = { id: null, name: userName };
    users.push(user);
  }
  console.log("login:", users);
  return c.json(user);
});

app.post("/api/logout", async (c) => {
  const { userName } = await c.req.json();
  if (!userName) {
    return c.json({ error: "userName is required" }, 400);
  }
  const userIndex = users.findIndex((u) => u.name === userName);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
  console.log("logout:", users);
  return c.json({ message: "Logged out successfully" });
});

app.get("/api/rooms", (c) => c.json(Array.from(rooms.values())));

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
  console.log("a user connected", socket.id);

  socket.on("create-room", (userName, roomName) => {
    let user = users.find((u) => u.name === userName);
    if (!user) {
      socket.emit("error", `User not logged in: ${userName}`);
      return;
    }
    user.id = socket.id;

    const roomId = Date.now().toString();
    const room = { id: roomId, name: roomName, users: [user] };
    rooms.set(roomId, room);
    socket.join(roomId);
    io.to(roomId).emit("update-room", room);
  });

  socket.on("enter-room", (userName, roomId) => {
    let user = users.find((u) => u.name === userName);
    if (!user) {
      socket.emit("error", `User not logged in: ${userName}`);
      return;
    }
    user.id = socket.id;

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("error", `Room not found: ${roomId}`);
      return;
    }

    if (!room.users.find((u) => u.name === userName)) {
      room.users.push(user);
    }

    socket.join(roomId);
    io.to(roomId).emit("update-room", room);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    io.to(socket.id).emit("update-room", null);

    const room = rooms.get(roomId);
    if (!room) {
      io.to(socket.id).emit("error", `Room not found: ${roomId}`);
      return;
    }

    room.users = room.users.filter((user) => user.id !== socket.id);

    if (room.users.length > 0) {
      io.to(roomId).emit("update-room", room);
    } else {
      rooms.delete(roomId);
    }
  });

  socket.on("send-chat", (roomId, message, timestamp) => {
    const user = findUser(socket.id);
    if (!user) {
      io.to(socket.id).emit("error", "User not found");
      return;
    }
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
    const user = findUser(socket.id);
    if (user) {
      user.id = null;
    }
    console.log("disconnect:", users);
  });
});

console.log(`Server is running on port ${port}`);