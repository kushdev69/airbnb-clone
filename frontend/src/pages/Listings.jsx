import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../services/api';
import ListingCard from '../components/ListingCard';
import { useFlash } from '../context/FlashContext';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFlash } = useFlash();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getAll();
      setListings(response.data);
    } catch {
      setError('Failed to load listings');
      addFlash('error', 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Failed to load listings</p>
        <button className="btn btn-primary" onClick={fetchListings}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center mb-4">All Listings</h1>
      <div className="listing-box row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
        {listings.length === 0 && (
          <div className="col-12 text-center">
            <p className="text-muted">No listings found. <Link to="/listings/new" className="text-danger">Create one!</Link></p>
          </div>
        )}
      </div>
    </>
  );
}

export default Listings;