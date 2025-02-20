module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("add-assignment", (classroomIds) => { 
          const rooms = Array.isArray(classroomIds) 
              ? classroomIds.map(String) 
              : [String(classroomIds)]; // ✅ แปลงเป็น array เสมอ
      
          // 🔥 บันทึกห้องที่ user เข้าร่วม
          socket.data.rooms = rooms;
          console.log("rooms ",rooms)
      
          rooms.forEach((roomId) => {
              socket.join(roomId);
              console.log(`✅ User joined room: ${roomId}`);
          });
        });
      

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
