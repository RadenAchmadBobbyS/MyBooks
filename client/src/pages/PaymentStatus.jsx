import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import http from "../helpers/http";

const PaymentStatus = () => {
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id");

    useEffect(() => {
        if (!orderId) {
            setStatus("invalid");
            return;
        }

        // Ambil status transaksi dari backend
        http.get(`/transactions/${orderId}`)
            .then((response) => {
                if (response.data.paymentStatus === "paid") {
                    setStatus("success");
                    setTimeout(() => navigate("/profile"), 3000); // Redirect ke profil setelah 3 detik
                } else if (response.data.paymentStatus === "failed") {
                    setStatus("failed");
                    setTimeout(() => navigate("/"), 3000); // Redirect ke homepage
                } else {
                    setStatus("pending");
                }
            })
            .catch(() => {
                setStatus("error");
            });
    }, [orderId, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {status === "loading" && <p>🔄 Checking payment status...</p>}
            {status === "success" && <p>✅ Payment successful! Redirecting...</p>}
            {status === "failed" && <p>❌ Payment failed! Redirecting...</p>}
            {status === "pending" && <p>⏳ Payment is pending...</p>}
            {status === "invalid" && <p>⚠️ Invalid transaction.</p>}
            {status === "error" && <p>❌ Error fetching transaction status.</p>}
        </div>
    );
};

export default PaymentStatus;
