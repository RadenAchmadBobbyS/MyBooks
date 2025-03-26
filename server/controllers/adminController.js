const { Purchase, User, Book } = require('../models')

class adminController { 
    static async getUserTransaction(req, res) {
        try {
            const transaction = await Purchase.findAll({
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: Book, attributes: ['id', 'title', 'author', 'price'] }
                ],
                order: [[ 'paymentDate', 'DESC' ]]
            });

            res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async getUserTransactionById(req, res) {
        try {
            const transaction = await Purchase.findOne({
                where: { id: req.user.id },
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: Book, attributes: ['id', 'title', 'author', 'price'] }
                ]
            });

            if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
            res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async getAllusers(req, res) {
        try {
            const user = await User.findAll()
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.user.id;
            const { role } = req.body;  

            const user = await User.findOne(id);
            if (!user) return res.status(404).json({ message: 'User not found' })

            user.role = role
            await user.save();

            res.status(200).json({ message: 'user role updated', user })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.user.id;

            const user = await User.findByPk(id);
            if (!user) return res.status(404).json({ message: 'User not found' })

            await user.destroy();
            res.status(200).json({ message: 'user deleted' })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = adminController