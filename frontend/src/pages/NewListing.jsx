import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';

function NewListing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addFlash } = useFlash();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    // Clear error when user starts typing
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
    if (!formData.image) newErrors.image = 'Please select an image';
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

      await listingAPI.create(data);
      addFlash('success', 'Listing created successfully!');
      navigate('/listings');
    } catch (err) {
      addFlash('error', err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-5">
        <p>Please <a href="/users/login">login</a> to create a listing</p>
      </div>
    );
  }

  return (
    <div className="edit-wrapper">
      <div className="row">
        <div className="col-8 offset-2">
          <form onSubmit={handleSubmit} className="needs-validation" noValidate encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                className={`input-field form-control mb-2 ${errors.title ? 'is-invalid' : ''} ${formData.title ? 'is-valid' : ''}`}
                type="text"
                id="title"
                name="title"
                placeholder="enter title.."
                value={formData.title}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.title || 'Please enter Title'}</div>
              <div className="valid-feedback">Title looks good..</div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className={`input-field form-control mb-2 ${errors.description ? 'is-invalid' : ''} ${formData.description ? 'is-valid' : ''}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.description || 'Please enter Description'}</div>
              <div className="valid-feedback">Description is optional</div>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image</label>
              <input
                className={`input-field form-control mb-2 ${errors.image ? 'is-invalid' : ''} ${formData.image ? 'is-valid' : ''}`}
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.image || 'Please select an image'}</div>
              <div className="valid-feedback">Image inserted..</div>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                className={`input-field form-control mb-2 ${errors.price ? 'is-invalid' : ''} ${formData.price ? 'is-valid' : ''}`}
                type="number"
                id="price"
                name="price"
                placeholder="enter price.."
                value={formData.price}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.price || 'Please enter Price'}</div>
              <div className="valid-feedback">Price filled correctly..</div>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                className={`input-field form-control mb-2 ${errors.location ? 'is-invalid' : ''} ${formData.location ? 'is-valid' : ''}`}
                type="text"
                id="location"
                name="location"
                placeholder="enter location.."
                value={formData.location}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.location || 'Please enter Location'}</div>
              <div className="valid-feedback">Location added</div>
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                className={`input-field form-control mb-2 ${errors.country ? 'is-invalid' : ''} ${formData.country ? 'is-valid' : ''}`}
                type="text"
                id="country"
                name="country"
                placeholder="enter country.."
                value={formData.country}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{errors.country || 'Please enter Country'}</div>
              <div className="valid-feedback">Country added</div>
            </div>
            <button className="btn btn-success mb-3" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewListing;