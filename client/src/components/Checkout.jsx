import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router";
import { fetchBooksById } from "../store/bookSlice";
import Swal from "sweetalert2";
import { purchaseBook } from "../store/transactionSlice";
import { useNavigate } from "react-router-dom";
import http from "../helpers/http";

export default function Checkout({ isOpen, onClose, paymentMethod }) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const bookDetail = useSelector((state) => state.book.bookDetail) || [];
    const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
    const { status, error } = useSelector((state) => state.transaction);
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
            setTimeout(async () => {
                try {
                    const response = await http.get(`/transactions?order_id=${orderId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const transaction = response.data;
                    if (transaction.status === "success" || transaction.status === "Settlement") {
                        Swal.fire({
                            title: "Success!",
                            text: "Your payment was successful!",
                            icon: "success",
                        });
                        navigate(`/books/${transaction.bookId}`);
                    } else {
                        Swal.fire({
                            title: "Pending!",
                            text: "Your payment is being processed. Please check your transactions later.",
                            icon: "info",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching transaction status:", error);
                }
            }, 3000); 
        }
    }, [location, navigate, token]);

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
                window.snap.pay(response.token, {
                    onSuccess: async function (result) {
                        console.log("Midtrans success:", result);
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        try {
                            const res = await http.get(`/transactions?order_id=${result.order_id}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (res.data.status === "success") {
                                Swal.fire({
                                    title: "Success!",
                                    text: "Your payment was successful!",
                                    icon: "success",
                                });
                                navigate(`/books/${id}`);
                            } else {
                                Swal.fire({
                                    title: "Pending!",
                                    text: "Your payment is being processed. Please check your transactions later.",
                                    icon: "info",
                                });
                            }
                        } catch (error) {
                            console.error("Error checking transaction status:", error);
                            Swal.fire({
                                title: "Error!",
                                text: "Failed to verify payment. Please try again later.",
                                icon: "error",
                            });
                        }
                    },
                    onPending: function (result) {
                        console.log("pending", result);
                    },
                    onError: function (result) {
                        console.log("error", result);
                        Swal.fire({
                            title: "Pembayaran Gagal!",
                            text: "Silakan coba lagi.",
                            icon: "error",
                        });
                    },
                    onClose: function () {
                        console.log("customer closed the popup without finishing the payment");
                    },
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error,
                icon: "error",
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold">Google Play</h2>
                    <button className="text-gray-500" onClick={onClose}>✖</button>
                </div>
                <div className="flex items-center gap-3 py-4">
                    <img src={bookDetail.imgUrl} alt={bookDetail.title} className="w-14 h-20 rounded" />
                    <div>
                        <h3 className="font-medium">{bookDetail.title}</h3>
                        <p className="text-gray-700">{bookDetail.author}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold mb-2">
                    <span>Total:</span>
                    <span>Rp {parseInt(bookDetail.price || 0).toLocaleString("id-ID")},00</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded mb-4">
                    <span>{paymentMethod}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                    Klik "Beli" untuk menyelesaikan pembelian. Termasuk pajak sebesar Rp {(
                        parseInt(bookDetail.price || 0) * 0.1
                    ).toLocaleString("id-ID")},00
                </p>
                <button
                    onClick={handleBuy}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-center font-medium hover:bg-blue-700 transition"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? "Processing..." : "Beli"}
                </button>
            </div>
        </div>
    );
}