import { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL;

  // 1. Hàm lấy danh sách bài viết
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. Hàm thêm bài viết mới
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content)
      return alert("Vui lòng nhập đủ tiêu đề và nội dung");

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/posts`, { title, content });
      setTitle("");
      setContent("");
      fetchPosts(); // Tải lại danh sách sau khi thêm thành công
    } catch (err) {
      console.error("Lỗi khi thêm bài viết:", err);
      alert("Không thể thêm bài viết!");
    } finally {
      setLoading(false);
    }
  };

  // 3. Hàm xóa bài viết
  const handleDeletePost = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?"))
      return;

    try {
      await axios.delete(`${baseUrl}/api/posts/${id}`);
      fetchPosts(); // Tải lại danh sách sau khi xóa
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      alert("Không thể xóa bài viết!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 My Demo Blog Admin</h1>

      {/* FORM THÊM BÀI VIẾT */}
      <section
        style={{
          background: "#f4f4f4",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Thêm bài viết mới</h3>
        <form onSubmit={handleAddPost}>
          <div style={{ marginBottom: "10px" }}>
            <input
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              placeholder="Tiêu đề bài viết..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                minHeight: "100px",
              }}
              placeholder="Nội dung bài viết..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Đang đăng..." : "Đăng bài viết"}
          </button>
        </form>
      </section>

      <hr />

      {/* DANH SÁCH BÀI VIẾT */}
      <h3>Danh sách bài viết ({posts.length})</h3>
      {posts.length === 0 && <p>Chưa có bài viết nào.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #eee",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {post.title}
            </h2>
            <p style={{ color: "#666", lineHeight: "1.5" }}>{post.content}</p>
          </div>

          <button
            onClick={() => handleDeletePost(post.id)}
            style={{
              background: "#ff4d4d",
              color: "white",
              border: "none",
              padding: "5px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "20px",
            }}
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
