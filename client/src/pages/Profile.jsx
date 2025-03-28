import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import http from "../helpers/http";
import { useParams } from "react-router";


export default function Profile() {
    const token = useSelector((state) => state.auth?.token) || localStorage.getItem("token");
    const name = localStorage.getItem('name')
    const id = localStorage.getItem('id')
    const [transactions, setTransactions] = useState([]);

    async function fetchTransaction() {
        try {
            const response = await http({
                method: 'GET',
                url: `/transactions/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data)
            setTransactions(response.data)
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
        fetchTransaction();
    }, [])

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
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                    </div>
                </div>
                <div className="stat-value text-primary">86%</div>
                <div className="stat-title text-black">Books done</div>
                <div className="stat-desc text-secondary">31 tasks remaining</div>
                </div>
        </div>
            <h2 className="text-3xl font-mono text-black pl-33 mb-7">Transactions: </h2>
            <div key={transactions.id} className="py-1 pl-60 text-black">
                <table className="table">
                    <thead>
                    <tr>
                        <th className="text-black">Book-ID</th>
                        <th className="text-black">Order-ID</th>
                        <th className="text-black">Payment Status</th>
                        <th className="text-black">Payment Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    <tr>
                        <th>{transactions.id}</th>
                        <td>{transactions.transactionId}</td>
                        <td>{transactions.paymentStatus}</td>
                        <td>{transactions.paymentDate}</td>
                    </tr>
                    </tbody>
                </table>
        </div>
        </div>


    
        </>
      );
    
}