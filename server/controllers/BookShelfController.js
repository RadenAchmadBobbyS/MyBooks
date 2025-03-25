const axios = require('axios');

class BookshelfController {
    static async addBookToShelf(req, res) {
        try {
            const { shelfId } = req.params; 
            const { volumeId } = req.body; 

            if (!volumeId) {
                return res.status(400).json({ message: 'Volume ID is required' });
            }

            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
              return res.status(401).json({ error: "Access token is required" });
            }
      
            const accessToken = authHeader.split(" ")[1];

            const googleApiUrl = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/addVolume?volumeId=${volumeId}`;

            const response = await axios.post(googleApiUrl, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            res.json({ message: 'Book added successfully', data: response.data });
        } catch (error) {
            res.status(500).json({ 
                message: 'Failed to add book', 
                error: error.response?.data || error.message 
            });
        }
    }

    static async getBooksFromShelf(req, res) {
        try {
            const { shelfId } = req.params;
            const accessToken = req.user.googleAccessToken;

            const googleApiUrl = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/volumes`;

            const response = await axios.get(googleApiUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            res.json(response.data);
        } catch (error) {
            res.status(500).json({ 
                message: 'Failed to get books', 
                error: error.response?.data || error.message 
            });
        }
    }
}

module.exports = BookshelfController;
