import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash, Plus, Minus, Sparkle } from '@phosphor-icons/react';
import { useCart } from '../hooks/useCart';
import { useAdmin } from '../hooks/useAdmin';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { PaymentModal } from './PaymentModal';
import { toast } from 'sonner';

export const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, getTotal, getItemCount } = useCart();
  const { addOrder } = useAdmin();
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage?.code || 'en'];
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });

  const isGringo = detectUserType(currentLanguage?.code || 'en');
  const currency = getCurrency(isGringo);
  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Save order to admin system
    addOrder({
      items: cartItems.map(item => ({
        itemId: item.item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total: totalWithTip,
      currency,
      customerName: customerInfo.name || 'Anonymous',
      customerEmail: customerInfo.email || 'anonymous@example.com',
      customerPhone: customerInfo.phone,
      isGringo,
      type: 'pickup'
    });
    clearCart();
    setPaymentModalOpen(false);
    toast.success('Order placed successfully! 🎉');
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="relative gap-2">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center p-0">
                {itemCount}
              </Badge>
            )}
            {t.menu.viewCart}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {t.cart.yourCart}
              {isGringo && (
                <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Sparkle size={14} weight="fill" />
                  Gringo Connection
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              {itemCount === 0 ? t.cart.emptyCart : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in cart`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p>{t.cart.emptyCart}</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium leading-none">
                          {currentLanguage?.code === 'en' ? item.item.name.en : item.item.name.es}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price, currency, false)} each
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto h-8 w-8 p-0"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right font-semibold">
                        {formatPrice(item.price * item.quantity, currency, false)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Section */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total, currency, false)}</span>
                  </div>
                </div>

                {/* Gringo Connection Info */}
                {isGringo && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Sparkle size={18} weight="fill" className="text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100">Gringo Connection Member</p>
                        <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
                          You're enjoying USD pricing and exclusive expat benefits!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Clear Cart
                  </Button>
                  <Button onClick={handleCheckout} className="flex-1">
                    {t.menu.checkout}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        total={total}
        currency={currency}
        onSuccess={handlePaymentSuccess}
        orderType="coffee"
        onCustomerInfo={setCustomerInfo}
      />
    </>
  );
};
