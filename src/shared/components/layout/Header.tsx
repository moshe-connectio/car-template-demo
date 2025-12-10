import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaCarSide } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { Container } from './Container';
import { CartBadge } from './CartBadge';
import { APP_CONFIG, ROUTES } from '@core/lib/constants';
import { dealershipConfig } from '@core/config/site.config';

export function Header() {
  const socialLinks = [
    { 
      name: 'Facebook', 
      url: dealershipConfig.social.facebook,
      icon: FaFacebook,
    },
    { 
      name: 'Instagram', 
      url: dealershipConfig.social.instagram,
      icon: FaInstagram,
    },
    { 
      name: 'WhatsApp', 
      url: dealershipConfig.social.whatsapp,
      icon: FaWhatsapp,
    },
    { 
      name: 'YouTube', 
      url: dealershipConfig.social.youtube,
      icon: FaYoutube,
    },
  ];

  return (
    <header className="bg-header border-header sticky top-0 z-50 border-b">
      <Container>
        {/* Single Row - All Elements */}
        <div className="flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4">
          {/* Logo - Right */}
          <Link 
            href={ROUTES.home} 
            className="flex items-center gap-1 sm:gap-2 shrink-0 group hover:opacity-90 transition-opacity duration-200"
          >
            <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-linear-to-br from-primary to-blue-700 group-hover:shadow-md transition-shadow duration-200">
              <FaCarSide className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-header hidden sm:inline">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="flex items-center gap-4 sm:gap-8 flex-1 justify-center">
            <Link 
              href={ROUTES.vehicles} 
              className="text-gray-700 hover:text-primary font-medium transition-all duration-200 text-xs sm:text-sm relative group"
            >
              רכבים
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/new-vehicles" 
              className="text-gray-700 hover:text-primary font-medium transition-all duration-200 text-xs sm:text-sm relative group"
            >
              רכבים חדשים
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href={ROUTES.products} 
              className="text-gray-700 hover:text-primary font-medium transition-all duration-200 text-xs sm:text-sm relative group"
            >
              מוצרים
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Social Links + Cart - Left */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              href={ROUTES.cart}
              className="relative text-gray-600 hover:text-primary transition-all duration-200 hover:scale-110 p-1.5 rounded-md hover:bg-gray-100"
              title="עגלה"
              aria-label="עגלה"
            >
              <FaShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
              <CartBadge />
            </Link>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-all duration-200 hover:scale-110 p-1 sm:p-1.5 rounded-md hover:bg-gray-100 hidden sm:block"
                  title={social.name}
                  aria-label={social.name}
                >
                  <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </header>
  );
}
