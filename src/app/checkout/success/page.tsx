/**
 * Checkout Success Page
 * Displays success message after payment completion
 */

'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { FaCheckCircle, FaEnvelope, FaShoppingBag } from 'react-icons/fa';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    // Clear cart from localStorage (already cleared in checkout page)
    // You could also send order confirmation email here
    console.log('Payment successful:', paymentIntentId);
  }, [paymentIntentId]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FaCheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                התשלום בוצע בהצלחה!
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                תודה על הרכישה. הזמנתך התקבלה ותעובד בהקדם.
              </p>

              {/* Order ID */}
              {paymentIntentId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-600 mb-1">מספר הזמנה:</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    #{paymentIntentId.slice(-8).toUpperCase()}
                  </p>
                </div>
              )}

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <FaEnvelope className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">
                    אישור במייל
                  </h3>
                  <p className="text-sm text-gray-600">
                    שלחנו לך אישור הזמנה לכתובת המייל שהזנת
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <FaShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold text-gray-900 mb-1">
                    משלוח
                  </h3>
                  <p className="text-sm text-gray-600">
                    נעדכן אותך על סטטוס המשלוח בהודעת SMS
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div className="border-t pt-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">מה הלאה?</h3>
                <ul className="text-right space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>קיבלת אישור הזמנה במייל</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>ההזמנה בטיפול ותישלח בימים הקרובים</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>תקבל הודעת SMS עם מספר משלוח</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  המשך לקנות
                </Link>
                <Link
                  href="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  חזרה לדף הבית
                </Link>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                יש שאלות?{' '}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  צור קשר עם התמיכה
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
