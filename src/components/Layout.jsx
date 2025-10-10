import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ gpt5Enabled, children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar gpt5Enabled={gpt5Enabled} />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
