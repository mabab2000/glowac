import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ScrollProgressCircle from './components/ScrollProgressCircle';
import AboutPage from './pages/AboutPage';
import AboutPreview from './components/AboutPreview';
import AboutUs from './components/AboutUs';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-700">The page you requested does not exist. Try the navigation links.</p>
    </main>
  );
}

function Home() {
  return (
    <>
      <Banner />
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
            <span className="block text-black">Building Strong</span>
            <span className="block text-emerald-600">Relationships</span>
          </h1>
        </div>
      </div>
      <AboutUs />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services/*" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollProgressCircle />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
