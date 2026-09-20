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
  useScrollToTop();
  return (
    <div className="min-h-screen bg-emerald-50/40 lg:pl-72">
      <UpdateHeader />
      <main className="min-h-screen px-4 pb-12 pt-20 sm:px-6 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UpdatePage;
