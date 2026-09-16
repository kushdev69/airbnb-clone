import { useFlash } from '../context/FlashContext';
import { useEffect } from 'react';

function FlashMessages() {
  const { flashes, clearFlashes } = useFlash();

  useEffect(() => {
    // Auto-clear flashes after 5 seconds
    const timer = setTimeout(() => {
      clearFlashes('success');
      clearFlashes('error');
    }, 5000);
    return () => clearTimeout(timer);
  }, [flashes, clearFlashes]);

  if (!flashes.success.length && !flashes.error.length) {
    return null;
  }

  return (
    <div className="container container-success">
      {flashes.success.map((message, index) => (
        <div key={index} className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => clearFlashes('success')} aria-label="Close"></button>
        </div>
      ))}
      {flashes.error.map((message, index) => (
        <div key={index} className="alert alert-danger alert-dismissible fade show" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => clearFlashes('error')} aria-label="Close"></button>
        </div>
      ))}
    </div>
  );
}

export default FlashMessages;