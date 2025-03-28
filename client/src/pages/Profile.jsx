import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import http from "../helpers/http";
import Swal from "sweetalert2";

export default function Profile() {
    const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
    const name = localStorage.getItem('name');
    const [transactions, setTransactions] = useState([]);

    // Fungsi untuk mengambil data transaksi dari backend
    async function fetchTransaction() {
        try {
            const response = await http({
                method: 'GET',
                url: `/transactions`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTransactions(response.data); // Simpan data transaksi ke state
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
    }

    useEffect(() => {
        fetchTransaction(); // Ambil data transaksi saat komponen dirender
    }, []);

    return (
        <>
            <div className="h-screen bg-white">
                <h2 className="flex text-center justify-center text-2xl font-mono text-black -mb-1 py-10">{name}</h2>
                <div className="stats py-15 pl-97">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title text-black">Total Read</div>
                        <div className="stat-value text-primary">25</div>
                        <div className="stat-desc text-black">21% more than last month</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title text-black">Page Views</div>
                        <div className="stat-value text-secondary">12</div>
                        <div className="stat-desc text-black">21% more than last month</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="avatar online">
                                <div className="w-16 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
                                </div>
                            </div>
                        </div>
                        <div className="stat-value text-primary">86%</div>
                        <div className="stat-title text-black">Books done</div>
                        <div className="stat-desc text-secondary">31 tasks remaining</div>
                    </div>
                </div>

                <h2 className="text-3xl font-mono text-black pl-33 mb-1">Transactions: </h2>
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-500">No transactions found.</p>
                ) : (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-full max-w-4xl text-black">
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gradient-to-b from-pink-400 to-gray-200">
                                        <th className="border border-gray-300 px-4 py-2 text-left text-black">Book Title</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-black">Order-ID</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-black">Payment Status</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left text-black">Payment Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{transaction.Book?.title || "Unknown Book"}</td>
                                            <td className="border border-gray-300 px-4 py-2">{transaction.transactionId}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <span
                                                    className={
                                                        transaction.paymentStatus === "paid"
                                                            ? "text-green-500"
                                                            : transaction.paymentStatus === "pending"
                                                            ? "text-yellow-500"
                                                            : "text-red-500"
                                                    }
                                                >
                                                    {transaction.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {transaction.paymentDate
                                                    ? new Date(transaction.paymentDate).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}