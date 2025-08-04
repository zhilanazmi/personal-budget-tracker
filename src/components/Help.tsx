import React, { useState } from 'react';
import { Book, ChevronDown, ChevronRight, User, CreditCard, Plus, ArrowRightLeft, Receipt, BarChart3, Brain, Settings, Search, X, Download, Key } from 'lucide-react';

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      id: 'user-flow',
      title: 'Alur Penggunaan Aplikasi',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <span>🚀</span>
              <span>Langkah Demi Langkah Setelah Login</span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h5 className="font-bold text-slate-800">Setelah Login Berhasil</h5>
                  <p className="text-slate-700">Anda akan langsung diarahkan ke halaman <strong>Dashboard</strong> yang menampilkan ringkasan keuangan Anda.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h5 className="font-bold text-slate-800">Setup Akun Keuangan Pertama</h5>
                  <p className="text-slate-700 mb-2">Jika ini pertama kali login, sistem akan membuat 3 akun default untuk Anda:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• <strong>Tunai</strong> - untuk uang kas/tunai</li>
                    <li>• <strong>Bank Utama</strong> - untuk rekening bank</li>
                    <li>• <strong>Dompet Digital</strong> - untuk e-wallet (GoPay, OVO, dll)</li>
                  </ul>
                  <p className="text-slate-700 mt-2">Anda bisa mengubah nama, warna, dan menambah akun lain di menu <strong>"Kelola Akun"</strong>.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h5 className="font-bold text-slate-800">Mulai Mencatat Transaksi</h5>
                  <p className="text-slate-700 mb-2">Sekarang Anda siap mencatat transaksi keuangan harian:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• Klik menu <strong>"Tambah Transaksi"</strong> di sidebar</li>
                    <li>• Pilih jenis: <span className="text-green-600 font-semibold">Pemasukan</span> atau <span className="text-red-600 font-semibold">Pengeluaran</span></li>
                    <li>• Isi detail transaksi (akun, jumlah, kategori, deskripsi)</li>
                    <li>• Klik submit untuk menyimpan</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h5 className="font-bold text-slate-800">Transfer Antar Akun (Opsional)</h5>
                  <p className="text-slate-700 mb-2">Jika Anda perlu memindahkan uang antar akun:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• Klik menu <strong>"Transfer Dana"</strong></li>
                    <li>• Pilih akun sumber dan tujuan</li>
                    <li>• Masukkan jumlah dan deskripsi</li>
                    <li>• Sistem otomatis update saldo kedua akun</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <h5 className="font-bold text-slate-800">Monitor & Analisis</h5>
                  <p className="text-slate-700 mb-2">Setelah ada beberapa transaksi, manfaatkan fitur monitoring:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• <strong>Dashboard:</strong> Ringkasan harian/bulanan dan transaksi terbaru</li>
                    <li>• <strong>Riwayat Transaksi:</strong> Cari dan filter transaksi</li>
                    <li>• <strong>Laporan Keuangan:</strong> Grafik dan analisis dengan periode</li>
                    <li>• <strong>Analitik Cerdas:</strong> Prediksi AI dan deteksi anomali</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">6</div>
                <div>
                  <h5 className="font-bold text-slate-800">Kustomisasi (Opsional)</h5>
                  <p className="text-slate-700 mb-2">Sesuaikan aplikasi dengan kebutuhan Anda:</p>
                  <ul className="text-slate-600 text-sm space-y-1 ml-4">
                    <li>• <strong>Kelola Akun:</strong> Tambah akun baru (kartu kredit, investasi, dll)</li>
                    <li>• <strong>Pengaturan:</strong> Buat kategori kustom sesuai kebutuhan</li>
                    <li>• <strong>Warna & Ikon:</strong> Personalisasi tampilan akun dan kategori</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
            <h4 className="text-lg font-bold text-emerald-800 mb-3 flex items-center space-x-2">
              <span>💡</span>
              <span>Tips untuk Pengguna Baru</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-emerald-700 mb-2">🎯 Minggu Pertama:</h5>
                <ul className="text-emerald-600 text-sm space-y-1">
                  <li>• Catat semua transaksi harian secara konsisten</li>
                  <li>• Jangan lupa catat transaksi kecil (parkir, snack, dll)</li>
                  <li>• Gunakan deskripsi yang jelas dan spesifik</li>
                  <li>• Cek dashboard setiap hari untuk membiasakan diri</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-emerald-700 mb-2">📈 Setelah 2 Minggu:</h5>
                <ul className="text-emerald-600 text-sm space-y-1">
                  <li>• Mulai analisis pola pengeluaran di Laporan</li>
                  <li>• Identifikasi kategori dengan pengeluaran terbesar</li>
                  <li>• Gunakan fitur Analitik untuk trend dan prediksi</li>
                  <li>• Evaluasi apakah perlu kategori kustom tambahan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
            <h4 className="text-lg font-bold text-amber-800 mb-3 flex items-center space-x-2">
              <span>🔄</span>
              <span>Rutinitas Harian yang Disarankan</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌅</span>
                <div>
                  <h5 className="font-semibold text-amber-700">Pagi Hari</h5>
                  <p className="text-amber-600 text-sm">Buka aplikasi, cek saldo akun, rencanakan pengeluaran hari ini</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">☀️</span>
                <div>
                  <h5 className="font-semibold text-amber-700">Sepanjang Hari</h5>
                  <p className="text-amber-600 text-sm">Catat transaksi sesegera mungkin setelah terjadi (jangan menunda)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌙</span>
                <div>
                  <h5 className="font-semibold text-amber-700">Malam Hari</h5>
                  <p className="text-amber-600 text-sm">Review transaksi hari ini, pastikan tidak ada yang terlewat</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
            <h4 className="text-lg font-bold text-red-800 mb-3 flex items-center space-x-2">
              <span>❓</span>
              <span>Troubleshooting Umum</span>
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-red-700">❌ Saldo akun tidak sesuai?</h5>
                <p className="text-red-600 text-sm">Periksa riwayat transaksi, pastikan semua transaksi tercatat dengan benar dan tidak ada duplikasi.</p>
              </div>
              <div>
                <h5 className="font-semibold text-red-700">❌ Tidak bisa transfer dana?</h5>
                <p className="text-red-600 text-sm">Pastikan akun sumber memiliki saldo yang cukup dan akun sumber berbeda dari akun tujuan.</p>
              </div>
              <div>
                <h5 className="font-semibold text-red-700">❌ Kategori tidak muncul?</h5>
                <p className="text-red-600 text-sm">Kategori pengeluaran hanya muncul untuk transaksi pengeluaran, begitu juga sebaliknya.</p>
              </div>
              <div>
                <h5 className="font-semibold text-red-700">❌ Data hilang atau error?</h5>
                <p className="text-red-600 text-sm">Data tersimpan aman di cloud. Coba refresh halaman atau logout-login kembali.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Memulai Aplikasi',
      icon: Book,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-2xl border border-emerald-200">
            <h4 className="text-lg font-bold text-slate-800 mb-3">🌟 Fitur Utama:</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Kelola multiple akun (Bank, Tunai, E-wallet, dll.)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Catat pemasukan dan pengeluaran</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Transfer antar akun</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Laporan keuangan dengan grafik</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Analitik cerdas dengan prediksi AI</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Format mata uang Rupiah dengan titik pemisah</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">Langkah Pertama:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Buat akun atau login jika sudah memiliki akun</li>
              <li>Tambahkan akun keuangan pertama Anda (Bank, Tunai, dll.)</li>
              <li>Mulai mencatat transaksi harian</li>
              <li>Pantau dashboard dan laporan secara berkala</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      title: 'Login & Registrasi',
      icon: Key,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🔐 Mendaftar Akun Baru:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Klik tombol <strong>"Daftar di sini"</strong></li>
              <li>Isi formulir dengan:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Email valid (contoh: nama@email.com)</li>
                  <li>• Password minimal 6 karakter</li>
                  <li>• Konfirmasi password (harus sama)</li>
                </ul>
              </li>
              <li>Klik tombol <strong>"Daftar"</strong></li>
              <li>Cek email untuk verifikasi akun</li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🚪 Login ke Akun:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Masukkan email dan password yang sudah terdaftar</li>
              <li>Klik tombol <strong>"Masuk"</strong></li>
              <li>Jika berhasil, Anda akan diarahkan ke Dashboard</li>
            </ol>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h5 className="font-bold text-yellow-800 mb-2">💡 Tips Keamanan:</h5>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Gunakan password yang kuat (kombinasi huruf, angka, simbol)</li>
              <li>• Jangan berbagi informasi login dengan orang lain</li>
              <li>• Data Anda dilindungi dengan enkripsi tingkat enterprise</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'accounts',
      title: 'Mengelola Akun Keuangan',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🏦 Menambah Akun Baru:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Buka halaman <strong>"Kelola Akun"</strong> dari sidebar</li>
              <li>Klik tombol <strong>"Tambah Akun Baru"</strong></li>
              <li>Isi informasi akun:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• <strong>Nama Akun:</strong> Contoh "Bank BCA", "GoPay", "Tunai"</li>
                  <li>• <strong>Tipe Akun:</strong> Bank, Tunai, Dompet Digital, Kartu Kredit, Tabungan, Investasi, Lainnya</li>
                  <li>• <strong>Ikon:</strong> Pilih dari 10 ikon yang tersedia</li>
                  <li>• <strong>Warna:</strong> Pilih dari 10 warna atau gunakan warna kustom</li>
                </ul>
              </li>
              <li>Klik <strong>"Tambah Akun"</strong></li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">✏️ Mengedit/Menghapus Akun:</h4>
            <ul className="space-y-2 text-slate-700">
              <li><strong>Edit:</strong> Hover ke kartu akun → klik ikon pensil → ubah informasi → "Perbarui Akun"</li>
              <li><strong>Detail:</strong> Hover ke kartu akun → klik ikon mata → lihat 10 transaksi terakhir</li>
              <li><strong>Hapus:</strong> Hover ke kartu akun → klik ikon tempat sampah → konfirmasi</li>
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <h5 className="font-bold text-red-800 mb-2">⚠️ Perhatian:</h5>
            <p className="text-red-700 text-sm">Akun hanya bisa dihapus jika tidak memiliki transaksi dan saldo = 0</p>
          </div>
        </div>
      )
    },
    {
      id: 'transactions',
      title: 'Menambah Transaksi',
      icon: Plus,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">💰 Langkah-langkah:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Buka halaman <strong>"Tambah Transaksi"</strong> dari sidebar</li>
              <li>Pilih jenis: <strong>Pemasukan</strong> (uang masuk) atau <strong>Pengeluaran</strong> (uang keluar)</li>
              <li>Pilih akun yang akan digunakan</li>
              <li>Masukkan jumlah (format otomatis dengan titik pemisah)</li>
              <li>Pilih kategori yang sesuai</li>
              <li>Masukkan deskripsi transaksi</li>
              <li>Pilih tanggal (default: hari ini)</li>
              <li>Klik tombol submit</li>
            </ol>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h5 className="font-bold text-blue-800 mb-2">💡 Format Rupiah Otomatis:</h5>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Ketik: <code className="bg-white px-1 rounded">50000</code> → Tampil: <strong>50.000</strong></li>
              <li>• Ketik: <code className="bg-white px-1 rounded">1500000</code> → Tampil: <strong>1.500.000</strong></li>
              <li>• Tidak perlu mengetik titik atau koma</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🏷️ Kategori Tersedia:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-red-600 mb-2">Pengeluaran:</h5>
                <p className="text-sm text-slate-600">Transport, Food & Drink, Snacks, Groceries, Bills, Rent/Mortgage, Entertainment, Shopping, Education, Health, Savings, Others</p>
              </div>
              <div>
                <h5 className="font-semibold text-green-600 mb-2">Pemasukan:</h5>
                <p className="text-sm text-slate-600">Salary, Freelance, Business, Investment, Other Income</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'transfers',
      title: 'Transfer Dana',
      icon: ArrowRightLeft,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🔄 Langkah Transfer:</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Buka halaman <strong>"Transfer Dana"</strong> dari sidebar</li>
              <li>Pilih <strong>akun sumber</strong> (dari akun mana) - pastikan saldo mencukupi</li>
              <li>Pilih <strong>akun tujuan</strong> (ke akun mana) - harus berbeda dari akun sumber</li>
              <li>Masukkan <strong>jumlah transfer</strong> (format rupiah otomatis)</li>
              <li>Masukkan <strong>deskripsi</strong> transfer</li>
              <li>Pilih <strong>tanggal</strong> (default: hari ini)</li>
              <li>Klik <strong>"Transfer Dana"</strong></li>
            </ol>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">📊 Di Riwayat Transaksi:</h4>
            <p className="text-slate-700 mb-2">Transfer akan muncul sebagai 2 entri:</p>
            <ul className="space-y-1 text-slate-700">
              <li>• <span className="text-orange-600 font-semibold">Akun sumber:</span> Transfer keluar (-) dengan warna orange</li>
              <li>• <span className="text-blue-600 font-semibold">Akun tujuan:</span> Transfer masuk (+) dengan warna biru</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <h5 className="font-bold text-purple-800 mb-2">✅ Validasi Sistem:</h5>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Akun sumber dan tujuan harus berbeda</li>
              <li>• Saldo akun sumber harus mencukupi</li>
              <li>• Jumlah transfer harus lebih besar dari 0</li>
              <li>• Semua field wajib diisi</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'history',
      title: 'Riwayat Transaksi',
      icon: Receipt,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">📋 Fitur Riwayat:</h4>
            <ul className="space-y-2 text-slate-700">
              <li><strong>🔍 Pencarian:</strong> Cari berdasarkan deskripsi transaksi</li>
              <li><strong>🏷️ Filter Tipe:</strong> Semua, Pemasukan, Pengeluaran, Transfer</li>
              <li><strong>📂 Filter Kategori:</strong> Pilih kategori spesifik</li>
              <li><strong>🏦 Filter Akun:</strong> Lihat transaksi akun tertentu</li>
              <li><strong>📅 Filter Periode:</strong> Tentukan rentang waktu</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🎨 Kode Warna Transaksi:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-semibold">Pemasukan (+)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-semibold">Pengeluaran (-)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-purple-700 font-semibold">Transfer (⇄)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">📄 Informasi Setiap Transaksi:</h4>
            <ul className="space-y-1 text-slate-700">
              <li>• Ikon dan warna sesuai jenis transaksi</li>
              <li>• Deskripsi transaksi</li>
              <li>• Kategori (dengan warna)</li>
              <li>• Nama akun (dengan indikator warna)</li>
              <li>• Tanggal transaksi</li>
              <li>• Jumlah dengan format rupiah</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Laporan Keuangan',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">📈 Filter Periode:</h4>
            <ul className="space-y-1 text-slate-700">
              <li>• <strong>Hari Ini:</strong> Transaksi hari ini saja</li>
              <li>• <strong>Minggu Ini:</strong> 7 hari terakhir</li>
              <li>• <strong>Bulan Ini:</strong> Bulan berjalan</li>
              <li>• <strong>Tahun Ini:</strong> Tahun berjalan</li>
              <li>• <strong>Kustom:</strong> Pilih tanggal mulai dan akhir</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">📊 Komponen Laporan:</h4>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <h5 className="font-semibold text-emerald-800">💰 Ringkasan Finansial</h5>
                <p className="text-emerald-700 text-sm">Total Pemasukan, Total Pengeluaran, Net Balance</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <h5 className="font-semibold text-blue-800">🥧 Pie Chart - Breakdown Kategori</h5>
                <p className="text-blue-700 text-sm">Visualisasi persentase pengeluaran per kategori dengan warna unik</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <h5 className="font-semibold text-purple-800">📊 Bar Chart - Trend Harian</h5>
                <p className="text-purple-700 text-sm">Grafik batang pemasukan (hijau) dan pengeluaran (merah) per hari</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <h5 className="font-bold text-yellow-800 mb-2">💡 Tips Analisis:</h5>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Bandingkan periode yang berbeda untuk melihat trend</li>
              <li>• Perhatikan kategori dengan pengeluaran terbesar</li>
              <li>• Gunakan laporan harian untuk tracking kebiasaan</li>
              <li>• Laporan bulanan baik untuk evaluasi budget</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Analitik Cerdas',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🧠 4 Tab Analitik:</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <h5 className="font-semibold text-purple-800 flex items-center space-x-2 mb-2">
                  <span>🔮</span><span>Prediksi</span>
                </h5>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Prediksi pengeluaran bulan depan berdasarkan data historis</li>
                  <li>• Tren pengeluaran 6 bulan terakhir</li>
                  <li>• Grafik prediktif dengan tingkat akurasi</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h5 className="font-semibold text-blue-800 flex items-center space-x-2 mb-2">
                  <span>📊</span><span>Perbandingan</span>
                </h5>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Perbandingan bulan ke bulan pengeluaran dan pemasukan</li>
                  <li>• Grafik bar trend 6 bulan terakhir</li>
                  <li>• Persentase perubahan dari bulan sebelumnya</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 flex items-center space-x-2 mb-2">
                  <span>💹</span><span>Arus Kas</span>
                </h5>
                <ul className="text-emerald-700 text-sm space-y-1">
                  <li>• Analisis arus kas harian 30 hari terakhir</li>
                  <li>• Saldo berjalan dari waktu ke waktu</li>
                  <li>• Net flow positif/negatif setiap hari</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <h5 className="font-semibold text-orange-800 flex items-center space-x-2 mb-2">
                  <span>⚠️</span><span>Deteksi Anomali</span>
                </h5>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Deteksi pengeluaran tidak normal (jauh dari rata-rata)</li>
                  <li>• Alert untuk transaksi besar yang tidak biasa</li>
                  <li>• Rekomendasi untuk review transaksi</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🎯 Manfaat Analitik:</h4>
            <ul className="space-y-1 text-slate-700">
              <li>• Membantu prediksi kebutuhan keuangan masa depan</li>
              <li>• Mengidentifikasi pola pengeluaran yang boros</li>
              <li>• Memberikan early warning untuk pengeluaran abnormal</li>
              <li>• Membantu perencanaan budget yang lebih baik</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Pengaturan',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">⚙️ Kelola Kategori Kustom:</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-slate-800 mb-2">➕ Menambah Kategori Baru:</h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-sm">
                  <li>Klik <strong>"Tambah Kategori Kustom"</strong></li>
                  <li>Isi nama kategori (contoh: "Hobi", "Asuransi")</li>
                  <li>Pilih tipe: Pengeluaran atau Pemasukan</li>
                  <li>Pilih warna dari 10 warna tersedia</li>
                  <li>Klik <strong>"Tambah Kategori"</strong></li>
                </ol>
              </div>
              <div>
                <h5 className="font-semibold text-slate-800 mb-2">✏️ Mengedit/Menghapus:</h5>
                <ul className="space-y-1 text-slate-700 text-sm">
                  <li>• <strong>Edit:</strong> Klik ikon pensil → ubah nama/warna → "Simpan Perubahan"</li>
                  <li>• <strong>Hapus:</strong> Klik ikon tempat sampah → konfirmasi penghapusan</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <h5 className="font-bold text-red-800 mb-2">⚠️ Perhatian:</h5>
            <p className="text-red-700 text-sm">Kategori hanya bisa dihapus jika tidak ada transaksi yang menggunakan kategori tersebut.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">🏷️ Kategori Default:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <h5 className="font-semibold text-red-600 mb-2">Pengeluaran:</h5>
                <p className="text-red-700 text-sm">Transport, Food & Drink, Snacks, Groceries, Bills, Rent/Mortgage, Entertainment, Shopping, Education, Health, Savings, Others</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <h5 className="font-semibold text-green-600 mb-2">Pemasukan:</h5>
                <p className="text-green-700 text-sm">Salary, Freelance, Business, Investment, Other Income</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.id.includes(searchTerm.toLowerCase())
  );

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-4xl sm:text-3xl font-bold text-slate-800 tracking-tight">Panduan Pengguna</h2>
              <p className="text-slate-600 text-lg sm:text-base font-medium">Manual lengkap cara menggunakan aplikasi</p>
            </div>
          </div>
          <a
            href="/MANUAL_PENGGUNA.md"
            download="Manual_FinFlow.md"
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold group"
            title="Download Manual dalam format Markdown"
          >
            <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Download Manual</span>
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="glass-effect rounded-3xl p-6 border border-white/20 fade-in" style={{ animationDelay: '100ms' }}>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-slate-100 rounded-xl">
            <Search className="text-slate-600 w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-medium bg-white/60 backdrop-blur-sm input-focus transition-all duration-200"
            placeholder="🔍 Cari topik panduan..."
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
          <span className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
            <span className="text-white text-lg">🚀</span>
          </span>
          <span>Panduan Cepat</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-bold text-slate-800 mb-1">Login/Daftar</h4>
            <p className="text-slate-600 text-sm">Buat akun baru atau masuk ke akun existing</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-bold text-slate-800 mb-1">Tambah Akun</h4>
            <p className="text-slate-600 text-sm">Setup akun keuangan (Bank, Tunai, E-wallet)</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-bold text-slate-800 mb-1">Catat Transaksi</h4>
            <p className="text-slate-600 text-sm">Mulai mencatat pemasukan dan pengeluaran</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200">
            <div className="text-2xl mb-2">4️⃣</div>
            <h4 className="font-bold text-slate-800 mb-1">Pantau Laporan</h4>
            <p className="text-slate-600 text-sm">Review dashboard dan analitik secara berkala</p>
          </div>
        </div>
      </div>

      {/* Manual Sections */}
      <div className="space-y-4 fade-in" style={{ animationDelay: '300ms' }}>
        {filteredSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <div key={section.id} className="glass-effect rounded-3xl border border-white/20 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-all duration-200 focus-ring"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{section.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full">
                    {isActive ? 'Tutup' : 'Buka'}
                  </span>
                  {isActive ? (
                    <ChevronDown className="w-6 h-6 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-slate-500" />
                  )}
                </div>
              </button>
              
              {isActive && (
                <div className="px-6 pb-6 border-t border-slate-200/50 slide-in">
                  <div className="pt-6">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
          <span className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
            <span className="text-white text-lg">💡</span>
          </span>
          <span>Tips & Trik</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">🔧 Tips Teknis:</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
                <span><strong>Format Rupiah:</strong> Ketik angka biasa, sistem format otomatis dengan titik</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
                <span><strong>Shortcut:</strong> Esc (tutup sidebar), Tab (navigasi form), Enter (submit)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2"></span>
                <span><strong>Responsive:</strong> Bekerja optimal di desktop dan mobile</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800">📊 Tips Keuangan:</h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span><strong>Konsisten:</strong> Catat transaksi segera setelah terjadi</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span><strong>Review:</strong> Check dashboard harian, laporan mingguan</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                <span><strong>Planning:</strong> Gunakan analitik untuk budget masa depan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="glass-effect rounded-3xl p-8 border border-white/20 text-center fade-in" style={{ animationDelay: '500ms' }}>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Butuh Bantuan Lebih Lanjut?</h3>
          <p className="text-slate-600 mb-4">
            Jika ada fitur yang belum jelas atau mengalami kendala, jangan ragu untuk menghubungi tim support.
          </p>
          <p className="text-slate-600">
            Kami siap membantu Anda mengoptimalkan penggunaan aplikasi FinFlow untuk pengelolaan keuangan yang lebih baik.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help; 