import React from 'react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 relative">
        <div className="w-full lg:max-w-[calc(62rem)] mx-auto">
          {/* Trust and Company Info */}
          <div className="text-center mx-4 sm:mx-0 mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gray-600">Building Strong </span>
              <span className="text-emerald-600">Relationships</span>
            </h2>
            
            {/* <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-8">
              <span className="text-teal-600">We are trusted by</span>
              <br />
              <span className="text-black">more than </span>
              <span className="text-black font-black">+43K</span>
              <br />
              <span className="text-teal-600">clients</span>
              <span className="text-black"> in the</span>
              <br />
              <span className="text-teal-600">region</span>
            </h2> */}
            
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              GLOWAC is a Geotechnical Engineering firm and 
              performs Architectural and Engineering activities and related 
              technical consultancy services to coordinates specialist 
              trades for industrial/commercial projects.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;