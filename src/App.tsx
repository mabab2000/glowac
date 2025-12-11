import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import ScrollProgressCircle from './components/ScrollProgressCircle';
import AboutPage from './pages/AboutPage';
import AboutPreview from './components/AboutPreview';
import AboutUs from './components/AboutUs';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import UpdatePage from './pages/UpdatePage';
import HomeUpdate from './pages/update/HomeUpdate';
import AboutUpdate from './pages/update/AboutUpdate';
import ServiceUpdate from './pages/update/ServiceUpdate';
import { useEffect, useState } from 'react';

function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-700">The page you requested does not exist. Try the navigation links.</p>
    </main>
  );
}

function Home() {
  const [main, setMain] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  useEffect(() => {
    const m = localStorage.getItem('home.heroMain');
    const s = localStorage.getItem('home.heroSub');
    setMain(m);
    setSub(s);
  }, []);

  return (
    <>
      <Banner />
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
            <span className="block text-black">{main || 'Building Strong'}</span>
            <span className="block text-emerald-600">{sub || 'Relationships'}</span>
          </h1>
        </div>
      </div>
      <AboutUs />
    </>
  );
}

function RouterLayout() {
  const location = useLocation();
  const isUpdate = location.pathname.startsWith('/update');

  return (
    <>
      {!isUpdate && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services/*" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/update" element={<UpdatePage />}>
          <Route index element={<HomeUpdate />} />
          <Route path="homeupdate" element={<HomeUpdate />} />
          <Route path="aboutupdate" element={<AboutUpdate />} />
          <Route path="serviceupdate" element={<ServiceUpdate />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollProgressCircle />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouterLayout />
    </BrowserRouter>
  );
}

export default App;
