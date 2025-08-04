import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateFinanceSummary } from "./financeDataProvider";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(geminiApiKey);

// Fungsi untuk mendapatkan model Gemini
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// Konteks aplikasi yang detail untuk memberikan pemahaman mendalam tentang aplikasi
const appContext = `
# Informasi Detail Aplikasi FinFlow (Personal Budget Tracker)

## Fitur Utama Aplikasi
1. Dashboard - Menampilkan ringkasan keuangan, saldo total, pemasukan/pengeluaran bulan ini, dan tren keuangan
2. Kelola Akun - Mengelola berbagai jenis akun keuangan (bank, tunai, e-wallet, dll)
3. Tambah Transaksi - Mencatat pemasukan dan pengeluaran dengan kategori
4. Transfer Dana - Memindahkan dana antar akun yang berbeda
5. Riwayat Transaksi - Melihat, mencari, dan memfilter riwayat transaksi
6. Laporan Keuangan - Grafik dan visualisasi data keuangan dengan periode waktu yang dapat disesuaikan
7. Analitik Cerdas - Prediksi pengeluaran, perbandingan bulan ke bulan, analisis arus kas, dan deteksi anomali
8. Panduan Pengguna - Dokumentasi lengkap cara menggunakan aplikasi
9. Pengaturan - Mengelola kategori kustom dan preferensi aplikasi

## Struktur Data Utama
- Transaksi: id, amount, type (income/expense/transfer), category, description, date, accountId
- Akun: id, name, type (bank/cash/digital_wallet/credit_card/savings/investment/other), balance, color, icon
- Kategori: id, name, icon, color, isCustom
- Laporan: totalIncome, totalExpenses, balance, categoryBreakdown, accountBalances

## Alur Penggunaan Aplikasi
1. Login/Registrasi - Pengguna membuat akun atau login ke akun yang sudah ada
2. Setup Akun - Sistem membuat 3 akun default (Tunai, Bank Utama, Dompet Digital) atau pengguna dapat menambahkan akun baru
3. Mencatat Transaksi - Pengguna mencatat pemasukan/pengeluaran harian dengan kategori
4. Transfer Antar Akun - Memindahkan dana antar akun yang berbeda
5. Monitoring - Melihat dashboard, laporan, dan analitik untuk memantau keuangan

## Kategori Default
- Pengeluaran: Transport, Food & Drink, Snacks, Groceries, Bills, Rent/Mortgage, Entertainment, Shopping, Education, Health, Savings, Others
- Pemasukan: Salary, Freelance, Business, Investment, Other Income

## Tips Penggunaan
- Catat transaksi secara konsisten dan segera setelah terjadi
- Gunakan kategori yang tepat untuk memudahkan analisis
- Review dashboard secara harian dan laporan secara mingguan
- Gunakan fitur analitik untuk prediksi dan perencanaan budget
- Buat kategori kustom sesuai kebutuhan personal

## Fitur Khusus
- Format Rupiah otomatis dengan titik pemisah
- Tema gelap/terang yang dapat disesuaikan
- Responsif di desktop dan mobile
- Data tersimpan aman di cloud
- Analitik cerdas dengan prediksi AI
`;

