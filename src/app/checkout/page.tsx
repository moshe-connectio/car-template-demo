/**
 * Checkout Page
 * Complete payment flow with customer details and Stripe payment
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { useCart } from '@shared/store/cart';
import { formatPrice } from '@shared/utils/formatting';
import { StripeProvider, MultiPaymentForm } from '@shared/components/payment';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const getTotalPrice = useCart((state) => state.getTotalPrice);
  const clearCart = useCart((state) => state.clearCart);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const totalPrice = getTotalPrice();
  const isEmpty = items.length === 0;

  // Redirect if cart is empty
  if (isEmpty) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Container className="text-center py-12">
            <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              העגלה ריקה
            </h1>
            <p className="text-gray-600 mb-6">
              אין מוצרים בעגלה. אנא הוסף מוצרים לפני המעבר לתשלום.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              חזרה לקטלוג
            </Link>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Clear cart
    clearCart();

    // Redirect to success page
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is already shown in the PaymentForm component
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              השלמת הזמנה
            </h1>
            <p className="text-gray-600">
              מלא את הפרטים ופרטי התשלום להשלמת ההזמנה
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  סיכום הזמנה
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">
                        {item.name}
                        <span className="text-gray-500"> ×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      סה״כ לתשלום:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  פרטי לקוח ומשלוח
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      שם מלא *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="שם מלא"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        אימייל *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="050-1234567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      כתובת משלוח *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="רחוב ומספר בית"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      עיר *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="תל אביב"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      הערות (אופציונלי)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      rows={3}
                      placeholder="הערות למשלוח..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                פרטי תשלום
              </h2>
              <StripeProvider amount={totalPrice} currency="ILS">
                <MultiPaymentForm
                  amount={totalPrice}
                  currency="ILS"
                  customerInfo={customerInfo}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  availableMethods={['card', 'paypal', 'apple_pay', 'google_pay']}
                />
              </StripeProvider>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
