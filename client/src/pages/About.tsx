import React from 'react';
import { MapPin, Phone, ShieldCheck, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-black text-kingPink uppercase tracking-widest">ABOUT KING DAY</span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1 mb-6">
            Fun • Quality • Happiness
          </h1>

          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4">
            <p>
              Founded in <strong>Kozhikode, Kerala</strong>, <strong>KING DAY (king-day.shop)</strong> is a premier destination for high-fashion, high-performance kids electric ride-on jeeps, bikes, scooties, cycles, and toys.
            </p>
            <p>
              Our philosophy is rooted in bringing joy, safety, and luxury play experiences to children across Kerala and India. Every product in our catalog undergoes rigorous safety checks, battery audits, and component testing prior to dispatch from our central Kozhikode hub.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <MapPin className="w-6 h-6 text-kingPink flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Kozhikode Flagship Hub</h4>
                <p className="text-xs text-slate-500 mt-0.5">Central warehouse & fulfillment center in Kozhikode, Kerala 673001.</p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <Phone className="w-6 h-6 text-kingYellow flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Direct Customer Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Instant WhatsApp helpline at +91 9495902904 for all order & battery queries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
