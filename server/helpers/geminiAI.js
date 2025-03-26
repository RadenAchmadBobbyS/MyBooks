const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv')
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(process.env.GEMINI_API_KEY);

async function generateText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(`${prompt}\n(
            Jawablah dalam Bahasa Indonesia

            Saya ingin rekomendasi buku teknologi terbaik tahun ini dalam Bahasa Indonesia. 
            Jawaban harus menggunakan format berikut:

            1. Judul Buku - Nama Penulis  
                 Deskripsi singkat tentang buku ini.
                 Target pembaca: (Pemula / Menengah / Ahli) 

            Contoh:
            1. "Artificial Intelligence: A Guide for Thinking Humans" - Melanie Mitchell  
                Buku ini menjelaskan AI secara mudah dipahami, cocok untuk pemula yang ingin memahami konsep dasar AI.  
                Target pembaca: Pemula

            Sekarang, berikan rekomendasi buku berdasarkan format ini.

            Response harus dalam format JSON, buat tanpa \`\`\`json dan \`\`\`
        )`);
        
        const response = await result.response
        let text = response.text();

        text = JSON.parse(text.trim())
        return text
    } catch (error) {
        console.log(error)
    }
}

module.exports = generateText