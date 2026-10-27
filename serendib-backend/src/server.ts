import "dotenv/config";
import cors from "cors";
import express from "express";
import { prisma } from "./db.js";

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    success: true,
    message: "Serendib backend is running",
  });
});

app.get("/api/destinations", async (_request, response) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        category: true,
        sections: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    response.json({
      success: true,
      data: destinations,
    });
  } catch (error) {
    console.error("Failed to load destinations:", error);

    response.status(500).json({
      success: false,
      message: "Failed to load destinations",
    });
  }
});

app.get("/api/destinations/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({
      success: false,
      message: "Destination ID must be a positive number",
    });
    return;
  }

  try {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        category: true,
        sections: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!destination) {
      response.status(404).json({
        success: false,
        message: "Destination not found",
      });
      return;
    }

    response.json({
      success: true,
      data: destination,
    });
  } catch (error) {
    console.error("Failed to load destination:", error);

    response.status(500).json({
      success: false,
      message: "Failed to load destination",
    });
  }
});

app.listen(port, () => {
  console.log(`Serendib backend running on port ${port}`);
});
