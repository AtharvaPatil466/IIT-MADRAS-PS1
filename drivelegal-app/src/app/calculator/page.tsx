"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, RotateCcw, ExternalLink } from "lucide-react";
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
      return "bg-yellow-100 text-yellow-800";
    case "Serious":
      return "bg-orange-100 text-orange-800";
    case "Criminal":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch violations when country + state are selected
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

  // Reset state when country changes
  useEffect(() => {
    setSelectedState("");
    setSelectedViolation("");
    setSelectedVehicle("");
    setViolationsList([]);
    setResult(null);
  }, [selectedCountry]);

  // Filter violations by selected vehicle type
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
      // Scroll to result after render
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSelectedState("");
    setSelectedViolation("");
    setSelectedVehicle("");
    setViolationsList([]);
    setResult(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const symbol = currencySymbol[selectedCountry] || "₹";

  return (
    <div className="max-w-lg mx-auto">
      {/* Form Card */}
      <div ref={formRef} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Challan Calculator</h1>
        <p className="text-sm text-gray-500 mb-6">
          Select your location and violation to see the exact fine amount.
        </p>

        <div className="space-y-4">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* State/Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State / Region</label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={!selectedCountry}
                className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select state / region</option>
                {(statesByCountry[selectedCountry] || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
            <div className="relative">
              <select
                value={selectedVehicle}
                onChange={(e) => {
                  setSelectedVehicle(e.target.value);
                  setSelectedViolation("");
                  setResult(null);
                }}
                className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Violation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Violation</label>
            <div className="relative">
              {isLoadingViolations ? (
                <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading violations...
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
                    className="w-full appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select violation</option>
                    {filteredViolations.map((v) => (
                      <option key={v.code} value={v.name}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleCalculate}
            disabled={!canSubmit}
            className="w-full bg-blue-600 text-white font-medium text-sm rounded-lg py-2.5 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isCalculating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isCalculating ? "Calculating..." : "Calculate Fine"}
          </button>
        </div>
      </div>

      {/* Results Card */}
      {result && (
        <div ref={resultRef} className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Fine amount */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 mb-1">First Offence Fine</p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              {symbol}
              {result.fine_first.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Repeat offence: {symbol}
              {result.fine_repeat.toLocaleString()}
            </p>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {/* Law section */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              MV Act {result.mv_section}
            </span>

            {/* Compoundable badge */}
            {result.compoundable ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Compoundable — Pay on spot
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Non-Compoundable — Court required
              </span>
            )}

            {/* Severity tag */}
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${severityColor(result.severity)}`}
            >
              {result.severity}
            </span>
          </div>

          {/* How to pay */}
          <div className="mt-5 text-center">
            <a
              href={result.how_to_pay}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 underline hover:text-blue-800"
            >
              Pay on Parivahan
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="mt-5 w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 border border-gray-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Check another fine
          </button>
        </div>
      )}
    </div>
  );
}
