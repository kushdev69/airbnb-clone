function Footer() {
  return (
    <footer>
      <div className="f-info sticky-bottom ">
        <div className="f-socialmedia">
          <i className="fa-brands fa-square-facebook"></i>
          <i className="fa-brands fa-square-instagram"></i>
          <i className="fa-brands fa-square-linkedin"></i>
        </div>
        <div className="f-brand">
         <p>&#169 Airbnb private limited</p>
        </div>
        <div className="f-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;