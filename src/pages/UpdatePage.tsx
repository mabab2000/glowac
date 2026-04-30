import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import UpdateHeader from '../components/UpdateHeader';

// Scroll to top when page loads
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
};

const UpdatePage: React.FC = () => {
  useScrollToTop(); // Scroll to top when page loads
  return (
    <main className="pt-20 pb-12">
      <UpdateHeader />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default UpdatePage;
