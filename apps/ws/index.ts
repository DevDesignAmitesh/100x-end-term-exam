import WebSocket, { WebSocketServer } from "ws";
import { verifyToken } from "@repo/common/common";
import type { role, attendenceStatus } from "@repo/types/types";
import { prisma } from "@repo/db/db";

interface extenededWs extends WebSocket {
  user: {
    userId: string;
    role: role;
  } | null;
}

const server = new WebSocketServer({ port: Number(process.env.PORT!) });

interface ActiveSessionProps {
  classId: string;
  startedAt: string;
  attendence: Record<string, attendenceStatus>;
}

let activeSession: ActiveSessionProps = {
  classId: "",
  startedAt: "",
  attendence: {},
};

server.on("connection", (ws: extenededWs, req) => {
  console.log("connected");

  const token = req.url?.split("=")[1];

  console.log("token", token)

  if (!token) {
    sendMessage({
      ws,
      event: "ERROR",
      data: { message: "Unauthorized or invalid token" },
    });
    return;
  }
  console.log("is this running")
  const decoded = verifyToken({
    token,
    JWT_SECRET: process.env.JWT_SECRET!,
  });

  if (!decoded) {
    sendMessage({
      ws,
      event: "ERROR",
      data: { message: "Unauthorized or invalid token" },
    });
    return;
  }

  ws.user = decoded;

  ws.on("open", () => console.log("connection opened"));

  ws.on("error", (err) => console.log("error in ws ", err));

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data.toString());

    console.log("this is the received data");
    console.log(parsedData);

    if (parsedData.type === "ATTENDANCE_MARKED") {
      const { studentId, status } = parsedData.data;

      if (ws?.user?.role !== "teacher") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "Forbidden, teacher event only" },
        });
        return;
      }

      if (activeSession.classId === "") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "No active attendance session" },
        });
        return;
      }

      activeSession.attendence[studentId] = status;

      server.clients.forEach((ws) => {
        sendMessage({
          ws,
          event: parsedData.type,
          data: { studentId, status },
        });
      });
    }

    if (parsedData.type === "TODAY_SUMMARY") {
      if (ws?.user?.role !== "teacher") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "Forbidden, teacher event only" },
        });
        return;
      }

      if (activeSession.classId === "") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "No active attendance session" },
        });
        return;
      }

      let total = 0;
      let absent = 0;
      let present = 0;

      Object.entries(activeSession.attendence).forEach(([id, status]) => {
        if (status === "absent") {
          absent++;
          total++;
        } else if (status === "present") {
          present++;
          total++;
        }
      });

      console.log("absent", absent);
      console.log("present", present);
      console.log("total", total);

      sendMessage({
        ws,
        event: parsedData.type,
        data: { present, absent, total },
      });
    }

    if (parsedData.type === "MY_ATTENDANCE") {
      if (ws?.user?.role !== "student") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "Forbidden, student event only" },
        });
        return;
      }

      const status = activeSession.attendence[ws?.user?.userId];

      if (!status) {
        sendMessage({
          ws,
          event: parsedData.type,
          data: { status: "not yet updated" },
        });
        return;
      }
      sendMessage({
        ws,
        event: parsedData.type,
        data: { status },
      });
    }

    if (parsedData.type === "DONE") {
      if (ws?.user?.role !== "teacher") {
        sendMessage({
          ws,
          event: "ERROR",
          data: { message: "Forbidden, teacher event only" },
        });
        return;
      }

      let students: any[] = [];

      let total = 0;
      let absent = 0;
      let present = 0;

      Object.entries(activeSession.attendence).forEach(async ([id, status]) => {
        const student = await prisma.user.findFirst({
          where: {
            id,
          },
        });

        if (student) {
          if (status === "absent") {
            total++;
            absent++;
          } else if (status === "present") {
            total++;
            present++;
          }
          students.push(student);
          await prisma.attendance.create({
            data: {
              studentId: student.id,
              classId: activeSession.classId,
              status,
            },
          });
        }
      });

      console.log("students", students);
      console.log("absent", absent);
      console.log("present", present);
      console.log("total", total);

      activeSession = {
        classId: "",
        startedAt: "",
        attendence: {},
      };

      sendMessage({
        ws,
        event: parsedData.type,
        data: { message: "Attendance persisted", present, absent, total },
      });
    }
  });

  ws.on("close", () => {
    ws.user = null;
  });
});

function sendMessage({
  ws,
  event,
  data,
}: {
  ws: WebSocket;
  event: string;
  data: any;
}) {
  ws.send(JSON.stringify({ event, data }));
}
