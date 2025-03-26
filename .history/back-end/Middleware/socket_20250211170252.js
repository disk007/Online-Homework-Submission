module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("add-assignment", (classroomIds) => {
          const rooms = Array.isArray(classroomIds)
              ? classroomIds.map(String)
              : [String(classroomIds)];
          
          // เก็บข้อมูลห้องใน socket.data.rooms
          socket.data.rooms = rooms;
          console.log(`User ${socket.id} rooms: ${socket.data.rooms}`);
  
          rooms.forEach((roomId) => {
              socket.join(roomId);
              console.log(`User ${socket.id} joined room: ${roomId}`);
          });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            // ลบข้อมูลห้องเมื่อผู้ใช้ disconnect
            delete socket.data.rooms;
        });
    });
};
