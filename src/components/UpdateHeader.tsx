import React from 'react';
import { Link } from 'react-router-dom';

const UpdateHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="homeupdate" className="text-sm font-medium text-gray-700 hover:text-emerald-700">HomeUpdate</Link>
            <Link to="aboutupdate" className="text-sm font-medium text-gray-700 hover:text-emerald-700">AboutUpdate</Link>
            <Link to="serviceupdate" className="text-sm font-medium text-gray-700 hover:text-emerald-700">ServiceUpdate</Link>
          </div>
          <div className="text-sm text-gray-500">Update Mode</div>
        </div>
      </div>
    </nav>
  );
};

export default UpdateHeader;