// Fungsi untuk mengirim pesan ke Gemini dan mendapatkan respons
export const getChatResponse = async (message: string) => {
  try {
    const model = getGeminiModel();
    
    // Konteks aplikasi untuk memberikan informasi mendalam tentang aplikasi
    const systemPrompt = `Kamu adalah asisten keuangan pribadi bernama "FinFlow Assistant" yang membantu pengguna aplikasi FinFlow (Personal Budget Tracker). 

${appContext}

Tugas utamamu:
1. Menjawab pertanyaan tentang cara menggunakan aplikasi FinFlow dengan detail dan akurat
2. Memberikan bantuan navigasi di aplikasi (menjelaskan di mana menemukan fitur tertentu)
3. Menjelaskan fitur-fitur aplikasi secara detail sesuai konteks di atas
4. Memberikan tips pengelolaan keuangan yang relevan
5. Menjawab pertanyaan umum tentang budgeting, tabungan, dan manajemen keuangan pribadi
6. Menganalisis dan merangkum data keuangan pengguna jika tersedia di bagian [FINANCE DATA]

Ketika pengguna menanyakan tentang data keuangan mereka:
- Jika ada data di bagian [FINANCE DATA], gunakan data tersebut untuk memberikan jawaban yang akurat dan personal
- Jika tidak ada data, beri tahu pengguna bahwa kamu tidak dapat mengakses data keuangan mereka saat ini
- Jika pengguna meminta rangkuman atau analisis keuangan, berikan insight yang berguna berdasarkan data yang tersedia

Berikan jawaban yang singkat, jelas, dan bermanfaat. Jika pengguna menanyakan fitur yang tidak ada dalam aplikasi, jelaskan fitur terdekat yang tersedia atau berikan alternatif. Jawab selalu dalam Bahasa Indonesia yang sopan dan ramah.`;
    
    // Simpan riwayat chat di localStorage jika tersedia
    let chatHistory: Array<{ sender: string; text: string; timestamp: string }> = [];
    try {
      const savedHistory = localStorage.getItem('finflow_chat_history');
      if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.log('Tidak dapat mengakses localStorage:', error);
    }
    
    // Batasi riwayat chat yang disimpan (maksimal 10 interaksi terakhir)
    const limitedHistory = chatHistory.slice(-10);
    
    // Konversi riwayat chat ke format yang dibutuhkan Gemini
    const formattedHistory = limitedHistory.map((item: { sender: string; text: string }) => ({
      role: item.sender === 'user' ? 'user' : 'model',
      parts: [{ text: item.text }]
    }));
    
    // Tambahkan prompt awal jika tidak ada riwayat
    const initialHistory = formattedHistory.length > 0 ? formattedHistory : [
      {
        role: "user",
        parts: [{ text: "Perkenalkan dirimu sebagai asisten keuangan FinFlow" }],
      },
      {
        role: "model",
        parts: [{ text: "Halo! Saya adalah FinFlow Assistant, asisten keuangan pribadi Anda di aplikasi FinFlow. Saya memiliki pengetahuan mendalam tentang aplikasi ini dan siap membantu Anda dengan pertanyaan seputar penggunaan aplikasi, pengelolaan keuangan, budgeting, tips menghemat, dan banyak lagi. Apa yang bisa saya bantu hari ini?" }],
      },
    ];
    
    const chat = model.startChat({
      history: initialHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.2, // Lebih rendah untuk jawaban yang lebih konsisten dan faktual
      },
    });

    // Dapatkan data keuangan pengguna jika tersedia
    const financeSummary = generateFinanceSummary();
    
    // Tambahkan data keuangan ke konteks jika tersedia
    let fullPrompt = `[SYSTEM INSTRUCTION] ${systemPrompt}`;
    
    if (financeSummary) {
      fullPrompt += `\n\n[FINANCE DATA]\n${financeSummary}\n[/FINANCE DATA]`;
    }
    
    fullPrompt += ` [/SYSTEM INSTRUCTION]\n\n[USER QUERY] ${message} [/USER QUERY]`;
    
    // Kirim pesan dengan konteks sistem dan data keuangan
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    
    // Simpan interaksi baru ke localStorage
    try {
      const newUserMessage = { sender: 'user', text: message, timestamp: new Date() };
      const newBotMessage = { sender: 'bot', text: response.text(), timestamp: new Date() };
      
      const updatedHistory = [...limitedHistory, newUserMessage, newBotMessage];
      localStorage.setItem('finflow_chat_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Tidak dapat menyimpan ke localStorage:', error);
    }
    
    return response.text();
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.";
  }
}; 