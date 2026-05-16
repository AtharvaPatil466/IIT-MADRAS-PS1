"use client";

import { useState } from "react";
import { Search, FileText, Shield, ShieldOff, AlertTriangle, Loader2, CheckCircle2, Scale } from "lucide-react";
import { getRights } from "@/lib/api";

type RightsData = {
  documents_required: string[];
  cop_powers: string[];
  cop_cannot_demand: string[];
  dispute_steps: string[];
  payment_link: string;
};

export default function RightsPage() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rightsData, setRightsData] = useState<RightsData | null>(null);

  const handleGetInfo = async () => {
    if (!location.trim()) return;
    setIsLoading(true);
    try {
      const data = await getRights(location, "en");
      setRightsData(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 mb-2 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
          <Scale className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">Know Your Rights</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
          The law is your shield. Legal procedures vary by region—know exactly what authorities can and cannot demand during a traffic stop.
        </p>

        {/* Location Search */}
        <div className="max-w-lg mx-auto flex gap-3 mt-8">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your state or city..."
              onKeyDown={(e) => e.key === "Enter" && handleGetInfo()}
              className="w-full input-field pl-12 pr-4 py-4 bg-[#060e20]/60 border-white/10 group-focus-within:border-blue-500/50"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <button
            onClick={handleGetInfo}
            disabled={!location.trim() || isLoading}
            className="btn-primary px-8 py-4 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Consulting..." : "Consult Law"}
          </button>
        </div>
      </div>

      {rightsData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 result-enter">
          {/* Documents Required */}
          <div className="glass-card p-6 border-white/5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Documentation</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mandatory Carry List</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {rightsData.documents_required.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-300">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cop Powers */}
          <div className="glass-card p-6 border-white/5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Authority Powers</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Legal Permissions</p>
              </div>
            </div>
            <ul className="space-y-3 pt-2">
              {rightsData.cop_powers.map((power, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{power}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Police CANNOT Do */}
          <div className="glass-card p-6 border-red-500/10 bg-red-500/[0.01] space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                <ShieldOff className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white text-red-100">Protections</h2>
                <p className="text-[10px] text-red-500/50 uppercase tracking-widest font-bold">Your Safeguards</p>
              </div>
            </div>
            <ul className="space-y-3 pt-2">
              {rightsData.cop_cannot_demand.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-red-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Dispute */}
          <div className="glass-card p-6 border-orange-500/10 bg-orange-500/[0.01] space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white text-orange-100">Dispute Protocol</h2>
                <p className="text-[10px] text-orange-500/50 uppercase tracking-widest font-bold">Legal Recourse</p>
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                {rightsData.dispute_steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-black border border-orange-500/20">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-orange-100/70 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <a
                  href={rightsData.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-orange-500/10 text-orange-400 text-sm font-bold border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                >
                  Virtual Court Portal
                  <Scale className="w-4 h-4 opacity-50" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4 animate-pulse">
           <Scale className="w-12 h-12 opacity-20" />
           <p className="text-sm font-medium">Search for a location to view regional legal data</p>
        </div>
      )}
    </div>
  );
}
