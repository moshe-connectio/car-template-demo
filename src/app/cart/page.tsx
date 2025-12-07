'use client';

import Link from 'next/link';
import { Header } from '@shared/components/layout/Header';
import { Footer } from '@shared/components/layout/Footer';
import { Container } from '@shared/components/layout/Container';
import { useCart } from '@shared/store/cart';
import { formatPrice } from '@shared/utils/formatting';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa6';
import Image from 'next/image';
import { ROUTES } from '@core/lib/constants';

export default function CartPage() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const getTotalPrice = useCart((state) => state.getTotalPrice);
  const clearCart = useCart((state) => state.clearCart);

  const totalPrice = getTotalPrice();
  const isEmpty = items.length === 0;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Container className="py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href={ROUTES.home} className="hover:text-primary transition-colors">
              דף הבית
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">עגלה</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {isEmpty ? 'העגלה ריקה' : `עגלת קניות (${items.length} מוצרים)`}
              </h1>

              {isEmpty ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-gray-600 mb-6">
                    אין מוצרים בעגלה שלך כרגע
                  </p>
                  <Link
                    href={ROUTES.products}
                    className="inline-block bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    בחזור לקנייה
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="bg-white rounded-lg p-4 flex gap-4 items-start"
                    >
                      {/* Product Image */}
                      {item.imageUrl && (
                        <div className="relative w-24 h-24 shrink-0 bg-gray-200 rounded-md overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={ROUTES.productDetail(item.slug)}
                          className="text-lg font-bold text-gray-900 hover:text-primary transition-colors block truncate"
                        >
                          {item.name}
                        </Link>
                        <p className="text-2xl font-bold text-primary mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-white rounded transition-colors"
                          aria-label="הקטן כמות"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 font-bold min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-white rounded transition-colors"
                          aria-label="הגדל כמות"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">סכום</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-error hover:bg-red-50 rounded transition-colors"
                        aria-label="הסר מעגלה"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  {/* Clear Cart Button */}
                  <button
                    onClick={() => clearCart()}
                    className="text-error hover:text-red-700 font-medium text-sm"
                  >
                    ריקוי העגלה
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {!isEmpty && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 sticky top-24 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">סיכום הזמנה</h2>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm text-gray-700">
                        <span>
                          {item.name}
                          <span className="text-gray-600"> ×{item.quantity}</span>
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">סה״כ:</span>
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    <Link
                      href="/checkout"
                      className="block w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                      המשך לתשלום 💳
                    </Link>

                    <Link
                      href={ROUTES.products}
                      className="block w-full text-center mt-3 text-primary hover:text-blue-700 font-medium transition-colors"
                    >
                      חזרה לקנייה
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
