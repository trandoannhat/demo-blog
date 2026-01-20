import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://admin-demo.nhatdev.top"],
  }),
);
app.use(express.json());

// --- CÁC ROUTE PHẢI ĐẶT TRƯỚC LISTEN ---

// Route lấy danh sách bài viết
app.get("/api/posts", async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  res.json(posts);
});

// Thêm bài viết mới (POST)
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await prisma.post.create({
      data: { title, content },
    });
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi tạo bài viết" });
  }
});

// Xóa bài viết (DELETE)
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi xóa bài viết" });
  }
});

// Cập nhật bài viết (PUT)
app.put("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật" });
  }
});

// --- DÒNG NÀY PHẢI Ở CUỐI CÙNG ---
const PORT = process.env.PORT || 3002; // Nhớ đổi thành 3002 như bạn đã cấu hình .env
app.listen(PORT, () => console.log(`BE chạy tại port ${PORT}`));
