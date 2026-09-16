import { Fragment, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

function ShowListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addFlash } = useFlash();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewForm, setReviewForm] = useState({ comment: '', rating: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getById(id);
      setListing(response.data);
    } catch {
      setError('Listing not found');
      addFlash('error', 'Listing not found');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim() || !reviewForm.rating) {
      addFlash('error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewAPI.create(id, { comment: reviewForm.comment, rating: parseInt(reviewForm.rating) });
      addFlash('success', 'Review added successfully');
      setReviewForm({ comment: '', rating: '' });
      fetchListing(); // Refresh to show new review
    } catch {
      addFlash('error', err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewAPI.delete(id, reviewId);
      addFlash('success', 'Review deleted');
      fetchListing();
    } catch {
      addFlash('error', 'Failed to delete review');
    }
  };

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await listingAPI.delete(id);
      addFlash('success', 'Listing deleted');
      navigate('/listings');
    } catch {
      addFlash('error', 'Failed to delete listing');
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

  if (error || !listing) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Listing not found</p>
        <Link to="/listings" className="btn btn-primary">Back to Listings</Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && listing.owner?._id === user._id;
  const canDeleteReview = (review) => isAuthenticated && user && review.author?._id === user._id;

  return (
    <div className="showlisting-container container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card individual-card shadow-sm h-100">
            <img 
              src={listing.image?.url} 
              className="card-img-top individual-img-top" 
              alt={listing.title}
            />
            <div className="card-body d-flex flex-column">
              <div className="title-price d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                <h5 className="card-title title mb-0">{listing.title}</h5>
                <h6 className="card-subtitle mb-0 text-body-secondary pricee">
                  &#8377; {listing.price?.toLocaleString?.("en-IN") || listing.price}
                </h6>
              </div>
              <p className="card-text description flex-grow-1">{listing.description}</p>
              <p className="card-text">
                <i>Owned by :</i> {listing.owner?.username}
              </p>
              <div className="details d-flex flex-wrap gap-2 mt-auto">
                <a href="#" className="card-link location">
                  <i className="fa-solid fa-location-dot me-1"></i>
                  {listing.location}
                </a>
                <a href="#" className="card-link country">
                  <i className="fa-solid fa-flag me-1"></i>
                  {listing.country}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="col-12 col-lg-5">
          <div className="review-section d-flex flex-column gap-4">
            {isAuthenticated && (
              <div className="create-review card shadow-sm">
                <div className="card-body">
                  <h3 className="mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="needs-validation" noValidate>
                    <div className="mb-3">
                      <label htmlFor="review" className="form-label">Review</label>
                      <textarea
                        className="form-control"
                        id="review"
                        name="review[comment]"
                        rows="3"
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      />
                      <div className="invalid-feedback">Please write a valid review.</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rating" className="form-label">Add Rating</label>
                      <fieldset className="starability-coinFlip">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Fragment key={star}>
                            <input
                              type="radio"
                              id={`first-rate${star}`}
                              name="review[rating]"
                              value={star}
                              className="form-control"
                              checked={reviewForm.rating === star.toString()}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, rating: e.target.value }))}
                              required
                            />
                            <label htmlFor={`first-rate${star}`} title={['very bad', 'Not good', 'Average', 'Very good', 'Amazing'][star - 1]}>
                              {star} star{star > 1 ? 's' : ''}
                            </label>
                          </Fragment>
                        ))}
                      </fieldset>
                      <div className="invalid-feedback">Please select a rating.</div>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-danger w-100"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="reviews-list card shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">All Reviews</h4>
                {listing.reviews && listing.reviews.length > 0 ? (
                  listing.reviews.map((review) => (
                    <div key={review._id} className="review-card card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center flex-wrap gap-2">
                            <p className="card-text mb-0">
                              <i><b>@{review.author?.username}</b></i>
                            </p>
                            <p className="starability-result starability-result-sm mb-0" data-rating={review.rating}>
                              Rated: {review.rating}
                            </p>
                          </div>
                          <span className="badge bg-danger">
                            {new Date(review.createdAt).toLocaleString("en-IN").slice(0, 9)}
                          </span>
                        </div>
                        <p className="card-text text-muted">{review.comment}</p>
                        {canDeleteReview(review) && (
                          <form onSubmit={(e) => { e.preventDefault(); handleDeleteReview(review._id); }} className="d-inline">
                            <button type="submit" className="btn btn-danger btn-sm">Delete</button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls d-flex flex-wrap gap-2 mt-4">
        <Link to="/listings" className="btn btn-primary">Back to Home</Link>
        {isOwner && (
          <>
            <Link to={`/listings/${id}/edit`} className="btn btn-warning">Edit Listing</Link>
            <button onClick={handleDeleteListing} className="btn btn-danger">Delete Listing</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowListing;