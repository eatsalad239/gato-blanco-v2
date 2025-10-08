import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Trash, Plus, Minus } from '@phosphor-icons/react';
import { useCart } from '../hooks/useCart';
import { useAdmin } from '../hooks/useAdmin';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { PaymentModal } from './PaymentModal';

export const CartDrawer: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, getItemCount, clearCart } = useCart();
  const { addOrder } = useAdmin();
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  
  const isGringo = detectUserType(currentLanguage.code);
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
      total,
      currency,
      customerName: customerInfo.name || 'Anonymous',
      customerEmail: customerInfo.email || 'anonymous@example.com',
      customerPhone: customerInfo.phone,
      isGringo,
      type: 'pickup'
    });

    clearCart();
  };

  return (
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
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart size={24} />
            {t.cart.title}
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? t.cart.empty : `${itemCount} items`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <ShoppingCart size={64} className="mb-4 opacity-50" />
              <p>{t.cart.empty}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((cartItem) => (
                <div key={cartItem.id} className="flex items-center gap-3 p-4 bg-card rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-medium text-card-foreground">
                      {cartItem.item.name[currentLanguage.code]}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(cartItem.price, currency, false)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus size={12} />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">
                      {cartItem.quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(cartItem.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>{t.cart.total}:</span>
              <span className="text-primary font-mono">
                {formatPrice(total, currency, false)}
              </span>
            </div>
            
            <Button 
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              size="lg"
            >
              {t.cart.checkout}
            </Button>
          </div>
        )}
      </SheetContent>
      
      <PaymentModal
        total={total}
        currency={currency}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        orderType="coffee"
      />
    </Sheet>
  );
};