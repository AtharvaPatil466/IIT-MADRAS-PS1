"use client";

import { useState } from "react";
import { Search, FileText, Shield, ShieldOff, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
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
    <div className="max-w-2xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Know Your Rights</h1>
        <p className="text-gray-600 mb-6">
          Traffic rules and procedures vary by region. Enter your state or city to see exactly what authorities can and cannot do.
        </p>

        {/* Location Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter state or city (e.g. Maharashtra)"
              onKeyDown={(e) => e.key === "Enter" && handleGetInfo()}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={handleGetInfo}
            disabled={!location.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Get Info
          </button>
        </div>
      </div>

      {rightsData && (
        <div className="space-y-6">
          {/* Documents Required */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Documents Required</h2>
            </div>
            <ul className="space-y-3">
              {rightsData.documents_required.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Police CAN Do */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">What Police CAN Do</h2>
            </div>
            <ul className="space-y-3">
              {rightsData.cop_powers.map((power, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-blue-900">{power}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Police CANNOT Do */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <ShieldOff className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">What Police CANNOT Do</h2>
            </div>
            <ul className="space-y-3">
              {rightsData.cop_cannot_demand.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <span className="text-red-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to Dispute */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">How to Dispute</h2>
            </div>
            <ol className="space-y-4 mb-6">
              {rightsData.dispute_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-semibold text-gray-700 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700 mt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <a
              href={rightsData.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Access Virtual Court Portal
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
