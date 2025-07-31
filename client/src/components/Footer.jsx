import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-artsy-white border-t border-artsy-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-serif text-artsy-black tracking-tight">
                Artify
              </span>
            </Link>
            <p className="mt-4 text-sm text-artsy-gray-600 leading-relaxed">
              A place to discover, buy, and sell art from the world's leading
              galleries, museums, and emerging artists.
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
                aria-label="WeChat"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.099 4.203 2.895 5.527L2.219 17.5l2.84-1.379c.89.173 1.828.287 2.632.287.297 0 .592-.016.885-.047-.18-.608-.277-1.252-.277-1.918 0-3.963 3.467-7.175 7.743-7.175.315 0 .627.016.938.043C15.467 4.39 12.414 2.188 8.691 2.188z"/>
                  <path d="M17.27 11.5c0-3.45-3.085-6.25-6.89-6.25s-6.89 2.8-6.89 6.25 3.085 6.25 6.89 6.25c.741 0 1.452-.087 2.109-.244l2.235 1.086-.617-2.006c1.408-1.018 2.318-2.606 2.318-4.336z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.148-1.193L17.34 3.756c1.297 1.297 1.297 3.446-.49 4.743L8.449 16.988z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Buy Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-artsy-black tracking-wide">
              Buy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/items"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Artworks
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Prints & Editions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Photography
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Paintings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Sculptures
                </a>
              </li>
            </ul>
          </div>

          {/* Sell Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-artsy-black tracking-wide">
              Sell
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/sell"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Sell with Artify
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Auction Consignment
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Private Sales
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Price Database
                </a>
              </li>
            </ul>
          </div>

          {/* Learn Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-artsy-black tracking-wide">
              Learn
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Editorial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Art Market
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Price Database
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Artist Insights
                </a>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-artsy-black tracking-wide">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  About Artify
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Press
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-artsy-gray-600 hover:text-artsy-black transition-colors duration-200"
                >
                  Send us feedback
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-artsy-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              <Link
                to="/privacy"
                className="text-xs text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
              >
                Terms of Use
              </Link>
              <a
                href="#"
                className="text-xs text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
              >
                Conditions of Sale
              </a>
              <a
                href="#"
                className="text-xs text-artsy-gray-500 hover:text-artsy-black transition-colors duration-200"
              >
                Security & Privacy
              </a>
            </div>

            {/* Copyright */}
            <div className="text-xs text-artsy-gray-500">
              © {new Date().getFullYear()} Artify. All rights reserved.
            </div>
          </div>

          {/* Bottom Description */}
          <div className="mt-6">
            <p className="text-xs text-artsy-gray-500 leading-relaxed max-w-4xl">
              Do not sell my personal information. Artify is the world's largest online art marketplace
              and platform for discovering art. We feature 1 million+ artworks from leading galleries,
              museums, and emerging artists worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
