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
app.post("/api/destinations", async (request, response) => {
  const {
    name,
    slug,
    location,
    shortDescription,
    imageUrl,
    seoDescription,
    categoryId,
  } = request.body;

  if (
    !name ||
    !slug ||
    !location ||
    !shortDescription ||
    !categoryId
  ) {
    response.status(400).json({
      success: false,
      message:
        "Name, slug, location, short description and category are required",
    });
    return;
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      response.status(400).json({
        success: false,
        message: "Selected category does not exist",
      });
      return;
    }

    const destination = await prisma.destination.create({
      data: {
        name: String(name).trim(),
        slug: String(slug).trim(),
        location: String(location).trim(),
        shortDescription: String(shortDescription).trim(),
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
        seoDescription: seoDescription
          ? String(seoDescription).trim()
          : null,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
        sections: true,
      },
    });

    response.status(201).json({
      success: true,
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error: unknown) {
    console.error("Failed to create destination:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      response.status(409).json({
        success: false,
        message: "A destination with this slug already exists",
      });
      return;
    }

    response.status(500).json({
      success: false,
      message: "Failed to create destination",
    });
  }
});
app.put("/api/destinations/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    response.status(400).json({
      success: false,
      message: "Destination ID must be a positive number",
    });
    return;
  }

  const {
    name,
    slug,
    location,
    shortDescription,
    imageUrl,
    seoDescription,
    categoryId,
  } = request.body;

  if (
    !name ||
    !slug ||
    !location ||
    !shortDescription ||
    !categoryId
  ) {
    response.status(400).json({
      success: false,
      message:
        "Name, slug, location, short description and category are required",
    });
    return;
  }

  try {
    const existingDestination =
      await prisma.destination.findUnique({
        where: { id },
      });

    if (!existingDestination) {
      response.status(404).json({
        success: false,
        message: "Destination not found",
      });
      return;
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      response.status(400).json({
        success: false,
        message: "Selected category does not exist",
      });
      return;
    }

    const updatedDestination =
      await prisma.destination.update({
        where: { id },
        data: {
          name: String(name).trim(),
          slug: String(slug).trim(),
          location: String(location).trim(),
          shortDescription: String(
            shortDescription,
          ).trim(),
          imageUrl: imageUrl
            ? String(imageUrl).trim()
            : null,
          seoDescription: seoDescription
            ? String(seoDescription).trim()
            : null,
          categoryId: Number(categoryId),
        },
        include: {
          category: true,
          sections: true,
        },
      });

    response.json({
      success: true,
      message: "Destination updated successfully",
      data: updatedDestination,
    });
  } catch (error: unknown) {
    console.error("Failed to update destination:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      response.status(409).json({
        success: false,
        message: "A destination with this slug already exists",
      });
      return;
    }

    response.status(500).json({
      success: false,
      message: "Failed to update destination",
    });
  }
});
app.delete(
  "/api/destinations/:id",
  async (request, response) => {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({
        success: false,
        message: "Destination ID must be a positive number",
      });
      return;
    }

    try {
      const existingDestination =
        await prisma.destination.findUnique({
          where: { id },
        });

      if (!existingDestination) {
        response.status(404).json({
          success: false,
          message: "Destination not found",
        });
        return;
      }

      await prisma.destination.delete({
        where: { id },
      });

      response.json({
        success: true,
        message: "Destination deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete destination:", error);

      response.status(500).json({
        success: false,
        message: "Failed to delete destination",
      });
    }
  },
);

app.listen(port, () => {
  console.log(`Serendib backend running on port ${port}`);
});
