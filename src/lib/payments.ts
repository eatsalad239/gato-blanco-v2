import { Order, Booking } from '../types';

// Payment Processing System with Apple Pay & Card Support
export interface PaymentMethod {
  type: 'card' | 'apple_pay' | 'google_pay' | 'cash';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  holderName?: string;
  applePayToken?: string;
  googlePayToken?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  currency: 'COP' | 'USD';
  amount: number;
  fees?: number;
  exchangeRate?: number;
}

export interface PaymentRequest {
  amount: number;
  currency: 'COP' | 'USD';
  orderId?: string;
  bookingId?: string;
  customerId: string;
  description: string;
  method: PaymentMethod;
}

export class PaymentProcessor {
  private static instance: PaymentProcessor;
  
  static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor();
    }
    return PaymentProcessor.instance;
  }

  // Check if Apple Pay is available
  async isApplePayAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if we're on iOS/macOS and Apple Pay is supported
      return (window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments();
    } catch {
      return false;
    }
  }

  // Check if Google Pay is available
  async isGooglePayAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if Google Pay is available
      return !!(window as any).google?.payments?.api;
    } catch {
      return false;
    }
  }

  // Get real-time exchange rate COP to USD
  async getExchangeRate(): Promise<number> {
    try {
      // In a real app, you'd call a live exchange rate API
      // For now, using approximate rate (1 USD = 4000 COP)
      return 4000;
    } catch {
      return 4000; // Fallback rate
    }
  }

  // Convert currency
  async convertCurrency(amount: number, from: 'COP' | 'USD', to: 'COP' | 'USD'): Promise<number> {
    if (from === to) return amount;
    
    const rate = await this.getExchangeRate();
    
    if (from === 'USD' && to === 'COP') {
      return amount * rate;
    } else if (from === 'COP' && to === 'USD') {
      return amount / rate;
    }
    
    return amount;
  }

  // Calculate fees (different rates for gringos vs locals)
  calculateFees(amount: number, currency: 'COP' | 'USD', isGringo: boolean, method: PaymentMethod['type']): number {
    let feePercentage = 0;
    
    // Base fees
    switch (method) {
      case 'card':
        feePercentage = 0.025; // 2.5%
        break;
      case 'apple_pay':
      case 'google_pay':
        feePercentage = 0.02; // 2% (digital wallets are cheaper)
        break;
      case 'cash':
        feePercentage = 0; // No fees for cash
        break;
    }
    
    // Gringo markup
    if (isGringo && method !== 'cash') {
      feePercentage += 0.01; // Additional 1% for gringo premium service
    }
    
    return amount * feePercentage;
  }

  // Process Apple Pay payment
  async processApplePay(request: PaymentRequest): Promise<PaymentResult> {
    try {
      if (!await this.isApplePayAvailable()) {
        return {
          success: false,
          error: 'Apple Pay not available on this device',
          currency: request.currency,
          amount: request.amount
        };
      }

      // Create Apple Pay session
      const paymentRequest = {
        countryCode: 'CO',
        currencyCode: request.currency,
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'Gato Blanco Café',
          amount: request.amount.toString()
        }
      };

      // In a real implementation, you'd integrate with Apple Pay JS
      // For demo purposes, simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `apple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store transaction
      await this.storeTransaction({
        id: transactionId,
        amount: request.amount,
        currency: request.currency,
        method: 'apple_pay',
        status: 'completed',
        customerId: request.customerId,
        orderId: request.orderId,
        bookingId: request.bookingId,
        timestamp: Date.now()
      });

      return {
        success: true,
        transactionId,
        currency: request.currency,
        amount: request.amount,
        fees: 0 // Apple Pay fees typically handled by Apple
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Apple Pay payment failed',
        currency: request.currency,
        amount: request.amount
      };
    }
  }

  // Process card payment
  async processCardPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const { method } = request;
      
      if (!method.cardNumber || !method.expiryDate || !method.cvv || !method.holderName) {
        return {
          success: false,
          error: 'Incomplete card information',
          currency: request.currency,
          amount: request.amount
        };
      }

      // Validate card number (basic Luhn algorithm)
      if (!this.validateCardNumber(method.cardNumber)) {
        return {
          success: false,
          error: 'Invalid card number',
          currency: request.currency,
          amount: request.amount
        };
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Random failure simulation (5% failure rate)
      if (Math.random() < 0.05) {
        return {
          success: false,
          error: 'Payment declined by bank',
          currency: request.currency,
          amount: request.amount
        };
      }

      const transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fees = this.calculateFees(request.amount, request.currency, false, 'card');
      
      // Store transaction
      await this.storeTransaction({
        id: transactionId,
        amount: request.amount,
        currency: request.currency,
        method: 'card',
        status: 'completed',
        customerId: request.customerId,
        orderId: request.orderId,
        bookingId: request.bookingId,
        timestamp: Date.now(),
        fees
      });

      return {
        success: true,
        transactionId,
        currency: request.currency,
        amount: request.amount,
        fees
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Card payment failed',
        currency: request.currency,
        amount: request.amount
      };
    }
  }

  // Process cash payment
  async processCashPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const transactionId = `cash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store transaction
      await this.storeTransaction({
        id: transactionId,
        amount: request.amount,
        currency: request.currency,
        method: 'cash',
        status: 'completed',
        customerId: request.customerId,
        orderId: request.orderId,
        bookingId: request.bookingId,
        timestamp: Date.now()
      });

      return {
        success: true,
        transactionId,
        currency: request.currency,
        amount: request.amount,
        fees: 0
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cash payment recording failed',
        currency: request.currency,
        amount: request.amount
      };
    }
  }

  // Main payment processing method
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    switch (request.method.type) {
      case 'apple_pay':
        return this.processApplePay(request);
      case 'card':
        return this.processCardPayment(request);
      case 'cash':
        return this.processCashPayment(request);
      default:
        return {
          success: false,
          error: 'Unsupported payment method',
          currency: request.currency,
          amount: request.amount
        };
    }
  }

  // Validate card number using Luhn algorithm
  private validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\s+/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Store transaction in persistent storage
  private async storeTransaction(transaction: {
    id: string;
    amount: number;
    currency: 'COP' | 'USD';
    method: string;
    status: string;
    customerId: string;
    orderId?: string;
    bookingId?: string;
    timestamp: number;
    fees?: number;
  }): Promise<void> {
    const transactions = await (window as any).spark.kv.get('transactions') || [];
    transactions.push(transaction);
    await (window as any).spark.kv.set('transactions', transactions);
  }

  // Get transaction history
  async getTransactions(customerId?: string): Promise<any[]> {
    const transactions = await (window as any).spark.kv.get('transactions') || [];
    
    if (customerId) {
      return transactions.filter(t => t.customerId === customerId);
    }
    
    return transactions;
  }

  // Get payment analytics
  async getPaymentAnalytics(period: 'day' | 'week' | 'month'): Promise<{
    totalVolume: number;
    totalFees: number;
    methodBreakdown: Record<string, number>;
    currencyBreakdown: Record<string, number>;
    averageTransaction: number;
    successRate: number;
  }> {
    const transactions = await this.getTransactions();
    
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    const periodTransactions = transactions.filter(t => 
      t.timestamp >= startDate.getTime()
    );
    
    const successfulTransactions = periodTransactions.filter(t => t.status === 'completed');
    
    const totalVolume = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = successfulTransactions.reduce((sum, t) => sum + (t.fees || 0), 0);
    
    const methodBreakdown: Record<string, number> = {};
    const currencyBreakdown: Record<string, number> = {};
    
    successfulTransactions.forEach(t => {
      methodBreakdown[t.method] = (methodBreakdown[t.method] || 0) + t.amount;
      currencyBreakdown[t.currency] = (currencyBreakdown[t.currency] || 0) + t.amount;
    });
    
    return {
      totalVolume,
      totalFees,
      methodBreakdown,
      currencyBreakdown,
      averageTransaction: successfulTransactions.length > 0 ? totalVolume / successfulTransactions.length : 0,
      successRate: periodTransactions.length > 0 ? (successfulTransactions.length / periodTransactions.length) * 100 : 0
    };
  }
}

// React Hook for Payment Processing
export function usePayments() {
  const processor = PaymentProcessor.getInstance();
  return processor;
}