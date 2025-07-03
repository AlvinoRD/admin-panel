# Admin Panel Sistem Manajemen Restoran

Selamat datang di repositori proyek UAS (Ujian Akhir Semester) untuk mata kuliah Pemrograman Web Lanjut. Proyek ini adalah aplikasi admin panel untuk sistem manajemen restoran yang dibangun menggunakan React, TypeScript, dan Firebase sebagai Backend as a Service (BaaS).

Aplikasi ini dirancang untuk mengelola menu restoran, menangani pesanan pelanggan secara real-time, dan melihat statistik penjualan melalui dashboard. Aplikasi ini menggunakan Firebase Firestore untuk menyimpan dan mengelola data menu dan pesanan.

## Demo Aplikasi

Anda dapat mengakses dan mencoba aplikasi yang sudah di-deploy melalui link berikut:

[Akses Admin Panel](https://login-a3932-admin.web.app)

**Kredensial untuk Login:**  
Email: ujicoba@gmail.com  
Password: lab12345

## Fitur Utama

- **Autentikasi Aman**: Sistem login berbasis Firebase Authentication dengan verifikasi peran admin.
- **Dashboard**: Tampilan ringkasan yang menampilkan jumlah menu, total pesanan, dan statistik pesanan berdasarkan status.
- **Manajemen Menu**: Tambah, lihat, ubah, dan hapus menu. Setiap menu memiliki informasi nama, harga, deskripsi, kategori, dan status ketersediaan.
- **Manajemen Pesanan**: Pemantauan pesanan secara real-time dengan kemampuan untuk mengubah status pesanan (pending, processing, ready, completed, cancelled).
- **Antarmuka Responsif**: Desain yang responsif menggunakan Tailwind CSS untuk pengalaman pengguna yang optimal.

## Teknologi yang Digunakan

- **Framework Frontend**: React dengan TypeScript
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Development & Build**: Create React App

## Struktur Proyek

- **src/**: Direktori utama untuk kode sumber aplikasi.
  - **components/**: Berisi komponen UI yang dapat digunakan kembali.
    - **AdminLayout.tsx**: Layout untuk halaman admin dengan navigasi sidebar.
    - **PrivateRoute.tsx**: Komponen untuk menangani rute terproteksi yang memerlukan autentikasi.
    - **forms/**: Komponen form untuk input data.
    - **tables/**: Komponen tabel untuk menampilkan data.
  - **context/**: Implementasi React Context API untuk state management global.
    - **AuthContext.tsx**: Konteks untuk manajemen state autentikasi.
  - **firebase/**: Konfigurasi dan setup Firebase.
    - **firebase.ts**: Inisialisasi Firebase dan ekspor instance.
  - **hooks/**: Custom React hooks untuk logika yang dapat digunakan kembali.
    - **useLogin.ts**: Hook untuk manajemen state login.
    - **useMenuManager.ts**: Hook untuk operasi CRUD pada menu.
    - **useFormManager.ts**: Hook untuk manajemen state form.

  - **pages/**: Halaman-halaman utama aplikasi.
    - **Dashboard.tsx**: Halaman dashboard dengan statistik.
    - **Login.tsx**: Halaman login.
    - **MenuManager.tsx**: Halaman manajemen menu.
    - **OrderManager.tsx**: Halaman manajemen pesanan.
  - **services/**: Layer service untuk operasi data dan logika bisnis.
    - **AuthService.ts**: Service untuk autentikasi dan manajemen user.
    - **MenuService.ts**: Service untuk operasi CRUD menu.
    - **OrderService.ts**: Service untuk operasi pesanan.
  - **types/**: Definisi TypeScript untuk tipe data aplikasi.
    - **menuTypes.ts**: Definisi tipe untuk menu dan kategori.
    - **orderTypes.ts**: Definisi tipe untuk pesanan dan status.
  - **utils/**: Utilitas dan fungsi helper.
    - **categoryUtils.ts**: Fungsi utility untuk kategori menu.

## Arsitektur Aplikasi

Aplikasi ini diimplementasikan menggunakan Layered Architecture:

1. **Presentation Layer**: Komponen React di folder `components/` dan `pages/`.
2. **Business Logic Layer**: Service dan custom hooks di folder `services/` dan `hooks/`.
3. **Data Access Layer**: Integrasi dengan Firebase Firestore yang diimplementasikan di service.

Arsitektur ini memungkinkan pemisahan kepentingan (separation of concerns), memudahkan pengujian, dan meningkatkan pemeliharaan kode.

## Fitur Keamanan

Aplikasi ini mengimplementasikan beberapa fitur keamanan:

- **Autentikasi Firebase**: Menggunakan sistem autentikasi yang aman dari Firebase.
- **Rute Terproteksi**: Menggunakan PrivateRoute untuk mencegah akses tidak sah ke halaman admin.
- **Verifikasi Peran**: Memeriksa apakah pengguna memiliki peran admin sebelum memberikan akses.
- **Validasi Input**: Validasi input untuk mencegah data tidak valid disimpan ke database.

## Pengembangan Masa Depan

Beberapa fitur yang direncanakan untuk pengembangan masa depan:

1. **Manajemen Inventaris**: Sistem untuk melacak stok bahan baku.
2. **Analitik Bisnis**: Dashboard analitik yang lebih canggih dengan visualisasi data.
3. **Integrasi Pembayaran**: Dukungan untuk berbagai metode pembayaran online.
4. **Sistem Notifikasi**: Notifikasi real-time untuk admin dan pelanggan.
5. **Aplikasi Mobile**: Versi mobile dari admin panel untuk manajemen on-the-go.

## Setup Firebase

Untuk konfigurasi Firebase:

1. Salin file `src/firebase/firebase.example.ts` menjadi `src/firebase/firebase.ts`
2. Ganti placeholder dengan konfigurasi Firebase Anda sendiri
3. Lihat `FIREBASE_SETUP.md` untuk instruksi lebih detail
- **Manajemen Menu**: Tambah, lihat, ubah, dan hapus menu. Setiap menu memiliki informasi nama, harga, deskripsi, kategori, dan status ketersediaan.
- **Manajemen Pesanan**: Pemantauan pesanan secara real-time dengan kemampuan untuk mengubah status pesanan (pending, processing, ready, completed, cancelled).
- **Antarmuka Responsif**: Desain yang responsif menggunakan Tailwind CSS untuk pengalaman pengguna yang optimal.

## Teknologi yang Digunakan

- **Framework Frontend**: React dengan TypeScript
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Development & Build**: Create React App

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
