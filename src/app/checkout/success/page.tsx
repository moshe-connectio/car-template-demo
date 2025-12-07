/**
 * Checkout Success Page
 * Displays success message after payment completion
 */

'use client';

import { Suspense } from 'react';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import SuccessContent from './SuccessContent';

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Container className="py-12">
          <Suspense fallback={<div className="text-center py-12">טוען...</div>}>
            <SuccessContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
