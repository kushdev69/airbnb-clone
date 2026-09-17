import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { useFlash } from '../context/FlashContext';

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFlash } = useFlash();
  const [listing, setListing] = useState(null);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [available, setAvailable] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    listingAPI.getById(id).then(({ data }) => setListing(data)).catch(() => navigate('/listings'));
  }, [id, navigate]);

  const checkDates = async (nextDates) => {
    setDates(nextDates);
    setAvailable(null);
    if (!nextDates.checkIn || !nextDates.checkOut) return;
    try {
      const { data } = await listingAPI.checkAvailability(id, nextDates);
      setAvailable(data.available);
    } catch (err) {
      setAvailable(false);
      addFlash('error', err.response?.data?.message || 'Could not check availability');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (available !== true) return addFlash('error', 'Choose available dates first');
    try {
      setSubmitting(true);
      const { data } = await listingAPI.book(id, dates);
      setConfirmation(data);
    } catch (err) {
      setAvailable(false);
      addFlash('error', err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!listing) return <div className="text-center py-5">Loading...</div>;

  return (
    <main className="booking-page py-5" aria-label="Booking">
      <Link to={`/listings/${id}`} className="text-decoration-none">&larr; Back to listing</Link>
      <div className="booking-panel mt-4">
        <h1>Book your stay</h1>
        <p className="text-muted mb-4">{listing.title}</p>
        <form onSubmit={submit}>
          <div className="row g-3">
            {['checkIn', 'checkOut'].map((field) => (
              <div className="col-12 col-sm-6" key={field}>
                <label className="form-label">{field === 'checkIn' ? 'Check-in' : 'Check-out'}</label>
                <input
                  className="form-control"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={dates[field]}
                  onChange={(event) => checkDates({ ...dates, [field]: event.target.value })}
                  required
                />
              </div>
            ))}
          </div>
          <div className={`availability mt-3 ${available === true ? 'available' : ''}`}>
            {available === true ? 'Available for these dates' : available === false ? 'Not available for these dates' : 'Select dates to check availability'}
          </div>
          <fieldset className="mt-4">
            <legend className="fs-6">Payment method</legend>
            <label className="form-check">
              <input className="form-check-input" type="radio" checked readOnly />
              <span className="form-check-label">Cash on Delivery</span>
            </label>
            <p className="small text-muted mb-0">Card and online payments are coming soon.</p>
          </fieldset>
          <button className="btn btn-danger w-100 mt-4" disabled={submitting || available !== true}>
            {submitting ? 'Confirming...' : 'Confirm booking'}
          </button>
        </form>
      </div>
      {confirmation && (
        <div className="booking-modal-backdrop" role="presentation">
          <section className="booking-confirmation" role="dialog" aria-modal="true" aria-labelledby="booking-confirmed">
            <p className="text-success mb-2">Booking confirmed</p>
            <h2 id="booking-confirmed">Your stay is reserved</h2>
            <p className="text-muted">Keep this reference number for your records.</p>
            <div className="booking-reference">{confirmation.reference}</div>
            <dl className="booking-summary">
              <div><dt>Listing</dt><dd>{listing.title}</dd></div>
              <div><dt>Dates</dt><dd>{dates.checkIn} to {dates.checkOut}</dd></div>
              <div><dt>Payment</dt><dd>Cash on Delivery</dd></div>
            </dl>
            <button className="btn btn-danger w-100" onClick={() => navigate(`/listings/${id}`)}>
              Back to listing
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Booking;