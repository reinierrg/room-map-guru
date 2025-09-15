import express from "express";
import sql from "mssql";
import config from "./config";
import cors from "cors";

class Room {
  type: string = "";
  idroom: number = 0;
  name: string = "";
  uri: string = "";
  map: number = 0;
  mapExpedia: string = "";
  maphb: string = "";
  maphs: string = "";
}

let pool: sql.ConnectionPool | null = null;
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config.db);
  }
  return pool;
}

async function getRooms(query: string | undefined) {
  const myr: Room[] = [];

  if (!query) return myr;

  const hotelId = parseInt(query, 10);

  if (isNaN(hotelId)) return myr;

  try {
    const pool = await getPool();
    const request = pool.request();
    request.input("hotelid", sql.Int, hotelId);
    const result = await request.execute("dbo.sp_RoomMapGuru");

    if (result.recordset && result.recordset.length > 0) {
      result.recordset.forEach((row: any) => {
        const newRoom = new Room();
        newRoom.type = row.type;
        newRoom.idroom = row.IdRoom;
        newRoom.name = row.name;
        newRoom.map = row.map;
        myr.push(newRoom);
      });
    }
  } catch (err: any) {
    console.error("Exception: ", err.message);
  }

  // Procesamiento adicional
  myr.forEach((thisroom) => {
    if (thisroom.type === "Interno") {
      myr.forEach((thisroom2) => {
        if (
          thisroom2.type === "Expedia" &&
          thisroom2.map.toString() === thisroom.idroom.toString()
        ) {
          thisroom.mapExpedia += `,${thisroom2.idroom},`;
        }
        if (
          thisroom2.type === "HB" &&
          thisroom2.map.toString() === thisroom.idroom.toString()
        ) {
          thisroom.maphb += `,${thisroom2.idroom},`;
        }
        if (
          thisroom2.type === "HS" &&
          thisroom2.map.toString() === thisroom.idroom.toString()
        ) {
          thisroom.maphs += `,${thisroom2.idroom},`;
        }
      });
    }
  });

  return myr;
}

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (_, res) => {
  res.json({ message: "Backend corriendo 🚀" });
});

app.get("/api/rooms/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const rooms = await getRooms(hotelId);
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/rooms/relations", async (req, res) => {
  const { relationRooms } = req.body;

  if (!Array.isArray(relationRooms) || relationRooms.length === 0) {
    return res.status(400).json({ message: "No se recibieron relaciones" });
  }

  try {
    const pool = await getPool(); // pool único
    for (const { room1, room2 } of relationRooms) {
      await pool.request()
        .input("roomId1", sql.BigInt, room1)
        .input("roomId2", sql.BigInt, room2)
        .execute("sp_Saveroommapguru");
    }

    res.status(200).json({ message: "Relaciones guardadas correctamente" });
  } catch (error: any) {
    console.error("Error al guardar relaciones:", error);
    res.status(500).json({ message: "Error al guardar relaciones", error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`Backend corriendo en http://localhost:${config.port}`);
});
