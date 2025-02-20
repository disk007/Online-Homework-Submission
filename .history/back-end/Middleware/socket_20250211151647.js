const data2 = [
    {
      id: 34,
      title: 'test groups',
      id_group: 99,
      id_user: null,
      name: 'Computer Vision CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 33,
      title: 'work last กลุ่ม',
      id_group: 95,
      id_user: null,
      name: 'Computer Programing CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 32,
      title: 'เขียนโปรแกรมตามโจทย์',
      id_group: null,
      id_user: 5,
      name: 'Computer Programing CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 31,
      title: 'gmlit[[',
      id_group: null,
      id_user: 5,
      name: 'Computer Vision CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 30,
      title: 'งานกลุ่ม',
      id_group: 71,
      id_user: null,
      name: 'Computer Programing CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 29,
      title: 'project group last',
      id_group: 68,
      id_user: null,
      name: 'Computer Programing CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 26,
      title: 'start1',
      id_group: null,
      id_user: 5,
      name: 'Data minning ',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 25,
      title: 'start',
      id_group: null,
      id_user: 5,
      name: 'Data minning ',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 24,
      title: 'mama',
      id_group: null,
      id_user: 5,
      name: 'Data minning ',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 23,
      title: 'ggder',
      id_group: null,
      id_user: 5,
      name: 'Computer Vision CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 22,
      title: 'test หลายกลุ่มเรียน',
      id_group: null,
      id_user: 5,
      name: 'Data minning ',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    },
    {
      id: 21,
      title: 'test หลายกลุ่มเรียน',
      id_group: null,
      id_user: 5,
      name: 'Computer Vision CPE.65231',
      fname: 'witchaphon',
      lname: 'seanthawisuk'
    }
  ]
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("add-assignment", (classroomIds) => {
            const rooms = Array.isArray(classroomIds) 
                ? classroomIds.map(String) 
                : [String(classroomIds)]; // ✅ แปลงเป็น array เสมอ
        
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
