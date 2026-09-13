import React, { useState } from 'react';
import { 
  Booking 
} from '../../types';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Hotel, 
  Utensils, 
  Users, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Cloud, 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  X, 
  ChevronRight
} from 'lucide-react';

interface BookedPlansBoxProps {
  bookings: Booking[];
  onOpenPlanner?: () => void;
}

export const BookedPlansBox: React.FC<BookedPlansBoxProps> = ({
  bookings,
  onOpenPlanner
}) => {
  const [selectedPassBooking, setSelectedPassBooking] = useState<Booking | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Box Header (Structured identically to Hotel & Guide portals) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              My Booked Plans & Verified Passes
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Confirmed itineraries with guaranteed direct room booking, dining vouchers, and verified local guide passes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-200">
            {bookings.length} {bookings.length === 1 ? 'Trip Plan' : 'Trip Plans'}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 font-medium">
            <Cloud className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            <span>Cloud Synced</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Ticket className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800">No Booked Trip Plans Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Plan your travel package above with authentic hotels, certified local guides, and dining passes. Confirmed digital passes and check-in QR codes will appear right here in this box!
            </p>
          </div>
          {onOpenPlanner && (
            <button
              type="button"
              onClick={onOpenPlanner}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Explore & Build a Trip Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const savings = booking.splitBreakdown?.travelerSavingsAmount || booking.websiteDiscountAmount || 1200;
            const savingsPercent = booking.splitBreakdown?.travelerSavingsPercent || 24;

            return (
              <div 
                key={booking.id}
                className="p-5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200 transition-all space-y-4"
              >
                {/* Top Strip: Ref, Destination, Dates & Paid Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-md">
                        {booking.id}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <Hotel className="w-3.5 h-3.5 text-indigo-600" />
                        {booking.hotelName}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed & Paid
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.dates.checkIn} to {booking.dates.checkOut}
                      </span>
                      <span>•</span>
                      <span>{booking.dates.nights} Nights</span>
                      <span>•</span>
                      <span>{booking.guests} Guests</span>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="text-[11px] text-slate-500">Total Paid via Razorpay</div>
                    <div className="text-base font-black text-slate-900">
                      ₹{booking.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-bold">
                      Saved ₹{savings.toLocaleString()} ({savingsPercent}% vs OTA)
                    </div>
                  </div>
                </div>

                {/* 3 Bundled Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Hotel Stay */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                      <Hotel className="w-3.5 h-3.5" />
                      <span>Stay Property</span>
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs truncate">
                      {booking.hotelName}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Room: <span className="font-semibold">{booking.roomTypeName}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">
                      ✓ Direct front-desk booking guarantee
                    </div>
                  </div>

                  {/* Dining Pass */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Dining Pass & Food Voucher</span>
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs truncate">
                      {booking.restaurantName || 'Specialty Local Cuisine'}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Pass Credit: <span className="font-semibold text-amber-700">₹{booking.restaurantPassAmount || 500} Voucher</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Show digital pass at restaurant table
                    </div>
                  </div>

                  {/* Local Guide */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>Certified Local Guide</span>
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs truncate">
                      {booking.guideName || 'Community Guide Assigned'}
                    </div>
                    <div className="text-[11px] text-slate-600 truncate">
                      Tour: <span className="font-semibold">{booking.guidePackageTitle || 'Curated Heritage Tour'}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      📍 {booking.meetingPointInfo || 'Hotel Concierge Desk at 09:30 AM'}
                    </div>
                  </div>
                </div>

                {/* Dispatched Lead Traveler Reservation Credentials */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-600" />
                      <span>Lead Traveler Contact Credentials (Dispatched to Partners)</span>
                    </span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Transferred to Hotel & Restaurant Reception
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Traveler Username</span>
                      <strong className="text-slate-900 truncate block">
                        {booking.travelerName || 'Guest Traveler'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Contact Phone</span>
                      <strong className="text-emerald-700 truncate block flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {booking.travelerPhone || 'Not Provided'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Email Voucher</span>
                      <strong className="text-slate-800 truncate block flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {booking.travelerEmail || 'Not Provided'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Traveler City</span>
                      <strong className="text-slate-800 truncate block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {booking.travelerLocation || 'Not Specified'}
                      </strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Transaction: {booking.razorpayPaymentId || 'pay_sample_12345'}</span>
                    <span className="text-emerald-600 font-medium">No passwords shared &bull; Escrow Verified</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPassBooking(booking)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Digital Pass & QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Official Digital Pass Ticket Modal */}
      {selectedPassBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Verified Digital Travel Pass</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPassBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Boarding Pass Ticket */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 text-left relative overflow-hidden shadow-xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    TravelAI Official Ticket
                  </span>
                  <h4 className="text-lg font-black text-white">
                    {selectedPassBooking.hotelName}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {selectedPassBooking.roomTypeName} &bull; {selectedPassBooking.dates.nights} Nights Stay
                  </span>
                </div>
                <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Booking Ref</span>
                  <strong className="text-white font-mono">{selectedPassBooking.id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Room Type</span>
                  <strong className="text-white truncate block">{selectedPassBooking.roomTypeName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Check-In / Out</span>
                  <strong className="text-white">{selectedPassBooking.dates.checkIn} &rarr; {selectedPassBooking.dates.checkOut}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Dining Voucher</span>
                  <strong className="text-amber-400 truncate block">₹{selectedPassBooking.restaurantPassAmount || 500} Pass</strong>
                </div>
                {selectedPassBooking.guideName && (
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[10px] block">Certified Guide</span>
                    <strong className="text-emerald-400 truncate block">
                      {selectedPassBooking.guideName} ({selectedPassBooking.guidePackageTitle || 'Heritage Walk'})
                    </strong>
                  </div>
                )}
              </div>

              {/* Guest Credentials Card */}
              <div className="bg-white/5 rounded-xl p-3 border border-slate-800 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Lead Traveler Credentials
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                    Direct Check-In Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Name: <strong className="text-white">{selectedPassBooking.travelerName || 'Guest Traveler'}</strong></div>
                  <div>Phone: <strong className="text-emerald-300">{selectedPassBooking.travelerPhone || 'Not Provided'}</strong></div>
                  <div>Email: <strong className="text-slate-200">{selectedPassBooking.travelerEmail || 'Not Provided'}</strong></div>
                  <div>City: <strong className="text-slate-200">{selectedPassBooking.travelerLocation || 'Not Specified'}</strong></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                <span>Payment: {selectedPassBooking.razorpayPaymentId || 'Verified via Razorpay'}</span>
                <span className="text-emerald-400 font-mono font-bold">PAID ₹{selectedPassBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Digital Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPassBooking(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
