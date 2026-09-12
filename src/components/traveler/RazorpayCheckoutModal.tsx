import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  ArrowRight, 
  QrCode, 
  Sparkles, 
  Download, 
  Printer, 
  Share2, 
  MapPin, 
  Utensils, 
  Compass,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TouristSpot, 
  Hotel, 
  RoomType, 
  RestaurantPassSelection, 
  Guide, 
  GuidePackageType, 
  Booking, 
  SplitBreakdown 
} from '../../types';
import { calculateSplitBreakdown } from '../../services/paymentSplitService';

interface RazorpayCheckoutModalProps {
  spot: TouristSpot;
  hotel: Hotel;
  selectedRoom: RoomType;
  nights: number;
  restaurantPass: RestaurantPassSelection | null;
  selectedGuide: Guide | null;
  selectedPackage: GuidePackageType;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

type RazorpayMethod = 'upi' | 'card' | 'netbanking' | 'qr';

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  spot,
  hotel,
  selectedRoom,
  nights,
  restaurantPass,
  selectedGuide,
  selectedPackage,
  onClose,
  onBookingConfirmed
}) => {
  const [guestName, setGuestName] = useState<string>('Varshith Sharma');
  const [guestPhone, setGuestPhone] = useState<string>('+91 98490 12345');
  const [guestEmail, setGuestEmail] = useState<string>('varshith@example.com');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<RazorpayMethod>('upi');
  const [upiId, setUpiId] = useState<string>('varshith@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4315 2890 1234 5678');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('821');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Razorpay order ID
  const [razorpayOrderId] = useState<string>(() => `order_RPZ_${Math.floor(10000000 + Math.random() * 90000000)}`);

  // Split calculation
  const split: SplitBreakdown = calculateSplitBreakdown({
    hotel,
    nights,
    selectedRoomPrice: selectedRoom.pricePerNight,
    guide: selectedGuide,
    guidePackageType: selectedPackage,
    restaurantPass,
    applyWebsiteDiscount: true
  });

  const getPackageTitle = (type: GuidePackageType) => {
    switch (type) {
      case 'quick_walk': return 'Quick 2-Hour Heritage Walk';
      case 'half_day': return 'Half-Day Heritage & Bazaar Walk (4 Hours)';
      case 'full_day': return 'Full-Day Cultural Deep Dive (8 Hours)';
      case 'photography_walk': return 'Sunset Photography Tour (3.5 Hours)';
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay 256-bit Secure Gateway...');

    setTimeout(() => {
      setProcessingStep('Validating 2-Factor authentication with bank...');
    }, 700);

    setTimeout(() => {
      setProcessingStep('Executing automated multi-party escrow split...');
    }, 1400);

    setTimeout(() => {
      setIsProcessing(false);

      const newBooking: Booking = {
        id: `BK-RPZ-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: 'user-varshith-1',
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomTypeId: selectedRoom.id,
        roomTypeName: selectedRoom.name,
        dates: {
          checkIn: '2026-09-16',
          checkOut: '2026-09-18',
          nights
        },
        guests: 2,
        guideId: selectedGuide ? selectedGuide.id : null,
        guideName: selectedGuide ? selectedGuide.name : null,
        guidePackageType: selectedGuide ? selectedPackage : null,
        guidePackageTitle: selectedGuide ? getPackageTitle(selectedPackage) : null,
        restaurantId: restaurantPass ? restaurantPass.restaurant.id : null,
        restaurantName: restaurantPass ? restaurantPass.restaurant.name : null,
        restaurantPassAmount: restaurantPass ? restaurantPass.totalCost : 0,
        totalAmount: split.totalCharged,
        originalAmount: split.originalTotal,
        websiteDiscountAmount: split.websiteDiscountAmount,
        razorpayPaymentId: `pay_RPZ_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        razorpayOrderId,
        paymentMethod: paymentMethod.toUpperCase(),
        splitBreakdown: split,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        touristSpotName: spot.name,
        meetingPointInfo: `Hotel Concierge Desk / ${spot.name} Main Gate at 09:30 AM`
      };

      setConfirmedBooking(newBooking);
      onBookingConfirmed(newBooking);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] text-white p-5 sm:p-6 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            {/* Razorpay Blue Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-[#0084ff] text-white flex items-center justify-center font-black text-lg shadow-lg">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#0084ff] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Razorpay Trusted Business</span>
              </div>
              <h3 className="text-lg font-black text-white">
                TourMatch AI Checkout
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Amount Payable</span>
              <span className="text-xl font-black text-emerald-400">
                ₹{split.totalCharged.toLocaleString()}
              </span>
            </div>

            {!confirmedBooking && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* View 1: Confirmed Pass Screen */}
          {confirmedBooking ? (
            <div className="space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Payment Verified via Razorpay!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Transaction ID: <strong className="text-slate-800">{confirmedBooking.razorpayPaymentId}</strong> &bull; Order ID: {confirmedBooking.razorpayOrderId}
                </p>
              </div>

              {/* Digital Boarding Pass Ticket */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 text-left relative overflow-hidden shadow-xl border border-slate-800">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Official Digital Pass</span>
                    <h4 className="text-lg font-black">{spot.name} Experience</h4>
                    <span className="text-xs text-slate-400">{hotel.city} &bull; 2 Guests &bull; {nights} Nights</span>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Booking Ref</span>
                    <strong className="text-white font-mono">{confirmedBooking.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Stay Property</span>
                    <strong className="text-white truncate block">{hotel.name}</strong>
                  </div>
                  {restaurantPass && (
                    <div>
                      <span className="text-slate-400 text-[10px] block">Dining Pass</span>
                      <strong className="text-amber-400 truncate block">₹{restaurantPass.totalWorth} at {restaurantPass.restaurant.name}</strong>
                    </div>
                  )}
                  {selectedGuide && (
                    <div>
                      <span className="text-slate-400 text-[10px] block">Certified Guide</span>
                      <strong className="text-emerald-400 truncate block">{selectedGuide.name}</strong>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Meeting Point: {confirmedBooking.meetingPointInfo}</span>
                  <span className="text-emerald-400 font-bold">PAID ₹{confirmedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>

            </div>
          ) : (
            /* View 2: Razorpay Payment Form */
            <div className="space-y-6">

              {/* Guest Details */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">Lead Traveler Contact:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Full Name"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email Address"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">Select Payment Method:</span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">UPI / Apps</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'qr'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Scan QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Netbanking</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Option Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-700">Instant UPI Apps:</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Fastest</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                        <div key={app} className="p-2.5 rounded-xl bg-white border border-slate-200 text-center font-semibold text-slate-700 cursor-pointer hover:border-blue-400">
                          {app}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="text-[11px] text-slate-500 block mb-1">Or enter custom Virtual Payment Address (VPA):</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Card Number:</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">Valid Thru:</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-1">CVV:</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'qr' && (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <div className="w-40 h-40 bg-white p-2 rounded-2xl border-2 border-slate-300 shadow-md flex items-center justify-center mb-2">
                      <QrCode className="w-32 h-32 text-slate-900" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Scan & Pay ₹{split.totalCharged.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Open GPay, PhonePe, Paytm or any BHIM UPI App</span>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Select Bank:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            selectedBank === bank
                              ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Animation */}
              {isProcessing && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-xs font-bold text-blue-900">{processingStep}</span>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className="w-full py-4 rounded-2xl bg-[#0084ff] hover:bg-[#0070d8] text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{split.totalCharged.toLocaleString()} via Razorpay</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Razorpay 256-bit Encrypted Escrow Payouts</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
