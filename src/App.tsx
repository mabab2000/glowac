import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Banner from './components/Banner';

function App() {
  return (
    <>
      <Header />
      <Banner />
      <main className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="text-center">
            <p className="mt-6 text-base text-gray-600">
              Edit <code className="bg-gray-100 px-2 py-1 rounded text-teal-600">src/App.tsx</code> and save to reload.
            </p>
            <a
              className="inline-block mt-4 text-teal-600 hover:text-teal-700 hover:underline font-medium"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
