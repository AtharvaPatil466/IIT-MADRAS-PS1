"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
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
    <div className="max-w-md mx-auto">
      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Scam Checker</h1>
        <p className="text-sm text-gray-500 mb-6">
          Find out if the fine amount you were told matches official records.
        </p>

        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setResult(null);
              }}
              placeholder="e.g. Delhi"
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Violation Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Violation</label>
            <div className="relative">
              <select
                value={violation}
                onChange={(e) => {
                  setViolation(e.target.value);
                  setResult(null);
                }}
                className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select violation</option>
                {violations.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Amount Asked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount Asked</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={amountTold}
                onChange={(e) => {
                  setAmountTold(e.target.value);
                  setResult(null);
                }}
                placeholder="Amount cop asked for"
                className="w-full bg-gray-100 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={!isFormValid || isLoading}
            className="w-full mt-2 bg-blue-600 text-white font-medium text-sm rounded-lg py-3 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Check if Fair
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className={`mt-6 rounded-xl border p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          result.is_correct 
            ? "bg-green-50/50 border-green-200" 
            : "bg-red-50/50 border-red-200 shadow-sm"
        }`}>
          {result.is_correct ? (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-green-700 tracking-tight mb-2">✓ FAIR</h2>
              <p className="text-green-800 font-medium">The amount asked matches official records.</p>
              <div className="mt-4 pt-4 border-t border-green-200/50">
                <p className="text-sm text-green-700">Official fine: ₹{result.actual_amount}</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-black text-red-700 tracking-tight mb-4">✗ OVERCHARGED</h2>
              
              <div className="space-y-1 mb-6">
                <p className="text-gray-500 line-through">
                  You were told: ₹{amountTold}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Actual fine: ₹{result.actual_amount}
                </p>
                <p className="text-lg font-bold text-red-600">
                  Difference: ₹{result.difference}
                </p>
              </div>

              <div className="bg-red-100/50 rounded-lg p-4 text-sm text-red-800">
                <p className="font-medium">You may have been scammed.</p>
                <p className="mt-1 opacity-90">Note the officer&apos;s ID and file a complaint via the official traffic portal.</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
