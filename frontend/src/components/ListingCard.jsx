import { Link } from 'react-router-dom';

function ListingCard({ listing }) {
  return (
    <div className="col">
      <div className="card h-100 listing-card">
        <Link to={`/listings/${listing._id}`} className="listing-link text-decoration-none text-dark">
          <img 
            src={listing.image?.url} 
            className="card-img-top listing-img" 
            alt={listing.title}
          />
          <div className="card-body listing-body d-flex flex-column">
            <h5 className="card-title">{listing.title}</h5>
            <p className="card-text flex-grow-1">{listing.description}</p>
            <ul className="list-group list-group-flush mt-auto">
              <li className="list-group-item price fw-bold">
                &#8377; {listing.price?.toLocaleString?.("en-IN") || listing.price}
              </li>
            </ul>
          </div>
          <div className="card-body listing-details border-top">
            <span className="card-link">
              <i className="fa-solid fa-location-dot me-1"></i>
              {listing.location}
            </span>
            <span className="card-link ms-2">
              <i className="fa-solid fa-flag me-1"></i>
              {listing.country}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;