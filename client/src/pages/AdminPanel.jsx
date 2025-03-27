import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from "../helpers/http";
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate untuk navigasi

export default function AdminPanel() {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [books, setBooks] = useState([]);
    const [editId, setEditId] = useState(null);
    const { id } = useParams();  // Mengambil ID dari URL
    const navigate = useNavigate();  // Untuk melakukan navigasi

    // Mengambil daftar buku saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await http.get("/books");  // Ambil data buku
                setBooks(response.data);
                if (id) {
                    const bookToEdit = response.data.find((book) => book.id === parseInt(id));
                    if (bookToEdit) {
                        handleEdit(bookToEdit);
                    }
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };

        fetchBooks();
    }, [id]);

    // Fungsi untuk menambah atau mengupdate buku
    const onSubmit = async (data) => {
        try {
            if (editId) {
                // Update buku
                await http.put(`/books/${editId}`, data);
                navigate("/admin");  // Navigasi kembali ke halaman admin setelah update
            } else {
                // Tambah buku baru
                await http.post("/books", data);
            }
            reset();
            fetchBooks();  // Ambil data buku terbaru setelah perubahan
        } catch (error) {
            console.error("Error saving book:", error);
        }
    };

    // Fungsi untuk mengisi form dengan data buku yang akan diedit
    const handleEdit = (book) => {
        setEditId(book.id);
        setValue("title", book.title);
        setValue("author", book.author);
        setValue("description", book.description);
        setValue("price", book.price);
        setValue("status", book.status);
        setValue("imgUrl", book.imgUrl);
    };

    // Fungsi untuk menghapus buku berdasarkan ID
    const handleDelete = async (id) => {
        try {
            await http.delete(`/books/${id}`);
            setBooks(books.filter((book) => book.id !== id));  // Update daftar buku setelah penghapusan
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    return (
        <>
        <div className="container mx-auto p-6 bg-white min-h-screen text-black">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Panel - Manage Books</h1>

            {/* Form Tambah/Edit Buku */}
            <div className="max-w-3xl mx-auto bg-gray-400 p-6  shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <input {...register("title")} placeholder="Title" className="input input-bordered w-full bg-white p-3 rounded-lg text-black" />
                    <input {...register("author")} placeholder="Author" className="input input-bordered w-full bg-white p-3 rounded-lg text-black" />
                    <textarea {...register("description")} placeholder="Description" className="textarea textarea-bordered w-full bg-white p-3 rounded-lg text-black"></textarea>
                    <input {...register("price")} type="number" placeholder="Price" className="input input-bordered w-full bg-gray-700 p-3 rounded-lg text-black" />
                    <input {...register("status")} placeholder="Status (available/sold out)" className="input input-bordered w-full bg-gray-700 p-3 rounded-lg text-black" />
                    <input {...register("imgUrl")} placeholder="Image URL" className="input input-bordered w-full bg-gray-700 p-3 rounded-lg text-black" />

                    <button type="submit" className="btn btn-neutral">
                        {editId ? "Update Book" : "Add Book"}
                    </button>
                </form>
            </div>

            {/* Tabel Buku */}
            <div className="mt-8 max-w-5xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg text-black">
                    <thead>
                        <tr className="bg-white text-black">
                            <th className="border p-3">Title</th>
                            <th className="border p-3">Author</th>
                            <th className="border p-3">Price</th>
                            <th className="border p-3">Status</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id} className="text-center">
                                <td className="border p-3">{book.title}</td>
                                <td className="border p-3">{book.author}</td>
                                <td className="border p-3">${book.price}</td>
                                <td className="border p-3">{book.status}</td>
                                <td className="border p-3 flex justify-center gap-2">
                                    <button onClick={() => handleEdit(book)} className="btn btn-warning">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(book.id)} className="btn btn-error">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}
