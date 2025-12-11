import React from 'react';
import { Outlet } from 'react-router-dom';
import UpdateHeader from '../components/UpdateHeader';

const UpdatePage: React.FC = () => {
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
