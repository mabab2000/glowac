import React from 'react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Trust and Company Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                <span className="text-teal-600">We are trusted by</span>
                <br />
                <span className="text-black">more than </span>
                <span className="text-black font-black">+43K</span>
                <br />
                <span className="text-teal-600">clients</span>
                <span className="text-black"> in the</span>
                <br />
                <span className="text-teal-600">region</span>
              </h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              GLOWAC is a Geotechnical Engineering firm and 
              performs Architectural and Engineering activities and related 
              technical consultancy services to coordinates specialist 
              trades for industrial/commercial projects.
            </p>
            
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-300 text-lg">
              Learn More About
              <br />
              GLOWAC
            </button>
          </div>
          
          {/* Right side - Experience and Certifications */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-teal-100 space-y-8">
            {/* Experience Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-teal-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 className="text-4xl font-bold text-teal-600">
                We have
              </h3>
              <div className="text-6xl font-black text-teal-600">
                +10 <span className="text-3xl font-bold">years experience</span>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Offering solutions to Geotechnical challenges that are 
                tested for a sustainable future.
              </p>
            </div>
            
            {/* Certifications Section */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-800 text-center">
                GLOWAC is certified:
              </h4>
              
              {/* Certification Badges */}
              <div className="grid grid-cols-2 gap-4">
                {/* ISO 9001:2015 */}
                <a 
                  href="https://cpanel.glowac.rw/cpsess6046876353/frontend/jupiter/filemanager/showfile.html?file=rsb-certificate.pdf&fileop=&dir=%2Fhome%2Fglowac%2Fpublic_html%2Fcertificates&dirop=&charset=&file_charset=&baseurl=&basedir="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 text-center hover:bg-teal-100 hover:border-teal-300 transition-colors duration-300 cursor-pointer">
                    <div className="text-teal-600 font-bold text-lg">ISO/IEC 17025:2017</div>
                    <div className="w-12 h-12 bg-orange-400 rounded-full mx-auto mt-2 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">HYM</span>
                    </div>
                  </div>
                </a>
                
                {/* Certificate of Designation - RSB */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <img 
                      src="/images/rsb-icon.png" 
                      alt="Rwanda Standards Board" 
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div className="text-teal-600 font-bold">Certificate of Designation</div>
                  <div className="text-gray-600 font-semibold mt-1">RSB</div>
                  <div className="text-xs text-gray-500 mt-1">Rwanda Standards Board</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;