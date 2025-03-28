import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/purchases"); // Redirect ke riwayat pembelian
        }, 3000);
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-2xl font-bold text-green-500">Pembayaran Berhasil ✅</h1>
            <p>Terima kasih! Anda akan diarahkan ke halaman pembelian...</p>
        </div>
    );
}