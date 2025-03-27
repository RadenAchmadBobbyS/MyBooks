import { useEffect } from "react";
import BookCard from "../components/BookCard";
import { useDispatch, useSelector } from "react-redux"
import { fetchBooks } from "../store/bookSlice";

export default function HomePage() {
    const dispatch = useDispatch();
    
    const books = useSelector((state) => state.book.books) || []; 
    console.log(books, 'books redux')

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    return (
        <section className="h-screen bg-white py-8 flex justify-center pr-40">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-50 w-full max-w-6xl px-4">
                {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
            </div>
        </section>
    )
}