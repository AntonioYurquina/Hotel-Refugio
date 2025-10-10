import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({ user, logout, children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar user={user} logout={logout} />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
