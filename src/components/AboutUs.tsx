import React from 'react';

const AboutUs: React.FC = () => {
  const workingHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'open' },
    { day: 'Sunday', hours: 'Closed', status: 'closed' },
  ];

  return (
    <section id="about" className="pt-10 pb-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full lg:max-w-[calc(56rem+6%)] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs mt-0 font-semibold uppercase bg-teal-100 text-teal-700 px-3 py-1 rounded-full mb-4">
           About Glowac
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Building Strong
            <span className="block text-teal-600">Relationships</span>
          </h2>
          <div className="w-24 h-1 bg-teal-500 mx-auto"></div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Company description */}
          <div className="space-y-6">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Commitment to Excellence
            </h3>
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed text-justify">
              Glowac is committed to building strong relationships with clients by providing exceptional customer service, the highest quality legally defensible data.
            </p>
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed text-justify">
              Besides training, experience and knowledge of the GLOWAC team members, their values are merged to reflect the following criteria for business success.
            </p>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Learn More About Us
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Working Hours Timeline */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Working Hours</h3>
            <div className="space-y-4">
              {workingHours.map((schedule, index) => (
                <div 
                  key={schedule.day}
                  className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 hover:transform hover:scale-105 ${
                    schedule.status === 'open' 
                      ? 'bg-teal-50 border-l-4 border-teal-500 hover:bg-teal-100' 
                      : 'bg-gray-50 border-l-4 border-gray-400 hover:bg-gray-100'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      schedule.status === 'open' ? 'bg-teal-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-semibold text-gray-900">{schedule.day}</span>
                  </div>
                  <span className={`font-medium ${
                    schedule.status === 'open' ? 'text-teal-600' : 'text-gray-500'
                  }`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Current Status */}
            <div className="mt-6 p-4 bg-teal-500 text-white rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-semibold">Currently Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Facts & Figures</h3>
            <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                43
              </div>
              <p className="text-lg font-semibold text-gray-700">Clients</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                143
              </div>
              <p className="text-lg font-semibold text-gray-700">Projects Completed</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                52
              </div>
              <p className="text-lg font-semibold text-gray-700">Team Members</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                200+
              </div>
              <p className="text-lg font-semibold text-gray-700">Tests We Conduct</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us section */}
        <div className="mt-12 mb-8 text-center">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h3>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
          <p className="max-w-4xl mx-auto text-gray-700 text-xl sm:text-2xl leading-relaxed text-justify">
            We combine deep technical expertise with a commitment to client success — delivering reliable, timely, and cost-effective geotechnical solutions tailored to your project's needs.
          </p>
        </div>

        {/* Additional Stats section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            {/* Stat 1 */}
            <div className="group flex-1">
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <p className="text-gray-700 font-medium">Client Satisfaction</p>
            </div>

            {/* Separator (md+) - taller vertical line with horizontal padding, black color */}
            <div className="hidden md:flex items-center px-6">
              <div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div>
            </div>

            {/* Stat 2 */}
            <div className="group flex-1">
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <p className="text-gray-700 font-medium">Customer Support</p>
            </div>

            {/* Separator (md+) */}
            <div className="hidden md:flex items-center px-6">
              <div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div>
            </div>

            {/* Stat 3 */}
            <div className="group flex-1">
              <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <p className="text-gray-700 font-medium">Commitment to Quality</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;