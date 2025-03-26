module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("add-assignment", (classroomIds) => {

          if (Array.isArray(classroomIds) && classroomIds.length > 0) {
            socket.data.rooms = classroomIds || [];
            console.log("classroomIds ",classroomIds)
            classroomIds.forEach((id) => {
                socket.join(String(id)); 
                console.log(`User joined room: ${id}`);
            });
          } 
          // else {
          //     socket.join(String(classroomIds));
          //     console.log(`User joined room: ${classroomIds}`);
          // }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            // ลบข้อมูลห้องเมื่อผู้ใช้ disconnect
            delete socket.data.rooms;
        });
    });
};
