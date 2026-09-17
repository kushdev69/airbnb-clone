import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FlashProvider } from './context/FlashContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FlashMessages from './components/FlashMessages';
import Listings from './pages/Listings';
import ShowListing from './pages/ShowListing';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';
import './index.css';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/users/login" state={{ from: location }} replace />;
}

function App() {
  return (
    <AuthProvider>
      <FlashProvider>
        <Router>
          <div className="app">
            <Navbar />
            <FlashMessages />
            <div className="container">
              <Routes>
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/new" element={<PrivateRoute><NewListing /></PrivateRoute>} />
                <Route path="/listings/:id" element={<ShowListing />} />
                <Route path="/listings/:id/book" element={<PrivateRoute><Booking /></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/listings/:id/edit" element={<PrivateRoute><EditListing /></PrivateRoute>} />
                <Route path="/users/login" element={<Login />} />
                <Route path="/users/signup" element={<Signup />} />
                <Route path="/" element={<Navigate to="/listings" replace />} />
                <Route path="*" element={<Navigate to="/listings" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </FlashProvider>
    </AuthProvider>
  );
}

export default App;
