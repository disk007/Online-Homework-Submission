module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // socket.on("joinRoom", (id) => {
        //     socket.join(id);
        //     console.log(`User joined room: ${id}`);
        // });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
