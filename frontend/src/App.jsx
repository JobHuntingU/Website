
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import CareersPage from './pages/CareersPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { AdminProvider } from './context/AdminContext.jsx';

function App() {
  return (
    <AdminProvider>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/careers/:id" element={<JobDetailPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* Catch-all route for unknown paths */}
            <Route 
              path="*" 
              element={
                <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
                  <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
                  <p className="mb-8 text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
                </div>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </AdminProvider>
  );
}

export default App;
