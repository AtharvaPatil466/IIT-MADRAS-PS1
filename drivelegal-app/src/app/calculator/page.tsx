"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, RotateCcw, ExternalLink, Calculator, ShieldCheck } from "lucide-react";
import { getViolations, calculateChallan } from "@/lib/api";
import type { Violation, ChallanResult } from "@/lib/api";

const countries = ["India", "United Kingdom", "United Arab Emirates", "United States"];

const statesByCountry: Record<string, string[]> = {
  India: ["Maharashtra", "Tamil Nadu", "Delhi", "Karnataka", "Telangana"],
  "United Kingdom": ["England", "Scotland", "Wales"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  "United States": ["California", "Texas", "New York", "Florida"],
};

const vehicleTypes = ["2 Wheeler", "Car", "Commercial"];

const currencySymbol: Record<string, string> = {
  India: "₹",
  "United Kingdom": "£",
  "United States": "$",
  "United Arab Emirates": "AED ",
};

function severityColor(severity: string) {
  switch (severity) {
    case "Minor":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Serious":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "Criminal":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

export default function CalculatorPage() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedViolation, setSelectedViolation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [violationsList, setViolationsList] = useState<Violation[]>([]);
  const [isLoadingViolations, setIsLoadingViolations] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<ChallanResult | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      setIsLoadingViolations(true);
      setSelectedViolation("");
      setViolationsList([]);
      setResult(null);
      getViolations(selectedCountry, selectedState).then((data) => {
        setViolationsList(data);
        setIsLoadingViolations(false);
      });
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    setSelectedState("");
    setSelectedViolation("");
    setSelectedVehicle("");
    setViolationsList([]);
    setResult(null);
  }, [selectedCountry]);

  const filteredViolations = violationsList.filter(
    (v) =>
      !selectedVehicle ||
      v.vehicle_types.includes(selectedVehicle) ||
      v.vehicle_types.includes("All")
  );

  const canSubmit =
    selectedCountry && selectedState && selectedViolation && selectedVehicle && !isCalculating;

  const handleCalculate = async () => {
    if (!canSubmit) return;
    setIsCalculating(true);
    try {
      const res = await calculateChallan(
        `${selectedState}, ${selectedCountry}`,
        selectedViolation,
        selectedVehicle
      );
      setResult(res);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } finally {
      setIsCalculating(false);
    }
  };

  const symbol = currencySymbol[selectedCountry] || "₹";

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-white">Challan Calculator</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          Get precise legal fine estimates based on regional motor vehicle acts and current regulations.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-1">Jurisdiction</label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full select-field px-4 py-3 bg-[#060e20]/80 border-white/10"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* State/Region */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-1">Region / State</label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={!selectedCountry}
                className="w-full select-field px-4 py-3 bg-[#060e20]/80 border-white/10 disabled:opacity-20"
              >
                <option value="">Select region</option>
                {(statesByCountry[selectedCountry] || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-1">Vehicle Classification</label>
            <div className="relative">
              <select
                value={selectedVehicle}
                onChange={(e) => {
                  setSelectedVehicle(e.target.value);
                  setSelectedViolation("");
                  setResult(null);
                }}
                className="w-full select-field px-4 py-3 bg-[#060e20]/80 border-white/10"
              >
                <option value="">Select type</option>
                {vehicleTypes.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Violation */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 px-1">Traffic Violation</label>
            <div className="relative">
              {isLoadingViolations ? (
                <div className="w-full bg-[#060e20]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-500 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  Loading statutes...
                </div>
              ) : (
                <>
                  <select
                    value={selectedViolation}
                    onChange={(e) => {
                      setSelectedViolation(e.target.value);
                      setResult(null);
                    }}
                    disabled={!selectedCountry || !selectedState}
                    className="w-full select-field px-4 py-3 bg-[#060e20]/80 border-white/10 disabled:opacity-20"
                  >
                    <option value="">Select violation</option>
                    {filteredViolations.map((v) => (
                      <option key={v.code} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canSubmit}
          className="w-full mt-8 btn-primary py-4 text-base tracking-tight flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
        >
          {isCalculating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Calculator className="w-5 h-5" />
          )}
          {isCalculating ? "Consulting Statutes..." : "Calculate Legal Fine"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div ref={resultRef} className="result-enter space-y-6">
          <div className="glass-card p-8 border-blue-500/20 bg-blue-500/[0.02] shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500/70 mb-2">First Offence Liability</h3>
              <div className="flex items-baseline gap-1 text-5xl font-black text-white mb-2">
                <span className="text-2xl text-blue-500 opacity-70">{symbol}</span>
                {result.fine_first.toLocaleString()}
              </div>
              <p className="text-sm text-gray-500 font-medium italic">
                Subsequent offence: {symbol}{result.fine_repeat.toLocaleString()}
              </p>

              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Statute</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    MV Act {result.mv_section}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Settlement</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    result.compoundable 
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {result.compoundable ? "On-Spot" : "Court Appearance"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Severity</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${severityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
              </div>

              <div className="mt-8 w-full flex flex-col sm:flex-row gap-4">
                <a
                  href={result.how_to_pay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Legal Payment Portal
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
                <button
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-xl bg-blue-500/10 text-blue-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Calculation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
