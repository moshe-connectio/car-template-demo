import Link from 'next/link';
import { Container } from './Container';
import { APP_CONFIG, ROUTES } from '@/lib/constants';

export function Header() {
  return (
    <header className="bg-header border-header sticky top-0 z-50 border-b">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg 
              className="w-8 h-8 text-primary" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
            <span className="text-xl font-bold text-header">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href={ROUTES.vehicles} 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              רכבים
            </Link>
            <Link 
              href={ROUTES.demo} 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              דמו
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
