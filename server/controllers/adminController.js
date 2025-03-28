const { Purchase, User, Book } = require('../models')

class adminController { 
    static async getUserTransaction(req, res) {
        try {
            const transactions = await Purchase.findAll({
                include: [
                    { model: User, attributes: ['id', 'name', 'email'] },
                    { model: Book, attributes: ['id', 'title', 'author', 'price'] }
                ],
                order: [[ 'paymentDate', 'DESC' ]]
            });

            res.status(200).json(transactions);
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

            if (!transaction) return res.status(404).json({ message: 'transactions not found' });
            res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async getAllusers(req, res) {
        try {
            const users = await User.findAll()
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params; // Corrected to use req.params.id
            const { role } = req.body;  

            if (!role) {
                return res.status(400).json({ message: 'Role is required' }); // Added validation for missing role
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: `User ${id} not found` });
            }

            user.role = role;
            await user.save();

            res.status(200).json({ message: `User ${id} role updated successfully` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: `User ${id} not found` })
            }

            await User.destroy({ where: { id: id }});
            res.status(200).json({ message: `user ${user.name} success deleted` })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}

module.exports = adminController