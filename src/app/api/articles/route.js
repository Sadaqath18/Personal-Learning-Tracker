import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/articles or /api/articles?id=1
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!article) {
        return Response.json({ error: "Article not found" }, { status: 404 });
      }
      return Response.json(article);
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(articles);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/articles
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.title || !data.content) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });

    return Response.json(
      { message: "Article added", article: newArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

// PATCH /api/articles?id=1
export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await request.json();
    if (!data.title && !data.content) {
      return Response.json(
        { error: "At least one field (title or content) is required" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data,
    });

    return Response.json(
      { message: "Article updated", article: updatedArticle },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return Response.json(
      { error: "Article not found or invalid data" },
      { status: 400 }
    );
  }
}

// DELETE /api/articles?id=1
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: parseInt(id, 10) },
    });

    return Response.json({ message: "Article deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json({ error: "Article not found" }, { status: 404 });
  }
}

// Day 7: Authentication & Middleware

// NextAuth.js basics

// Middleware for protecting routes

// Session handling

// Day 8: Deployment

// Deploying to Vercel

// Environment variables

// Optimizations (images, fonts, scripts)

// Mini Project (Job-Ready Showcase)

// 📌 Blog App / Task Manager with:

// Next.js pages & routes

// Tailwind UI

// API routes (CRUD)

// Auth (login/register)

// Deployed on Vercel 🚀