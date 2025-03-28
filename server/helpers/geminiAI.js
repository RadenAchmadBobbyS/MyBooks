const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateText(prompt) {
    try {
        if (!prompt) {
            throw new Error('Input cannot be empty')
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        let formattedPrompt;

        if (/rekomendasi|buku|novel|bacaan/i.test(prompt)) {
            formattedPrompt = `${prompt}\n(
                Jawablah dalam Bahasa Indonesia.

                Jika pengguna meminta rekomendasi buku, berikan daftar buku teknologi terbaru dalam format JSON berikut:
                {
                    "response": [
                        {
                            "Judul Buku": "Nama Buku",
                            "Nama Penulis": "Nama Penulis",
                            "Deskripsi singkat": "Deskripsi singkat tentang buku ini.",
                            "Target pembaca": "Pemula / Menengah / Ahli"
                        }
                    ]
                }

                Jika pengguna bertanya sesuatu selain buku, berikan jawaban sesuai konteks tanpa format JSON.
            )`;
        } else {
            formattedPrompt = `${prompt}\n(Jawablah dalam Bahasa Indonesia secara ringkas dan jelas tanpa format JSON.)`;
        }

        const result = await model.generateContent(formattedPrompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json|```/g, '').trim();
        try {
            text = JSON.parse(text.trim());
        } catch (e) {
            
        }

        return text;
    } catch (error) {
        console.log(error);
        return "Terjadi kesalahan dalam memproses jawaban.";
    }
}


module.exports = generateText;
