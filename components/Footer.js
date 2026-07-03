import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "var(--font-heading)" }}>
                <span style={{ color: "var(--primary)" }}>GoTurkey</span>2k2x
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>Beyond Borders, Building Futures</div>
            </div>
            <p className="footer-text">
              Your Gateway to a Better Tomorrow! We provide guaranteed acceptance and comprehensive post-landing services.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
              <a href="tel:+905376994302" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>📞 +90 537 699 43 02</a>
              <a href="mailto:goturkeyandstudytr@gmail.com" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>✉ goturkeyandstudytr@gmail.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/">› Home</Link></li>
              <li><Link href="/about">› About Us</Link></li>
              <li><Link href="/universities">› Partner Universities</Link></li>
              <li><Link href="/services">› Our Services</Link></li>
              <li><Link href="/register">› Apply Now</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Follow Us</h3>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/goturkey2k2x" target="_blank" rel="noreferrer">› Instagram</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">› WhatsApp Channel</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center" style={{ paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          <p>© {new Date().getFullYear()} GoTurkey 2k2x. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
