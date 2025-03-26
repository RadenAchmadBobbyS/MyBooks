const { Book, Favorite, Purchase } = require('../models')

class favoriteController {
    static async addToFavorite(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user.id;

            const books = await Book.findByPk(bookId);

            if (!books) return res.status(404).json({ message: 'Book not found' })

            const isFree = parseFloat(books.price) === 0;
            const hasPurchased = await Purchase.findOne({
                where: { userId, bookId, paymentStatus: 'paid' }
            })

            if (!isFree && !hasPurchased) return res.status(403).json({ message: 'You can only favorite free or purchased books' })

            const existingFavorite = await Favorite.findOne({
                where: { userId, bookId }
            })
            if (existingFavorite) return res.status(400).json({ message: 'Book already in favorites' })

            const favorites = await Favorite.create({
                userId,
                bookId
            });
            res.status(200).json(favorites);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getFavotire(req, res) {
        try {
            const favorites = await Favorite.findAll({
                where: { userId: req.user.id },
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'author', 'price']
                }
            });

            res.status(200).json(favorites);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = favoriteController