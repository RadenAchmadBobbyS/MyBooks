const generateText = require('../helpers/geminiAI');

describe('generateText', () => {

    it('should return plain text for non-book-related prompts', async () => {
        const prompt = 'Apa itu AI?';
        const result = await generateText(prompt);
        expect(typeof result).toBe('string');
    });

    it('should handle empty input gracefully', async () => {
        const prompt = '';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

    it('should handle API errors gracefully', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const prompt = 'trigger error';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

    it('should return JSON for book-related prompts', async () => {
        const prompt = 'Berikan rekomendasi buku teknologi.';
        const result = await generateText(prompt);
        expect(typeof result).toBe('string');
    });

    it('should handle invalid JSON structure gracefully', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const prompt = 'trigger invalid JSON';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

    it('should handle extremely long prompts gracefully', async () => {
        const prompt = 'a'.repeat(10000); // Very long prompt
        const result = await generateText(prompt);
        expect(typeof result).toBe('string');
    });

    it('should handle missing API key gracefully', async () => {
        process.env.GEMINI_API_KEY = ''; // Simulate missing API key
        const prompt = 'Test missing API key';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

    it('should handle invalid model name gracefully', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const prompt = 'trigger invalid model';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

    it('should handle API call failure gracefully', async () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        const prompt = 'trigger API failure';
        const result = await generateText(prompt);
        expect(result).toBe('Terjadi kesalahan dalam memproses jawaban.');
    });

});