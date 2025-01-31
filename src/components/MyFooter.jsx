import React from "react"
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa"
import { FiSend } from "react-icons/fi"

const EnhancedFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">NoteCafe</h2>
            <p className="text-gray-400 mb-4">Empowering minds through knowledge and creativity.</p>
            <div className="flex space-x-4">
              <SocialIcon Icon={FaFacebookF} href="#" />
              <SocialIcon Icon={FaTwitter} href="#" />
              <SocialIcon Icon={FaInstagram} href="#" />
              <SocialIcon Icon={FaGithub} href="#" />
              <SocialIcon Icon={FaLinkedinIn} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/services">Our Services</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/sitemap">Sitemap</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition duration-300"
                aria-label="Subscribe to newsletter"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} NoteCafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ Icon, href }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition duration-300"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="w-5 h-5" />
  </a>
)

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-400 hover:text-white transition duration-300">
      {children}
    </a>
  </li>
)

export default EnhancedFooter

