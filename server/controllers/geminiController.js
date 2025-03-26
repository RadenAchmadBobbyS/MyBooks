const generateText = require('../helpers/geminiAI');
const { Book } = require('../models');
const { Op } = require('sequelize');

    class geminiController { 
        static async generateRespons(req, res) {
            try {
                const { prompt } = req.body

                // gemini recomendation books
                if (prompt.toLowerCase().includes("rekomendasi-buku")) {
                    const books = await Book.findAll({ limit: 5 });
                    const bookList = books.map(el => `${el.title} - ${el.author}`).join("\n");
                    return res.json({ response: `Berikut beberapa rekomendasi buku:\n ${bookList}`});
                }

                // gemini search books
                if (prompt.toLowerCase().includes("cari buku")) {
                    const query = prompt.replace("cari buku", "").trim();
                    const books = await Book.findAll({
                        where: {
                            title: {
                                [Op.ilike]: `%${query}%`
                            }
                        }
                    });

                    if (books.length === 0) {
                        return res.json({ response: `Maaf, buku ${query} tidak ditemukan.`})
                    }

                    const bookList = books.map((book) => `${book.title} - ${book.author}`).join("\n");
                    return res.json({ response: `Buku yang ditemukan: \n${bookList}`});
                }

                // bukan pencarian buku 
                const response = await generateText(prompt);
                res.json({ response });
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: 'Internal server error' })
            }
        }

    }

    module.exports = geminiController