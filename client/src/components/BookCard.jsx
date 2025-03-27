import { Link } from "react-router";

export default function BookCard({ book, fetchBooks }) {

    return (
        <>
        <div className="card w-50 shadow-none py-10">
            <Link to={`/books/${book.id}`}><img src={book.imgUrl} alt="Shoes" className="w-full h-auto shadow-2xl transition-transform duration-300 ease-in-out hover:scale-105"/></Link>
        <div className="card-body text-left text-black border-none pl-1"> 
            <h2 className="card-title">{book.title}</h2>
            <h2 className="text-nowrap overflow-hidden truncate">{book.description}</h2>
            <p className="text-xs text-gray-500">Rp {book.price.toLocaleString()},00{" "}{book.status}</p>
        </div>
        </div>
        </>
    )
}