import express from "express";
import sql from "mssql";
import config from "./config";

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
        if (thisroom2.type === "Expedia" && thisroom2.map.toString() === thisroom.idroom.toString()) {
          thisroom.mapExpedia += `,${thisroom2.idroom},`;
        }
        if (thisroom2.type === "HB" && thisroom2.map.toString() === thisroom.idroom.toString()) {
          thisroom.maphb += `,${thisroom2.idroom},`;
        }
        if (thisroom2.type === "HS" && thisroom2.map.toString() === thisroom.idroom.toString()) {
          thisroom.maphs += `,${thisroom2.idroom},`;
        }
      });
    }
  });

  return myr;
}

const app = express();
app.use(express.json());

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

app.post("/api/rooms/:hotelId", async (req, res) => {
  const hotelId = parseInt(req.params.hotelId, 10);
  const { rooms } = req.body;

  if (!hotelId || !Array.isArray(rooms)) {
    return res.status(400).json({ error: "hotelId y rooms son requeridos" });
  }

  try {
    // Crear TVP en memoria
    const table = new sql.Table("RoomMapGuruType");
    table.columns.add("IdRoom", sql.BigInt, { nullable: false });
    table.columns.add("name", sql.NVarChar(500), { nullable: false });
    table.columns.add("type", sql.NVarChar(50), { nullable: false });
    table.columns.add("uri", sql.NVarChar(500), { nullable: true });
    table.columns.add("map", sql.Int, { nullable: false });
    table.columns.add("orden", sql.Int, { nullable: false });

    // Llenar tabla con los datos del request
    rooms.forEach((room: any) => {
      table.rows.add(
        room.id,
        room.name,
        room.type,
        room.uri || "",
        room.map || 0,
        room.orden || 0
      );
    });

    // Ejecutar SP
    const pool = await getPool();
    const request = pool.request();
    request.input("HotelId", sql.Int, hotelId);
    request.input("Rooms", table);

    await request.execute("sp_Saveroommapguru");

    res.json({ message: "Habitaciones guardadas correctamente 🚀" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`Backend corriendo en http://localhost:${config.port}`);
});
