import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from "../helpers/http";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminPanel() {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [books, setBooks] = useState([]);
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchBooks();
        }
    }, [token]);

    const fetchBooks = async () => {
        try {
            const response = await http({
                method: 'GET',
                url: '/books'
            });
            setBooks(response.data);
        } catch (error) {
            let message = "Something went wrong!";
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message = error.response.data.message;
            }
            Swal.fire({
              title: "Error!",
              text: message,
              icon: "error",
            });
        }
    };

    const onSubmit = async (event, id) => {
        event.preventDefault();
        try {
            if (editId) {
                await http({
                    method: 'put',
                    url : `/admin/books/${id}`,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                fetchBooks();
            } else {
                await http({
                    method: 'post',
                    url: '/admin/books',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                fetchBooks();
            }
            reset();
            setEditId(null);
            fetchBooks(); 
        } catch (error) {
            let message = "Something went wrong!";
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message = error.response.data.message;
            }
            Swal.fire({
              title: "Error!",
              text: message,
              icon: "error",
            });
        }
    };

    const handleEdit = (book) => {
        setEditId(book.id);
        setValue("title", book.title);
        setValue("author", book.author);
        setValue("description", book.description);
        setValue("price", book.price);
        setValue("status", book.status);
        setValue("imgUrl", book.imgUrl);
    };

    const handleDelete = async (id) => {
        try {
            await http({
                method: 'DELETE',
                url: `/admin/books/${id}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            fetchBooks();
        } catch (error) {
            let message = "Something went wrong!";
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
              message = error.response.data.message;
            }
            Swal.fire({
              title: "Error!",
              text: message,
              icon: "error",
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container mx-auto p-6 min-h-screen bg-white text-gray-900">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Panel - Manage Books</h1>
                <button onClick={handleLogout} className="btn btn-neutral">Logout</button>
            </div>

            <div className="max-w-3xl mx-auto rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Book" : "Add New Book"}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    <input {...register("title")} placeholder="Title" className="input input-bordered w-full" />
                    <input {...register("author")} placeholder="Author" className="input input-bordered w-full" />
                    <textarea {...register("description")} placeholder="Description" className="textarea textarea-bordered w-full"></textarea>
                    <input {...register("price")} type="number" placeholder="Price" className="input input-bordered w-full" />
                    <input {...register("status")} placeholder="Status (available/sold out)" className="input input-bordered w-full" />
                    <input {...register("imgUrl")} placeholder="Image URL" className="input input-bordered w-full" />

                    <button type="submit" className="btn btn-neutral">
                        {editId ? "Update Book" : "Add Book"}
                    </button>
                </form>
            </div>

            {/* Daftar Buku */}
            <div className="pl-50 py-10">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.length > 0 ? books.map((book, index) => (
                            <tr key={book.id}>
                                <td>{index + 1}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>${book.price}</td>
                                <td>{book.description}</td>
                                <td className="space-x-2">
                                    <button onClick={() => handleEdit(book)} className="btn btn-sm btn-warning">Edit</button>
                                    <button onClick={() => handleDelete(book.id)} className="btn btn-sm btn-neutral">Delete</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center">No books available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
