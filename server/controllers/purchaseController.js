const { Purchase, Book } = require('../models');
const midtransClient = require('midtrans-client');

class purchaseController {
    static async createPurchase(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user?.id;
            const userEmail = req.user?.email;

            if (!userId) {
                return res.status(400).json({ message: 'User not authenticated' });
            }

            if (!bookId || isNaN(bookId)) {
                return res.status(400).json({ message: 'Invalid bookId' });
              }
              
              if (!req.user || !req.user.email) {
                return res.status(400).json({ message: 'User email is required' });
              }

            const existingPurchase = await Purchase.findOne({
                where: {
                    userId,
                    bookId,
                    paymentStatus: 'paid'  // Hanya cek transaksi yang sudah dibayar
                }
            });
    
            if (existingPurchase) {
                return res.status(400).json({ message: 'You have already purchased this book' });
            }
    

            const books = await Book.findByPk(bookId);
            if (!books) return res.status(404).json({ message: 'Book not found' });

            if (isNaN(Number(books.price))) {
                return res.status(400).json({ message: 'Invalid book price' });
            }

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                transaction_details: {
                    order_id: `order-${Date.now()}`,
                    gross_amount: Number(books.price)
                },
                customer_details: {
                    email: userEmail
                }
            };

            try {
                const transaction = await snap.createTransaction(parameter);

                const purchase = await Purchase.create({
                    userId,
                    bookId,
                    transactionId: parameter.transaction_details.order_id,
                    paymentStatus: 'pending',
                    grossAmount: books.price,
                    paymentDate: new Date()
                });

                res.status(201).json({
                    purchase,
                    token: transaction.token,
                    redirect_url: transaction.redirect_url
                });
            } catch (error) {
                console.log('Midtrans error:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }   

    static async midtransWebHook(req, res) {
        try {
            console.log("Received Webhook:", req.body);
    
            const { order_id, transaction_status } = req.body;
    
            if (!order_id) {
                console.error("Missing order_id in webhook payload");
                return res.status(400).json({ message: "Missing order_id" });
            }
    
            const validStatuses = ['settlement', 'capture', 'expire', 'cancel', 'pending'];
            if (!validStatuses.includes(transaction_status)) {
                console.warn(`Unexpected transaction_status: ${transaction_status}`);
                return res.status(400).json({ message: 'Invalid transaction status' });
            }
    
            let paymentStatus;
    
            if (transaction_status === 'settlement' || transaction_status === 'capture') {
                paymentStatus = 'paid';
            } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
                paymentStatus = 'failed';
            } else {
                paymentStatus = 'pending';
            }
    
            const purchase = await Purchase.findOne({ where: { transactionId: order_id }});
            if (!purchase) {
                console.error(`Transaction not found for order_id: ${order_id}`);
                return res.status(404).json({ message: 'Transaction not found' });
            }
    
            try {
                await purchase.update({ 
                    paymentStatus, 
                    paymentDate: new Date() 
                });
                console.log(`Transaction ${order_id} updated to status: ${paymentStatus}`);
            } catch (updateError) {
                console.error(`Failed to update transaction ${order_id}:`, updateError);
                return res.status(500).json({ message: 'Failed to update transaction status' });
            }
    
            res.status(200).json({ message: 'Transaction status updated' });
    
        } catch (error) {
            console.error("Webhook Error:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async readBook(req, res) {
        const { bookId } = req.params;
        const userId = req.user.id;
    
        try {
            // Periksa apakah pengguna telah membeli buku
            const purchase = await Purchase.findOne({
                where: {
                    bookId: bookId,
                    userId: userId,
                    paymentStatus: 'paid'
                }
            });
    
            if (!purchase) {
                return res.status(403).json({ message: 'Book not purchased' });
            }
    
            // Cari buku berdasarkan ID
            const book = await Book.findByPk(bookId);
    
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
    
            // Kembalikan konten buku (misalnya, teks atau HTML)
            res.status(200).json({
                title: book.title,
                author: book.author,
                content: book.content // Pastikan `book.content` menyimpan teks atau URL buku
            });
        } catch (error) {
            console.error('Error reading book:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

}

    

    

module.exports = purchaseController