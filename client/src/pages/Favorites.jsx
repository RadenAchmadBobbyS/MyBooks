import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../store/favoriteSlice";
import { Link } from "react-router";

export default function Favorites() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
  const favorites = useSelector((state) => state.favorite.items);



  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites(token));
      console.log(favorites)
    }
  }, [dispatch, token]);

  return (
    <div className="h-screen bg-white p-8 text-black pl-50">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {favorites.map((book) => (
            <div key={book.id} className="card w-50 shadow-none py-10">
            <img src={book.Book.imgUrl} alt={book.Book.title} className="w-full h-auto shadow-2xl transition-transform duration-300 ease-in-out hover:scale-105"/>
            <div className="card-body text-left text-black border-none pl-1"> 
            <h2 className="card-title">{book.Book.title}</h2>
            <h2 className="text-nowrap overflow-hidden truncate">{book.Book.description}</h2>
            <p className="text-xs text-gray-500">Rp {book.Book.price},00{" "}{book.Book.status}</p>
        </div>
        </div>
          ))}
        </div>
    </div>
  );
}
