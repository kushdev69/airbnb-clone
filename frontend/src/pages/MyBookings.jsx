import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getBookings().then(({ data }) => setBookings(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5">Loading bookings...</div>;

  return (
    <main className="bookings-page py-5">
      <h1 className="mb-4">My bookings</h1>
      {!bookings.length ? (
        <p className="text-muted">You have no bookings yet.</p>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div className="col-12 col-md-6" key={booking._id}>
              <article className="booking-card">
                {booking.listing?.image?.url && <img src={booking.listing.image.url} alt={booking.listing.title} />}
                <div className="booking-card-body">
                  <h2>{booking.listing?.title || 'Listing unavailable'}</h2>
                  <p className="text-muted mb-2">{booking.listing?.location}, {booking.listing?.country}</p>
                  <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString('en-IN')}</p>
                  <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString('en-IN')}</p>
                  <p className="mb-3"><strong>Reference:</strong> {booking.reference}</p>
                  {booking.listing?._id && <Link to={`/listings/${booking.listing._id}`}>View listing</Link>}
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyBookings;