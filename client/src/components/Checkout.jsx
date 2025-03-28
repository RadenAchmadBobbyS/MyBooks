import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router";
import { fetchBooksById } from "../store/bookSlice";
import Swal from "sweetalert2";
import { purchaseBook } from "../store/transactionSlice";
import { useNavigate } from "react-router-dom";

export default function Checkout({ isOpen, onClose, paymentMethod }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const bookDetail = useSelector((state) => state.book.bookDetail) || [];
    const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
    const { status, error } = useSelector((state) => state.transaction); // Ambil status dan error dari Redux
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (id) {
            dispatch(fetchBooksById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const orderId = queryParams.get("order_id");
        const transactionStatus = queryParams.get("transaction_status");

        if (orderId && transactionStatus === "settlement") {
            // Panggil API untuk mendapatkan transaksi berdasarkan order_id
            http.get(`/transactions?order_id=${orderId}`)
                .then((response) => {
                    const bookId = response.data.bookId;
                    if (bookId) {
                        navigate(`/books/${bookId}`); // Arahkan ke halaman detail buku
                    }
                })
                .catch((error) => {
                    console.error("Error fetching transaction:", error);
                });
        }
    }, [location, navigate]);

    const handleBuy = async () => {
        if (!token) {
            Swal.fire({
                title: "Silakan login terlebih dahulu!",
                text: "Anda perlu login untuk melanjutkan pembelian.",
                icon: "error",
            });
            return;
        }

        try {
            const response = await dispatch(purchaseBook({ bookId: id, token })).unwrap();
            if (response.redirect_url) {
                window.location.href = response.redirect_url; // Redirect ke URL pembayaran
            } else {
                navigate(`/books/${id}`); // Arahkan ke halaman detail buku setelah pembayaran berhasil
            }
        } catch (error) {
            // Error akan ditangani oleh Redux dan ditampilkan di SweetAlert
        }
    };

    // Tampilkan pesan error menggunakan SweetAlert
    useEffect(() => {
        if (status === "failed" && error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error",
            });
        }
    }, [status, error]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold">Google Play</h2>
                        <button className="text-gray-500" onClick={onClose}>
                            ✖
                        </button>
                    </div>

                    {/* Book Info */}
                    <div className="flex items-center gap-3 py-4">
                        <img src={bookDetail.imgUrl} alt={bookDetail.title} className="w-14 h-20 rounded" />
                        <div>
                            <h3 className="font-medium">{bookDetail.title}</h3>
                            <p className="text-gray-700">{bookDetail.author}</p>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center text-lg font-semibold mb-2">
                        <span>Total:</span>
                        <span>Rp {parseInt(bookDetail.price || 0).toLocaleString("id-ID")},00</span>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded mb-4">
                        <img
                            src="data:image/png;base64,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" alt="GoPay" className="w-6 h-6" />
                        <span>{paymentMethod}</span>
                    </div>

                    {/* Info */}
                    <p className="text-sm text-gray-500 mb-4">
                        Klik "Beli" untuk menyelesaikan pembelian. Termasuk pajak sebesar Rp{" "}
                        {(parseInt(bookDetail.price || 0) * 0.1).toLocaleString("id-ID")},00
                    </p>

                    {/* Buttons */}
                    <button
                        onClick={handleBuy}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700 transition"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Processing..." : "Beli"}
                    </button>
                </div>
            </div>
        </>
    );
}