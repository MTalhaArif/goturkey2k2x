import Link from 'next/link';

export default function Header() {
  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-contact">
            <a href="mailto:goturkeyandstudytr@gmail.com">
              ✉ goturkeyandstudytr@gmail.com
            </a>
            <a href="tel:+905376994302">
              📞 +90 537 699 43 02
            </a>
          </div>
          <div className="top-social">
            <Link href="/register" className="top-auth-link">Register</Link>
            <Link href="/login" className="top-auth-link">Login</Link>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Link href="/" className="logo">
            <div className="logo-text">
              <span className="logo-go">GoTurkey</span>
              <span className="logo-turkey">2k2x</span>
              <div className="logo-tagline">Beyond Borders, Building Futures</div>
            </div>
          </Link>

          <nav className="nav-links">
            <div className="nav-item">
              <Link href="/about" className="nav-link-btn">About Us</Link>
            </div>
            <div className="nav-item">
              <Link href="/universities" className="nav-link-btn">Universities</Link>
            </div>
            <div className="nav-item">
              <Link href="/services" className="nav-link-btn">Our Services</Link>
            </div>
            <div className="nav-item">
              <Link href="/tourism" className="nav-link-btn">Tourism</Link>
            </div>
            <Link href="/register" className="nav-link-btn nav-tryos">Apply Now</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
