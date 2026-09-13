import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { generateWhatsAppGeneralSupportLink } from '../services/whatsappService';

const Contact: React.FC = () => {
  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-black text-kingBlue uppercase tracking-widest">GET IN TOUCH</span>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1 mb-6">Contact KING DAY Support</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <Phone className="w-8 h-8 text-kingBlue mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Helpline</h4>
              <p className="text-xs text-slate-600 mt-1">+91 9495902904</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <Mail className="w-8 h-8 text-kingPink mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Email Support</h4>
              <p className="text-xs text-slate-600 mt-1">support@king-day.shop</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <MapPin className="w-8 h-8 text-kingYellow mx-auto mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Fulfillment Hub</h4>
              <p className="text-xs text-slate-600 mt-1">Kozhikode, Kerala, India</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-green-900 text-base mb-1">Instant WhatsApp Consultation</h3>
            <p className="text-xs text-green-700 mb-4">Have questions about battery specs, Kerala delivery times, or assembly?</p>
            <a
              href={generateWhatsAppGeneralSupportLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-extrabold px-8 py-3 rounded-xl text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp (+91 9495902904)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
