module.exports = (io) => {
    io.on("connection", (socket) => {
        // console.log(`User connected: ${socket.id}`);
        socket.on("add-assignment", (classroomIds) => {
          const rooms = Array.isArray(classroomIds)
              ? classroomIds.map(String)
              : [String(classroomIds)];
          
          // เก็บข้อมูลห้องใน socket.data.rooms
          socket.data.rooms = rooms;
          console.log(`User ${socket.id} rooms: ${socket.data.rooms}`);
  
          rooms.forEach((roomId) => {
              socket.join(roomId);
            //   console.log(`User ${socket.id} joined room: ${roomId}`);
          });
        });

        socket.on("send-work", (classroomIds) => {
            const rooms = Array.isArray(classroomIds)
                ? classroomIds.map(String)
                : [String(classroomIds)];
            
            // เก็บข้อมูลห้องใน socket.data.rooms
            // console.log('Room',rooms)
            socket.data.sendWork = rooms;
            console.log(`Updated sendWork for ${socket.id}: ${socket.data.sendWork}`);
    
            rooms.forEach((roomId) => {
                socket.join(roomId);
                console.log(`teachers joined room: ${roomId}`);
            });
        });

        socket.on('comment',(classroomId) => {
            socket.join(String(classroomId));
            console.log(`comment : ${classroomId}`);
        })

        // socket.on("send-work", (classroomId) => {
        //     socket.join(String(classroomId));
        // })

      socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.id}`);
          delete socket.data.rooms;
          delete socket.data.sendWork;
      });
    });
};
