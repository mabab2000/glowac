import React from 'react';
import AboutPreview from '../components/AboutPreview';

const AboutPage: React.FC = () => {
  return (
    <main className="pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4">About Us</h1>
        <div className="w-20 h-1 bg-emerald-600 mb-8" />
        {/* Show a compact preview (heading hidden) */}
        <AboutPreview ctaTo="/" ctaLabel="Back to Home" showHeading={false} />
      </div>
    </main>
  );
};

export default AboutPage;
