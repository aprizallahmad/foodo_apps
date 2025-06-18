import './App.css'

import { useState, useEffect, useRef } from 'react'

import {
  Menu, X, ArrowRight, Star, Award, Heart, Package, PhoneCall, ShoppingBag, MapPin, Mail, Instagram, Twitter, Facebook, ShoppingCart, Sun, Moon
} from 'lucide-react';

// Variabel global untuk Firebase (jika diperlukan di masa mendatang)
// Pastikan variabel ini didefinisikan di lingkungan Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Data produk statis - placeholder untuk demonstrasi
const products = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan bumbu khas, telur, ayam, dan kerupuk.',
    price: 35000,
    // Dynamic placeholder image based on theme
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Nasi+Goreng`
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    description: 'Mie ayam dengan toping ayam cincang, pangsit, dan bakso kenyal.',
    price: 30000,
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Mie+Ayam`
  },
  {
    id: '3',
    name: 'Sate Ayam Madura',
    description: '10 tusuk sate ayam dengan bumbu kacang khas Madura.',
    price: 40000,
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Sate+Ayam`
  },
  {
    id: '4',
    name: 'Ayam Geprek Mozzarella',
    description: 'Ayam goreng renyah dengan sambal pedas dan lelehan keju mozzarella.',
    price: 45000,
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Ayam+Geprek`
  },
  {
    id: '5',
    name: 'Es Teh Manis Jumbo',
    description: 'Minuman es teh segar ukuran jumbo.',
    price: 10000,
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Es+Teh`
  },
  {
    id: '6',
    name: 'Martabak Manis Cokelat Keju',
    description: 'Martabak manis dengan topping cokelat, keju, dan susu kental manis.',
    price: 55000,
    image: (theme) => `https://placehold.co/400x250/${theme === 'dark' ? '222222' : 'F0F0F0'}/F70670?text=Martabak`
  },
];

