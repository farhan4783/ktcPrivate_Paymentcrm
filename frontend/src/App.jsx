import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#fff',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px',
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;
