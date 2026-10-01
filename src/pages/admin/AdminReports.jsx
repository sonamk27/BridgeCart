import { useState } from 'react';
import { INITIAL_REPORTS_DATA } from '../../data/adminMockData';

export default function AdminReports() {
  const [timeframe, setTimeframe] = useState('MONTH');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const data = INITIAL_REPORTS_DATA;

  function handleExportReport() {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Total Applications Received,${data.monthlyVerificationSummary.totalApplicationsReceived}\n` +
      `Approved Applications,${data.monthlyVerificationSummary.approvedCount}\n` +
      `Rejected Applications,${data.monthlyVerificationSummary.rejectedCount}\n` +
      `Resubmissions,${data.monthlyVerificationSummary.resubmissionCount}\n` +
      `Families Nourished,${data.impactMetrics.totalFamiliesNourished}\n` +
      `Essential Kgs Distributed,${data.impactMetrics.essentialKilosDistributed}\n` +
      `Total Donations Inflow INR,${data.fundFlowBreakdown.donorContributionsINR}\n` +
      `Supermarket Disbursed INR,${data.fundFlowBreakdown.merchantSettlementsINR}\n` +
      `Platform Admin Cut,₹0 (100% Direct to Food)\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BridgeCart_Governance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 tracking-wide uppercase">
              Secondary Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Governance & Transparency</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verification & Impact Reports</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Review reports related to verification, donations, wallet activity and platform transparency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Current Month (September 2026)</option>
            <option value="YEAR">Year to Date (2026)</option>
          </select>

          <button
            onClick={handleExportReport}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>📥</span> Export Audit CSV
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>✓</span> Official Governance & Audit Report downloaded successfully.
        </div>
      )}

      {/* 3 Major Analytical Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar 1: Verification Throughput */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Verification Throughput</h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {data.monthlyVerificationSummary.autoGovtVerificationSuccessRate} Auto-Govt Match
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Total Applications Processed</span>
              <span className="text-base font-black text-slate-900">{data.monthlyVerificationSummary.totalApplicationsReceived}</span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-700 font-bold">Approved</span>
                <span className="font-bold">{data.monthlyVerificationSummary.approvedCount} (73.4%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '73.4%' }} />
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-rose-700 font-bold">Rejected (Ineligible / Cap exceeded)</span>
                <span className="font-bold">{data.monthlyVerificationSummary.rejectedCount} (14.0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '14%' }} />
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-amber-700 font-bold">Resubmissions Requested</span>
                <span className="font-bold">{data.monthlyVerificationSummary.resubmissionCount} (12.6%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '12.6%' }} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-slate-600">
              <span>Avg. Review Turnaround</span>
              <span className="font-bold text-slate-900">{data.monthlyVerificationSummary.avgProcessingTimeHours} Hours</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Social Impact & Nutrition Delivered */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Community Impact Metrics</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Food Security
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-900">{data.impactMetrics.totalFamiliesNourished}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Families Nourished</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-teal-700">{data.impactMetrics.essentialKilosDistributed.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Kg Food Delivered</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-indigo-700">{data.impactMetrics.childrenBeneficiaries}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Children Fed</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-purple-700">{data.impactMetrics.seniorBeneficiaries}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Seniors Supported</div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <span className="font-semibold">Zero-Hunger Verification Score:</span>
            <span className="font-black text-sm">{data.impactMetrics.zeroPovertyHungerScore}</span>
          </div>
        </div>

        {/* Pillar 3: Platform Transparency & Fund Utilization */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Transparency & Flow of Funds</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              100% Direct-to-Food
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Public Donation Inflow</span>
              <span className="font-bold text-slate-900">₹{data.fundFlowBreakdown.donorContributionsINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Disbursed to Supermarkets</span>
              <span className="font-bold text-emerald-700">₹{data.fundFlowBreakdown.merchantSettlementsINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Beneficiary Encumbrance</span>
              <span className="font-bold text-teal-700">₹{data.fundFlowBreakdown.activeBeneficiaryEncumbranceINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Platform Admin Commission</span>
              <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">₹0.00 (Zero Fee)</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-1">
            <div className="font-bold text-emerald-400">Auditor Solvency Certification</div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              Every rupee donated by shoppers at in-store checkout counters is backed by verifiable merchant itemized invoices for approved staple essentials.
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Nutritional Category */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm">Essential Food Commodities Disbursed (Weight in Kg / Liters)</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {[
            { name: 'Wheat Atta', qty: '7,840 kg', share: '42%', icon: '🌾' },
            { name: 'Rice & Pulses (Dal)', qty: '5,210 kg', share: '28%', icon: '🍚' },
            { name: 'Edible Cooking Oil', qty: '2,950 L', share: '16%', icon: '🌻' },
            { name: 'Dairy & Milk', qty: '1,620 L', share: '9%', icon: '🥛' },
            { name: 'Iodized Salt & Spices', qty: '830 kg', share: '5%', icon: '🧂' }
          ].map(item => (
            <div key={item.name} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="font-bold text-slate-900 text-sm">{item.name}</div>
              <div className="text-teal-700 font-extrabold text-xs mt-0.5">{item.qty}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{item.share} of volume</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