// Komponen utama aplikasi
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mengontrol buka/tutup menu mobile
  const [cartItems, setCartItems] = useState([]); // State untuk item di keranjang
  const [isCartOpen, setIsCartOpen] = useState(false); // State untuk mengontrol buka/tutup keranjang
  const [theme, setTheme] = useState('dark'); // State untuk tema: 'dark' atau 'light'

  // Fungsi untuk beralih status menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi untuk beralih status keranjang
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Fungsi untuk beralih tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Efek samping untuk menangani otentikasi Firebase (boilerplate)
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Asumsi firebase/app dan firebase/auth sudah diimpor
        // Contoh inisialisasi (perlu diadaptasi jika menggunakan SDK penuh)
        // if (Object.keys(firebaseConfig).length > 0) {
        //   const app = initializeApp(firebaseConfig);
        //   const auth = getAuth(app);
        //   if (initialAuthToken) {
        //     await signInWithCustomToken(auth, initialAuthToken);
        //     console.log('Signed in with custom token');
        //   } else {
        //     await signInAnonymously(auth);
        //     console.log('Signed in anonymously');
        //   }
        // }
      } catch (error) {
        console.error("Error initializing Firebase or signing in:", error);
      }
    };
    initializeFirebase();
  }, []); // Hanya berjalan sekali saat komponen dimuat

  // Fungsi untuk menambahkan produk ke keranjang
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Fungsi untuk mengurangi kuantitas atau menghapus produk dari keranjang
  const updateCartQuantity = (productId, change) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean); // Hapus item jika quantity 0 atau kurang
    });
  };

  // Fungsi untuk menghapus item dari keranjang
  const removeItemFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Fungsi untuk menghitung total item di keranjang (untuk ikon keranjang)
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Fungsi untuk scroll ke bagian produk
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Tutup menu mobile setelah klik
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-inter antialiased ${isDark ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDark ? 'bg-black shadow-lg' : 'bg-white shadow-sm'}`}>
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-[#F70670] w-8 h-8 rounded-md" /> {/* Consistent pink accent */}
            <span className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Foodo</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Home</a>
            <a href="#products" onClick={scrollToProducts} className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Produk</a>
            <a href="#how-it-works" className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Bagaimana Cara Kerjanya?</a>
            <a href="#features" className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Fitur</a>
            <a href="#reviews" className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Testimoni</a>
            <a href="#contact" className={`font-medium transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Kontak</a>
            <button className="px-5 py-2 bg-[#F70670] text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md">
              Daftar
            </button>
            <button className={`px-5 py-2 font-semibold rounded-full transition-colors duration-200 ${isDark ? 'border border-gray-700 text-gray-100 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
              Masuk
            </button>
            {/* Ikon Keranjang */}
            <button onClick={toggleCart} className={`relative transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>
              <ShoppingCart className="w-7 h-7" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </button>
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className={`transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
          </div>

          {/* Tombol Menu Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Ikon Keranjang Mobile */}
            <button onClick={toggleCart} className={`relative ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>
              <ShoppingCart className="w-7 h-7" />
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </button>
            {/* Theme Toggle Button Mobile */}
            <button onClick={toggleTheme} className={`transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
              {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>
            <button onClick={toggleMenu} className={`${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </nav>

        {/* Menu Mobile (Slide-in) */}
        {isMenuOpen && (
          <div className={`md:hidden ${isDark ? 'bg-black shadow-lg' : 'bg-white shadow-lg'} py-4 transition-all duration-300 ease-in-out`}>
            <div className="flex flex-col items-center space-y-4">
              <a href="#home" onClick={toggleMenu} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Home</a>
              <a href="#products" onClick={scrollToProducts} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Produk</a>
              <a href="#how-it-works" onClick={toggleMenu} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Bagaimana Cara Kerjanya?</a>
              <a href="#features" onClick={toggleMenu} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Fitur</a>
              <a href="#reviews" onClick={toggleMenu} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Testimoni</a>
              <a href="#contact" onClick={toggleMenu} className={`font-medium ${isDark ? 'text-gray-300 hover:text-[#F70670]' : 'text-gray-700 hover:text-[#F70670]'}`}>Kontak</a>
              <button className="w-3/4 px-5 py-2 bg-[#F70670] text-white font-semibold rounded-full hover:bg-opacity-90 shadow-md">
                Daftar
              </button>
              <button className={`w-3/4 px-5 py-2 font-semibold rounded-full ${isDark ? 'border border-gray-700 text-gray-100 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                Masuk
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20"> {/* Padding top untuk menghindari navbar */}
        {/* Hero Section */}
        <section id="home" className={`relative py-16 md:py-24 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-pink-50 to-rose-100'}`}>
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
            {/* Konten Teks Hero */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className={`text-4xl md:text-6xl font-extrabold leading-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Pesan <span className="text-[#F70670]">Makanan Favorit</span> Anda dengan Cepat & Mudah
              </h1>
              <p className={`text-lg md:text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Jelajahi ribuan restoran, pesan hanya dalam beberapa ketukan, dan nikmati makanan lezat di depan pintu Anda.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <button
                  onClick={scrollToProducts}
                  className="px-7 py-3 bg-[#F70670] text-white font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg flex items-center"
                >
                  Pesan Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button className={`px-7 py-3 font-bold rounded-full transition-transform transform hover:scale-105 shadow-md ${isDark ? 'border border-gray-700 text-gray-100 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-white'}`}>
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>

            {/* Gambar Hero */}
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <img
                src={products[0].image(theme)} // Dynamic image based on theme
                alt="Berbagai hidangan lezat"
                className="w-full max-w-md md:max-w-xl rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/${isDark ? '1a1a1a' : 'F0F0F0'}/F70670?text=Gambar+Makanan`; }}
              />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className={`py-16 md:py-24 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Menu Favorit Kami</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                  <img
                    src={product.image(theme)} // Dynamic image based on theme
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/${isDark ? '222222' : 'F0F0F0'}/F70670?text=${product.name.replace(/\s/g, '+')}`; }}
                  />
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-[#F70670]">Rp{product.price.toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-[#F70670] text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md flex items-center space-x-1"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Pesan</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fitur Section */}
        <section id="features" className={`py-16 md:py-24 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mengapa Memilih Foodo?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fitur 1 */}
              <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-[#2a002a] text-[#F70670]' : 'bg-pink-100 text-[#F70670]'}`}>
                  <Award className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pilihan Restoran Terluas</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Jelajahi ribuan restoran lokal dan internasional di dekat Anda.
                </p>
              </div>
              {/* Fitur 2 */}
              <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-[#2a002a] text-[#F70670]' : 'bg-pink-100 text-[#F70670]'}`}>
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pesan dengan Mudah</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Antarmuka yang ramah pengguna membuat pemesanan semudah satu, dua, tiga.
                </p>
              </div>
              {/* Fitur 3 */}
              <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                <div className={`rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-[#2a002a] text-[#F70670]' : 'bg-pink-100 text-[#F70670]'}`}>
                  <Package className="w-8 h-8" />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pengiriman Cepat & Aman</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Dapatkan makanan Anda diantar dengan cepat dan segar langsung ke pintu Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bagaimana Cara Kerjanya Section */}
        <section id="how-it-works" className={`py-16 md:py-24 ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 to-rose-50'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Bagaimana Foodo Bekerja?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              {/* Langkah 1 */}
              <div className={`flex flex-col items-center p-6 rounded-xl shadow-md border transform hover:-translate-y-2 transition-transform duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="bg-[#F70670] text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pilih Restoran</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Temukan restoran favorit Anda atau jelajahi yang baru di sekitar Anda.
                </p>
              </div>
              {/* Langkah 2 */}
              <div className={`flex flex-col items-center p-6 rounded-xl shadow-md border transform hover:-translate-y-2 transition-transform duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="bg-[#F70670] text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pesan Makanan</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pilih hidangan yang Anda inginkan dari menu dan tambahkan ke keranjang.
                </p>
              </div>
              {/* Langkah 3 */}
              <div className={`flex flex-col items-center p-6 rounded-xl shadow-md border transform hover:-translate-y-2 transition-transform duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="bg-[#F70670] text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Nikmati Makanan Anda</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Duduk santai dan makanan Anda akan segera tiba di depan pintu Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimoni Section */}
        <section id="reviews" className={`py-16 md:py-24 ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>Apa Kata Pelanggan Kami?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimoni 1 */}
              <div className={`p-6 rounded-xl shadow-md border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <img
                  src={isDark ? 'https://placehold.co/80x80/222222/F70670?text=AW' : 'https://hold.co/80x80/F0F0F0/F70670?text=AW'}
                  alt="Avatar pelanggan"
                  className={`w-20 h-20 rounded-full mb-4 ring-2 ring-[#F70670] ring-offset-2 ${isDark ? 'ring-offset-gray-900' : 'ring-offset-gray-50'}`}
                />
                <p className={`italic mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  "Foodo telah mengubah cara saya memesan makanan. Sangat cepat dan pilihan makanannya luar biasa!"
                </p>
                <div className="flex text-yellow-400 mb-2">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                </div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>- Anna W., Pelanggan Setia</p>
              </div>
              {/* Testimoni 2 */}
              <div className={`p-6 rounded-xl shadow-md border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <img
                  src={isDark ? 'https://placehold.co/80x80/222222/F70670?text=BP' : 'https://placehold.co/80x80/F0F0F0/F70670?text=BP'}
                  alt="Avatar pelanggan"
                  className={`w-20 h-20 rounded-full mb-4 ring-2 ring-[#F70670] ring-offset-2 ${isDark ? 'ring-offset-gray-900' : 'ring-offset-gray-50'}`}
                />
                <p className={`italic mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  "Pengiriman selalu tepat waktu dan makanannya selalu segar. Sangat direkomendasikan!"
                </p>
                <div className="flex text-yellow-400 mb-2">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5" />
                </div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>- Budi P., Pengguna Baru</p>
              </div>
              {/* Testimoni 3 */}
              <div className={`p-6 rounded-xl shadow-md border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                <img
                  src={isDark ? 'https://placehold.co/80x80/222222/F70670?text=CD' : 'https://placehold.co/80x80/F0F0F0/F70670?text=CD'}
                  alt="Avatar pelanggan"
                  className={`w-20 h-20 rounded-full mb-4 ring-2 ring-[#F70670] ring-offset-2 ${isDark ? 'ring-offset-gray-900' : 'ring-offset-gray-50'}`}
                />
                <p className={`italic mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  "Aplikasi ini sangat mudah digunakan dan layanan pelanggannya top!"
                </p>
                <div className="flex text-yellow-400 mb-2">
                  <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                </div>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>- Citra D., Pecinta Kuliner</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA (Call To Action) Download App Section */}
        <section className="py-16 md:py-24 bg-[#F70670] text-white"> {/* Consistent pink accent background */}
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Siap Memesan Makanan Favorit Anda?
              </h2>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Unduh aplikasi Foodo sekarang dan mulai jelajahi dunia kuliner!
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <button className={`px-6 py-3 font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg ${isDark ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white text-[#F70670] hover:bg-gray-100'}`}>
                  Unduh di App Store
                </button>
                <button className={`px-6 py-3 font-bold rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105 shadow-lg ${isDark ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white text-[#F70670] hover:bg-gray-100'}`}>
                  Dapatkan di Google Play
                </button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img
                src={isDark ? 'https://placehold.co/250x500/1a1a1a/F70670?text=Mobile+App' : 'https://placehold.co/250x500/F0F0F0/F70670?text=Mobile+App'}
                alt="Tampilan Aplikasi Mobile"
                className="w-48 h-96 object-contain rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/250x500/${isDark ? '1a1a1a' : 'F0F0F0'}/F70670?text=Aplikasi+Mobile`; }}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className={`${isDark ? 'bg-black text-gray-400' : 'bg-gray-900 text-gray-300'} py-12 md:py-16`}>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Kolom Logo & Deskripsi */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="text-[#F70670] w-8 h-8 rounded-md" />
              <span className="font-bold text-2xl text-white">Foodo</span>
            </div>
            <p className="text-gray-400">
              Pengiriman makanan cepat, segar, dan lezat langsung ke pintu Anda.
            </p>
          </div>

          {/* Kolom Tautan Cepat */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-[#F70670] transition-colors duration-200">Home</a></li>
              <li><a href="#products" onClick={scrollToProducts} className="hover:text-[#F70670] transition-colors duration-200">Produk</a></li>
              <li><a href="#features" className="hover:text-[#F70670] transition-colors duration-200">Fitur</a></li>
              <li><a href="#how-it-works" className="hover:text-[#F70670] transition-colors duration-200">Cara Kerja</a></li>
              <li><a href="#reviews" className="hover:text-[#F70670] transition-colors duration-200">Testimoni</a></li>
              <li><a href="#contact" className="hover:text-[#F70670] transition-colors duration-200">Kontak</a></li>
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-5 h-5 text-[#F70670]" />
                <span>+62 123 4567 890</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#F70670]" />
                <span>Jl. Contoh No. 123, Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#F70670]" />
                <span>info@foodo.com</span>
              </li>
            </ul>
          </div>

          {/* Kolom Ikuti Kami */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#F70670] transition-colors duration-200">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F70670] transition-colors duration-200">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F70670] transition-colors duration-200">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className={`border-t mt-8 pt-8 text-center text-sm ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-700 text-gray-500'}`}>
          &copy; {new Date().getFullYear()} Foodo. Hak Cipta Dilindungi.
        </div>
      </footer>

      {/* Cart Modal / Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
          <div className={`w-full md:w-96 h-full shadow-lg p-6 flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`flex justify-between items-center pb-4 mb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Keranjang Belanja</h3>
              <button onClick={toggleCart} className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-center mt-8`}>Keranjang Anda kosong.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className={`flex items-center space-x-4 py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <img
                      src={item.image(theme)} // Dynamic image based on theme
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/${isDark ? '222222' : 'F0F0F0'}/F70670?text=${item.name.replace(/\s/g, '+').substring(0,2)}`; }}
                    />
                    <div className="flex-grow">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className={`p-1 rounded-md ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        -
                      </button>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className={`p-1 rounded-md ${isDark ? 'border border-gray-700 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-red-500 hover:text-red-400 ml-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`flex justify-between items-center text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span>Total:</span>
                  <span>Rp{cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('id-ID')}</span>
                </div>
                <button className="w-full py-3 bg-[#F70670] text-white font-bold rounded-full hover:bg-opacity-90 shadow-lg">
                  Lanjutkan ke Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
