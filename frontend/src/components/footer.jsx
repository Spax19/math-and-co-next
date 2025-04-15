import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faInstagram, 
  faTiktok, 
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-black text-white font-bold py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Logo and Social */}
          <div className="text-center md:text-left md:w-1/3">
            <img
              src="./images/Math&Co.png"
              alt="Math&Co Logo"
              className="w-32 mx-auto md:mx-0 mb-5"
            />
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-[#cfa54b] hover:text-white transition-colors">
                <FontAwesomeIcon icon={faFacebookF} size="lg" />
              </a>
              <a href="#" className="text-[#cfa54b] hover:text-white transition-colors">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="#" className="text-[#cfa54b] hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTiktok} size="lg" />
              </a>
              <a href="#" className="text-[#cfa54b] hover:text-white transition-colors">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h5 className="text-[#cfa54b] text-xl mb-3">PAGES</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Serving Tips</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Our Wines</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Experiences</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Distributors</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">FAQ's</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[#cfa54b] text-xl mb-3">OUR COMPANY</h5>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Vacancies</a></li>
                <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-5 mt-10">
          <div className="flex justify-center flex-wrap gap-2 mb-5">
            <img src="./images/visa.png" alt="Visa" className="h-8 w-auto" />
            <img src="./images/mastercard.png" alt="Mastercard" className="h-8 w-auto" />
            <img src="./images/amex.png" alt="Amex" className="h-8 w-auto" />
            <img src="./images/paypal.png" alt="Paypal" className="h-8 w-auto" />
            <img src="./images/discover.png" alt="Discover" className="h-8 w-auto" />
          </div>

          <div className="text-center">
            <p>© 2025, MATH & CO Developed by: DIMA & SIRA PTY (Ltd)</p>
            <ul className="flex flex-wrap justify-center gap-4 mt-3 text-sm">
              <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#cfa54b] transition-colors">Contact Information</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="bg-[#cfa54b] py-4 mt-10">
          <p className="text-black text-sm text-center">PLEASE DRINK RESPONSIBLY</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;