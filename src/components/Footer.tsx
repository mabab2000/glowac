import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About Us Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">About Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Historical Background
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Mission Vision Values
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Our Laboratory
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Why Choosing Us!
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Geotechnical Tests
                </a>
              </li>
              <li>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Other Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Contacts</h3>
            <div className="space-y-3">
              <p className="text-teal-200">
                Rwanda - Kigali City 24 KG 607 St
              </p>
              <p className="text-teal-200">
                Phone: +250 787 100 805
              </p>
              <p className="text-teal-200">
                Email: info@lumenltd.rw
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-teal-600 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <p className="text-white text-lg font-medium">
                Copyright © 2025 - LUMEN LTD - All Right Reserved
              </p>
            </div>

            {/* Right Side - Terms, Privacy, Contact Button and Certification */}
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
              
              {/* Terms & Privacy */}
              <div className="flex space-x-6">
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Terms & Conditions
                </a>
                <a href="#" className="text-teal-200 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </a>
              </div>

              {/* Contact Us Button */}
              <button className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-full transition-colors duration-300 font-medium">
                Contact Us
              </button>

              {/* ISO Certification Badge */}
              <div className="bg-white text-teal-800 px-4 py-2 rounded-lg text-center">
                <div className="text-xs font-bold">CERTIFIED</div>
                <div className="text-sm font-bold">ISO 9001:2015</div>
                <div className="text-xs">CERTIFICATE</div>
                <div className="text-xs">DESIGNATION</div>
                <div className="text-lg font-bold">036</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/250787100805" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.905 3.488"/>
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;