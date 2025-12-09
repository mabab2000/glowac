import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  ctaTo?: string;
  ctaLabel?: string;
  showHeading?: boolean;
};

const AboutPreview: React.FC<Props> = ({ ctaTo = '/about', ctaLabel = 'Learn More', showHeading = true }) => {
  return (
    <section className="relative py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border-2 border-teal-100">
            <div className="text-center">
              {showHeading && (
                <>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Building Strong</h2>
                  <span className="block text-2xl font-bold text-emerald-600 mb-4">Relationships</span>
                </>
              )}
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">GLOWAC builds strong relationships with clients by providing exceptional service and high-quality, defensible geotechnical data.</p>
              <div className="flex justify-center">
                <Link to={ctaTo} className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-md shadow hover:bg-emerald-700 transition">
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
