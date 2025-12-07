'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@shared/store/cart';

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCart((state) => state.getTotalItems);
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || totalItems === 0) return null;

  return (
    <span className="absolute -top-2 -left-2 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
}
