import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Copyright */}
        <p className="text-sm text-yellow-400">
          © {new Date().getFullYear()} E-Store. All rights reserved.
        </p>

        {/* Center: Navigation Links */}
        <div className="flex gap-6 text-sm">
          <a href="/privacy-policy" className="hover:text-yellow-300">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-yellow-300">
            Terms & Conditions
          </a>
          <a href="/contact" className="hover:text-yellow-300">
            Contact Us
          </a>
        </div>

        {/* Right: Social Media Icons */}
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-yellow-300">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-yellow-300">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-yellow-300">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
