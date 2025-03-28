import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { fetchBooksById } from "../store/bookSlice";
import { addToFavorite, fetchFavorites } from "../store/favoriteSlice";
import Swal from "sweetalert2";
import Checkout from "../components/Checkout";

export default function BookDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const bookDetail = useSelector((state) => state.book.bookDetail) || []
    const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
    console.log(bookDetail, "<<<from redux")

    const [isOpen, setIsOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const checkPaymentStatus = async () => {
        try {
            const response = await http({
                method: "GET",
                url: `/transactions`, // Endpoint untuk mendapatkan transaksi pengguna
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Periksa apakah ada transaksi dengan bookId yang sesuai dan status 'paid'
            const paidTransaction = response.data.find(
                (transaction) => transaction.bookId === parseInt(id) && transaction.paymentStatus === "paid"
            );

            if (paidTransaction) {
                setIsPaid(true); // Set status pembayaran menjadi true
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchBooksById(id))
        }
    }, [dispatch, id])

    
    const handleAddToFavorite = async () => {
        if (!token) {
            alert("Silakan login terlebih dahulu!");
            return;
        }
    
        console.log("Mengirim request untuk menambahkan favorit:", { bookId: id, token });
    
        try {
            const response = await dispatch(addToFavorite({ bookId: id, token })).unwrap();
            alert("Buku berhasil ditambahkan ke favorit!");
            console.log("Respons berhasil:", response);
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
        dispatch(fetchFavorites(token));
    };

    return (
        <>
        <div className="h-screen flex flex-col lg:flex-row items-center lg:items-start p-15 bg-white mx-auto">
        <div className="w-full lg:w-1/3 flex justify-center">
            <img src={bookDetail.imgUrl} alt="Book Cover" className="rounded-lg shadow-2xl w-50"/>
        </div>
        
        <div className="w-full lg:w-2/3 lg:pl-5 mt-6 lg:mt-0 py-5">
            <h1 className="text-black text-4xl font-bold">{bookDetail.title}</h1>
            <p className="text-sm text-gray-600">{bookDetail.author}</p>

            <div className="flex items-center space-x-6 my-4 text-gray-700">
            <span>⭐ 3.7 • 18 ulasan</span>
            <span>📖 eBook • 688 Halaman</span>
            </div>

            <div className="flex items-center space-x-4 mt-4">
            <span className="text-gray-500 line-through text-lg">Rp 149.850,00</span>
            <span className="text-black font-bold text-2xl">Rp {bookDetail.price},00</span>
            </div>

            <div className="flex space-x-4 mt-4">
            <button onClick={() => setIsOpen(true)} className="btn btn-neutral" >Beli</button>
                <Checkout
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    book={bookDetail}
                    price={208934}
                    paymentMethod="Midtrans Payment"
                />
            <button onClick={handleAddToFavorite} className="btn btn-ghost text-black hover:bg-transparent hover:border-white hover:text-black">⭐ Tambahkan ke Favorit</button>
            <div className="pr-30 text-gray-400">
                {Number(bookDetail.price) === 0 || isPaid ? ( // Jika buku gratis atau sudah dibayar
                    <Link to="/read" className="btn btn-dash btn-success">Read now</Link> // Tombol aktif
                ) : (
                    <button className="btn btn-dash btn-warning">
                        🔒 Locked
                    </button> // Tombol terkunci jika belum dibayar
                )}
            </div>
            </div>
            
            <p className="mt-6 text-gray-600 text-sm">
            Anda dapat membagikan buku ini kepada keluarga Anda.{" "}
            <a href="#" className="text-blue-600">kirim lewat email</a>
            </p>

            
            
        </div>
        </div>

        <div className="bg-white px-50 -mt-55">

                    {/* Judul */}
                    <h2 className="text-xl font-semibold text-black mb-7">Tentang buku ini</h2>

                    {/* Deskripsi */}
                    <p className="text-gray-700 leading-relaxed">
                        Read the new book by psychotherapist and gynecologist Peter Hope
                        <b> "Bright orgasm. Anchoring techniques and NLP techniques."</b> The best
                        guide for women. It will help in the treatment of anorgasmia. You will
                        master the techniques and methods of NLP and will be able to apply them
                        independently.
                    </p>

                    <p className="text-gray-700 leading-relaxed mt-3">
                        Thus, you will help yourself, dear women, to feel the fullness and beauty
                        of orgasm. Enhance your sexuality and attractiveness in the eyes of men.
                        The book is written specifically for women. And it will be a great gift for
                        a couple looking for new pleasures.
                    </p>
                    </div>

        
        </>
    )
}