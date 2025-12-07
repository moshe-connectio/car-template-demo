/**
 * Payment Method Selector
 * Allows users to choose between different payment methods
 */

'use client';

import { useState } from 'react';
import { FaCreditCard, FaPaypal, FaApple, FaGoogle, FaMobileAlt } from 'react-icons/fa';
import { SiVisa, SiMastercard } from 'react-icons/si';

export type PaymentMethod = 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bit';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  availableMethods?: PaymentMethod[];
}

const PAYMENT_METHODS = {
  card: {
    id: 'card' as PaymentMethod,
    name: 'כרטיס אשראי',
    icon: FaCreditCard,
    description: 'Visa, Mastercard, ישראכרט',
    color: 'blue',
  },
  paypal: {
    id: 'paypal' as PaymentMethod,
    name: 'PayPal',
    icon: FaPaypal,
    description: 'חשבון PayPal',
    color: 'blue',
  },
  apple_pay: {
    id: 'apple_pay' as PaymentMethod,
    name: 'Apple Pay',
    icon: FaApple,
    description: 'תשלום מהיר',
    color: 'gray',
  },
  google_pay: {
    id: 'google_pay' as PaymentMethod,
    name: 'Google Pay',
    icon: FaGoogle,
    description: 'תשלום מהיר',
    color: 'blue',
  },
  bit: {
    id: 'bit' as PaymentMethod,
    name: 'Bit',
    icon: FaMobileAlt,
    description: 'תשלום בביט',
    color: 'orange',
  },
};

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  availableMethods = ['card', 'paypal', 'apple_pay', 'google_pay', 'bit'],
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
        בחר אמצעי תשלום
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableMethods.map((methodId) => {
          const method = PAYMENT_METHODS[methodId];
          const Icon = method.icon;
          const isSelected = selectedMethod === methodId;

          return (
            <button
              key={methodId}
              type="button"
              onClick={() => onMethodChange(methodId)}
              className={`
                p-4 rounded-lg border-2 transition-all text-right
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div
                    className={`font-bold ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    {method.name}
                  </div>
                  <div
                    className={`text-xs ${
                      isSelected ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {method.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Accepted Cards Icons */}
      {selectedMethod === 'card' && (
        <div className="mt-3 flex items-center gap-2 justify-end text-gray-400">
          <span className="text-xs text-gray-500">מקבלים:</span>
          <SiVisa className="w-8 h-8" />
          <SiMastercard className="w-8 h-8" />
          <span className="text-xs font-bold">ישראכרט</span>
        </div>
      )}
    </div>
  );
}
