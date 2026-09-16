import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addFlash } = useFlash();
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null,
  });
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingAPI.getById(id);
      const listingData = response.data;
      setListing(listingData);
      setFormData({
        title: listingData.title || '',
        description: listingData.description || '',
        price: listingData.price || '',
        location: listingData.location || '',
        country: listingData.country || '',
        image: null,
      });
      setOriginalImageUrl(listingData.image?.url || '');
    } catch {
      addFlash('error', 'Failed to load listing');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Please enter Title';
    if (!formData.description.trim()) newErrors.description = 'Please enter Description';
    if (!formData.price) newErrors.price = 'Please enter Price';
    if (!formData.location.trim()) newErrors.location = 'Please enter Location';
    if (!formData.country.trim()) newErrors.country = 'Please enter Country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('country', formData.country);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await listingAPI.update(id, data);
      addFlash('success', 'Listing updated successfully!');
      navigate(`/listings/${id}`);
    } catch (err) {
      addFlash('error', err.response?.data?.message || 'Failed to update listing');
    } finally {
      setSubmitting(false);
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

  if (!listing) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Listing not found</p>
        <Link to="/listings" className="btn btn-primary">Back to Listings</Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && listing.owner?._id === user._id;

  if (!isOwner) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">You don't have permission to edit this listing</p>
        <Link to="/listings" className="btn btn-primary">Back to Listings</Link>
      </div>
    );
  }

  return (
    <div className="edit-wrapper">
      <h2 className="text-center mb-4">Edit Listing</h2>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate encType="multipart/form-data">
        <div className="row">
          <div className="col-8 offset-2">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Edit Title</label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''} ${formData.title ? 'is-valid' : ''}`}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.title || 'Write your new title here...'}</div>
              <div className="valid-feedback">New title added...</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Original Image</label>
              <br />
              <img src={originalImageUrl} alt="listing preview" height="100px" />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">Upload New Image</label>
              <input
                className={`form-control ${formData.image ? 'is-valid' : ''}`}
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
              />
              <div className="valid-feedback">New image added...</div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Edit Description</label>
              <input
                className={`form-control ${errors.description ? 'is-invalid' : ''} ${formData.description ? 'is-valid' : ''}`}
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.description || 'Add new description here...'}</div>
              <div className="valid-feedback">New description added...</div>
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">New Price</label>
              <input
                className={`form-control ${errors.price ? 'is-invalid' : ''} ${formData.price ? 'is-valid' : ''}`}
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.price || 'Add new price here...'}</div>
              <div className="valid-feedback">New price added...</div>
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">New Location</label>
              <input
                className={`form-control ${errors.location ? 'is-invalid' : ''} ${formData.location ? 'is-valid' : ''}`}
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.location || 'Add new location here...'}</div>
              <div className="valid-feedback">New location added...</div>
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">New Country</label>
              <input
                className={`form-control ${errors.country ? 'is-invalid' : ''} ${formData.country ? 'is-valid' : ''}`}
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.country || 'Add new country here...'}</div>
              <div className="valid-feedback">New country added...</div>
            </div>

            <button type="submit" className="btn btn-success mb-3" disabled={submitting}>
              {submitting ? 'Updating...' : 'Edit'}
            </button>
            <Link className="btn btn-primary bk-to-home ms-2" to="/listings">Back To Home</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditListing;