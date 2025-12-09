import React from 'react';
import logo from './logo.svg';
import Header from './components/Header';
import Banner from './components/Banner';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import ScrollProgressCircle from './components/ScrollProgressCircle';

function App() {
  return (
    <>
      <Header />
      <Banner />
      <AboutUs />
      <ScrollProgressCircle />
      <Footer />
    </>
  );
}

export default App;
