"use client";

import { useState } from "react";
import { ChevronDown, Loader2, ShieldAlert, ShieldCheck, Search, AlertCircle, Info } from "lucide-react";
import { verifyFine } from "@/lib/api";

const violations = [
  "Jumping Red Light",
  "Over-speeding",
  "Driving without Helmet",
  "Driving without Seatbelt",
  "Using Mobile while Driving",
  "No Valid Insurance"
];

export default function VerifyPage() {
  const [location, setLocation] = useState("");
  const [violation, setViolation] = useState("");
  const [amountTold, setAmountTold] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    is_correct: boolean;
    actual_amount: number;
    difference: number;
  } | null>(null);

  const handleVerify = async () => {
    if (!location || !violation || !amountTold) return;
    setIsLoading(true);
    try {
      const res = await verifyFine(location, violation, Number(amountTold));
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = location.trim() && violation && amountTold.trim();

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-3">
          Scam Checker
        </h1>
        <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
          Verify if the fine amount demanded by authorities aligns with the official legal schedule.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-8 border-white/5 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-3xl -ml-16 -mt-16 pointer-events-none" />
        
        <div className="space-y-5">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Enforcement Location</label>
            <div className="relative group">
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setResult(null);
                }}
                placeholder="e.g. Delhi"
                className="w-full input-field pl-12 pr-4 py-3.5 bg-[#060e20]/80 border-white/10 group-focus-within:border-blue-500/50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
          </div>

          {/* Violation Dropdown */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Specific Infraction</label>
            <div className="relative">
              <select
                value={violation}
                onChange={(e) => {
                  setViolation(e.target.value);
                  setResult(null);
                }}
                className="w-full select-field px-4 py-3.5 bg-[#060e20]/80 border-white/10"
              >
                <option value="">Select violation type</option>
                {violations.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Amount Asked */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Amount Demanded</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-blue-500">₹</span>
              <input
                type="number"
                value={amountTold}
                onChange={(e) => {
                  setAmountTold(e.target.value);
                  setResult(null);
                }}
                placeholder="Enter amount asked"
                className="w-full input-field pl-10 pr-4 py-3.5 bg-[#060e20]/80 border-white/10 group-focus-within:border-blue-500/50"
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={!isFormValid || isLoading}
            className="w-full btn-primary py-4 text-sm tracking-widest uppercase font-black flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            {isLoading ? "Verifying Record..." : "Check Legal Validity"}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="result-enter">
          {result.is_correct ? (
            <div className="glass-card p-8 border-emerald-500/20 bg-emerald-500/[0.02] text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-emerald-500 tracking-tighter">LEGAL & FAIR</h2>
                <p className="text-gray-400 text-sm font-medium">The demanded amount matches official legal schedules.</p>
              </div>
              <div className="pt-4 border-t border-emerald-500/10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/5 text-emerald-400 text-sm font-bold border border-emerald-500/10">
                  Official Fine: ₹{result.actual_amount.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 border-red-500/30 bg-red-500/[0.02] text-center space-y-6 shadow-[0_20px_60px_rgba(239,68,68,0.1)]">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-red-500 tracking-tighter">OVERCHARGED</h2>
                <p className="text-red-400/60 text-sm font-medium">Potential non-compliance with official fine schedules detected.</p>
              </div>

              <div className="flex items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Asked</p>
                  <p className="text-lg font-bold text-gray-400 line-through decoration-red-500/50">₹{Number(amountTold).toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="text-center">
                  <p className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-1">Legal Limit</p>
                  <p className="text-2xl font-black text-white">₹{result.actual_amount.toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-white/5" />
                <div className="text-center">
                  <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Excess</p>
                  <p className="text-lg font-bold text-red-500">₹{result.difference.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center gap-3 text-red-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  Legal Advice
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-red-200/60 leading-relaxed">Do not pay the excess amount on the spot. Request a formal challan or e-challan.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-red-200/60 leading-relaxed">Note the officer&apos;s name, buckle number, or station details for documentation.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-red-200/60 leading-relaxed">You have the right to contest any discrepancy in a traffic court or portal.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <Info className="w-4 h-4 opacity-50" />
                    File Complaint
                 </button>
                 <button 
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors"
                 >
                    Check New Amount
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
