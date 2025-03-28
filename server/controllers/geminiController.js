const generateText = require('../helpers/geminiAI');
const { Book } = require('../models');
const { Op } = require('sequelize');

class geminiController { 
    static async generateRespons(req, res) {
        try {
            const { prompt, input } = req.body;


            if (/rekomendasi.*buku/i.test(prompt)) {
                const books = await Book.findAll({ limit: 5 });
                if (books.length === 0) {
                    return res.json({ response: "Maaf, saat ini tidak ada rekomendasi buku yang tersedia." });
                }

                const bookList = books.map((el, idx) => `${idx + 1}. ${el.title} - ${el.author}`).join("\n");
                return res.json({ response: `Berikut beberapa rekomendasi buku:\n\n${bookList}` });
            }

            const searchMatch = prompt.match(/cari buku (.+)/i);
            if (searchMatch) {
                const query = searchMatch[1].trim();
                if (!query) {
                    return res.json({ response: "Silakan masukkan judul buku yang ingin Anda cari." });
                }

                const books = await Book.findAll({
                    where: { title: { [Op.iLike]: `%${query}%` } }
                });

                if (books.length === 0) {
                    return res.json({ response: `Maaf, buku berjudul "${query}" tidak ditemukan di database.` });
                }

                const bookList = books.map((book, idx) => `${idx + 1}. ${book.title} - ${book.author}`).join("\n");
                return res.json({ response: `Buku yang ditemukan:\n\n${bookList}` });
            }

            const response = await generateText(prompt);
            res.json({ response });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = geminiController;

module.exports.someFunction = (req, res) => {
  res.status(200).send({ message: 'Gemini function placeholder' });
};
