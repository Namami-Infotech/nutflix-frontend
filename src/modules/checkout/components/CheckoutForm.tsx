import React, { useState, useEffect } from 'react';
import { useCart } from '@/modules/cart';
import { submitOrder, fetchPaymentTypes, PaymentType } from '@/lib/api';
import { ShoppingBag, ShieldCheck, CheckCircle2, ArrowRight, Truck, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';

export const CheckoutForm: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  useEffect(() => {
    async function loadPayments() {
      const types = await fetchPaymentTypes();
      const active = types.filter((t) => t.status === 'active');
      setPaymentTypes(active);
      if (active.length > 0) {
        setSelectedPayment(active[0].code);
      }
    }
    loadPayments();
  }, []);

  const shippingCost = subtotal >= 30 ? 0 : 3.99;
  const totalAmount = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    const fullAddress = `${shippingAddress}, ${city}, ${postalCode}`;

    const orderPayload = {
      customerName,
      customerEmail,
      shippingAddress: fullAddress,
      paymentType: selectedPayment,
      totalAmount,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: parseFloat(item.product.price),
      })),
    };

    const res = await submitOrder(orderPayload);
    setLoading(false);

    if (res.success) {
      setOrderComplete(res.data);
      clearCart();
    }
  };

  if (orderComplete) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '640px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={42} color="var(--color-gold)" />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
            Asante Sana! Order Confirmed
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Thank you, <strong>{orderComplete.customerName}</strong>! Your order number is{' '}
            <strong style={{ color: 'var(--color-forest)' }}>#{orderComplete.orderNumber}</strong>.
          </p>

          <div
            style={{
              backgroundColor: 'var(--color-cream-light)',
              padding: '1.2rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              color: 'var(--color-forest)',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '0.4rem' }}>🌟 Impact Created with this Order:</div>
            <div>• Directly supported 3 smallholder farmer households</div>
            <div>• Funded essential health checks in Southern Tanzania</div>
          </div>

          <Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
          Your Basket is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Add some delicious ethical Tanzanian cashews, coffee, or honey before checking out.
        </p>
        <Link href="/" className="btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1.8rem' }}>
        Secure Checkout
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Form Left */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1.25rem' }}>
            1. Contact & Shipping Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="123 Kindness Way"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="London"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="SW1A 1AA"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '1.8rem', marginBottom: '1rem' }}>
            2. Select Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {paymentTypes.length > 0 ? (
              paymentTypes.map((pt) => {
                const isSelected = selectedPayment === pt.code;
                const isCash = pt.code === 'cash';
                return (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedPayment(pt.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid var(--color-gold)' : '1.5px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-gold-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentType"
                      checked={isSelected}
                      onChange={() => setSelectedPayment(pt.code)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                    />
                    {isCash ? <Banknote size={24} color="var(--color-forest)" /> : <CreditCard size={24} color="var(--color-forest)" />}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-forest)' }}>
                        {isCash ? 'Cash on Delivery (COD)' : 'UPI Payment (Google Pay / PhonePe / Paytm / BHIM UPI)'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {isCash ? 'Pay cash upon delivery at your doorstep' : 'Fast & instant UPI payment'}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '0.88rem' }}>
                UPI Payment & Cash on Delivery Available
              </div>
            )}
          </div>

          <div style={{ padding: '0.9rem', borderRadius: '12px', border: '1px solid var(--color-gold)', backgroundColor: 'var(--color-gold-light)', fontSize: '0.85rem', color: '#794d13', marginBottom: '1.5rem' }}>
            🔒 Test Mode Enabled: Click "Complete Order" to simulate instant payment confirmation.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', height: '50px', fontSize: '0.98rem', justifyContent: 'center' }}
          >
            {loading ? 'Processing Order...' : `Complete Order • ₹${totalAmount.toFixed(2)}`}
          </button>
        </form>

        {/* Summary Right */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1.2rem' }}>
            Order Summary ({items.length} items)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-forest)' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × ₹{parseFloat(item.product.price).toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-forest)' }}>
                  ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <strong style={{ color: '#276749' }}>FREE</strong> : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-forest)', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
