const { Book, Favorite, Purchase } = require('../models')

class favoriteController {
    static async addToFavorite(req, res) {
        try {
            const { bookId } = req.body;
            const userId = req.user.id;

            const book = await Book.findByPk(bookId);

            if (!book) return res.status(404).json({ message: 'Book not found' })

            const isFree = parseFloat(book.price) === 0;
            const hasPurchased = await Purchase.findOne({
                where: { userId: bookId }
            })

            if (!isFree && !hasPurchased) return res.status(403).json({ message: 'You can only favorite free or purchased books' })

            const existingFavorite = await Favorite.findOne({
                where: { userId: bookId }
            })
            if (existingFavorite) return res.status(400).json({ message: 'Book already in favorites' })

            const favorite = await Favorite.create({
                userId: req.user.id,
                bookId
            });
            res.status(200).json(favorite);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getFavotire(req, res) {
        try {
            const favorite = await Favorite.findAll({
                where: { userId: req.user.id },
                include: {
                    model: Book,
                    attributes: ['id', 'title', 'author', 'price']
                }
            });

            res.status(200).json(favorite);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = favoriteController