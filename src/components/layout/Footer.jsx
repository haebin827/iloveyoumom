import React from 'react';
import '../../assets/styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} 오까게. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;