import { Container } from './Container';
import { APP_CONFIG, ROUTES, CONTACT_INFO } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer text-footer mt-16">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-footer-heading font-bold text-lg mb-4">{APP_CONFIG.name}</h3>
            <p className="text-sm leading-relaxed">
              מציעים את מגוון הרכבים הטוב ביותר עם שירות אמין ומקצועי. הצוות שלנו כאן כדי לעזור לך למצוא את הרכב המושלם.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-footer-heading font-bold text-lg mb-4">קישורים מהירים</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={ROUTES.home} className="hover:text-footer-heading transition-colors">
                  דף הבית
                </a>
              </li>
              <li>
                <a href={ROUTES.vehicles} className="hover:text-footer-heading transition-colors">
                  רכבים למכירה
                </a>
              </li>
              <li>
                <a href={ROUTES.demo} className="hover:text-footer-heading transition-colors">
                  דמו
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-footer-heading font-bold text-lg mb-4">צור קשר</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-footer mt-8 pt-8 text-sm text-center border-t">
          <p>© {currentYear} {APP_CONFIG.name}. כל הזכויות שמורות.</p>
        </div>
      </Container>
    </footer>
  );
}
