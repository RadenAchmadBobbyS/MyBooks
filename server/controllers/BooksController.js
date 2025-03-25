const axios = require("axios");

class BookController {
  static async searchBooks(req, res) {
    const { title, author, isbn, category } = req.query;

    if (!title && !author && !isbn && !category) {
      return res.status(400).json({ error: "At least one query parameter is required (title, author, isbn, category)" });
    }

    // 🔥 Buat query Google Books API berdasarkan parameter yang diisi user
    let query = "";
    if (title) query += `+intitle:${title}`;
    if (author) query += `+inauthor:${author}`;
    if (isbn) query += `+isbn:${isbn}`;
    if (category) query += `+subject:${category}`;

    try {
      const { data } = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books", details: error.response?.data || error.message });
    }
  }

  static async getMyLibrary(req, res) {
    const accessToken = req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

    try {
      const { data } = await axios.get("https://www.googleapis.com/books/v1/mylibrary/bookshelves", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch library", details: error.response?.data || error.message });
    }
  }

  static async getAllBooks(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access token is required" });
      }

      const accessToken = authHeader.split(" ")[1];

      const bookshelvesRes = await axios.get(
        "https://www.googleapis.com/books/v1/mylibrary/bookshelves",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const bookshelves = bookshelvesRes.data.items || [];

      const bookRequests = bookshelves.map(shelf =>
        axios.get(
          `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelf.id}/volumes?maxResults=10`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ).catch(() => ({ data: { items: [] } })) 
      );

      const booksResponses = await Promise.all(bookRequests);
      let allBooks = booksResponses.flatMap(res => res.data.items || []);
      
      allBooks = allBooks.slice(0, 10);

      res.json({ totalBooks: allBooks.length, books: allBooks });
    } catch (error) {
      console.error("Error fetching all books:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  }
}

module.exports = BookController;
