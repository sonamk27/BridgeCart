import { useState } from 'react';
import { INITIAL_FRAUD_ALERTS } from '../../data/adminMockData';

export default function FraudTrust({ beneficiaries, onUpdateBeneficiary }) {
  const [fraudAlerts, setFraudAlerts] = useState(INITIAL_FRAUD_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(fraudAlerts[0] || null);
  const [actionSuccess, setActionSuccess] = useState('');

  function handleToggleFreeze(alert) {
    const beneficiary = beneficiaries.find(b => b.id === alert.beneficiaryId);
    if (!beneficiary) return;

    const newFrozenState = !beneficiary.isFrozen;
    const updatedBeneficiary = {
      ...beneficiary,
      isFrozen: newFrozenState,
      freezeReason: newFrozenState ? `Admin freeze: ${alert.type}` : ''
    };

    onUpdateBeneficiary(updatedBeneficiary);

    const updatedAlerts = fraudAlerts.map(a =>
      a.id === alert.id
        ? {
            ...a,
            actionTaken: newFrozenState ? 'WALLET_FROZEN' : 'UNFROZEN_RESTORED',
            status: newFrozenState ? 'ACTIVE_INVESTIGATION' : 'RESOLVED'
          }
        : a
    );
    setFraudAlerts(updatedAlerts);

    setActionSuccess(
      newFrozenState
        ? `Account for ${beneficiary.name} has been FROZEN. Wallet redemption blocked.`
        : `Account for ${beneficiary.name} has been UNFROZEN and privileges restored.`
    );
    setTimeout(() => setActionSuccess(''), 3500);
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 tracking-wide uppercase">
              Secondary Module
            </span>
            <span className="text-xs text-slate-500 font-medium">Stage: Trust & Integrity</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fraud & Trust Monitoring</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Monitor fraud-related concerns and freeze suspected misuse when required by the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-rose-600">Active High Risk</div>
            <div className="text-xl font-bold text-rose-700">
              {fraudAlerts.filter(a => a.severity === 'HIGH').length}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <div className="text-xs font-medium text-slate-500">Frozen Wallets</div>
            <div className="text-xl font-bold text-slate-800">
              {beneficiaries.filter(b => b.isFrozen).length}
            </div>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <span>⚡</span> {actionSuccess}
        </div>
      )}

      {/* Grid: Alerts list & Evidence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alerts Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Real-Time Risk & Abuse Triggers</h3>
            <span className="text-xs text-slate-500 font-medium">{fraudAlerts.length} Flagged Events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Beneficiary</th>
                  <th className="py-2.5 px-3">Trigger Type</th>
                  <th className="py-2.5 px-3">Action State</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {fraudAlerts.map(alert => {
                  const targetBen = beneficiaries.find(b => b.id === alert.beneficiaryId);
                  const isCurrentFrozen = targetBen?.isFrozen;

                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        selectedAlert?.id === alert.id ? 'bg-slate-50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                          alert.severity === 'HIGH'
                            ? 'bg-rose-100 text-rose-800'
                            : alert.severity === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{alert.beneficiaryName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{alert.rationCardNumber}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-slate-700 font-bold">
                          {alert.type}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {isCurrentFrozen ? (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px]">
                            <span>❄️</span> WALLET FROZEN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full text-[10px]">
                            ACTIVE
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="text-teal-600 font-bold text-xs hover:underline">
                          Review →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Selected Evidence & Freeze Control Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {selectedAlert ? (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{selectedAlert.id}</span>
                    <span className="text-xs text-slate-400">• {selectedAlert.detectedAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedAlert.beneficiaryName}</h3>
                  <p className="text-xs font-mono text-slate-500">Ration Card: {selectedAlert.rationCardNumber}</p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  selectedAlert.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedAlert.severity} RISK
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description of Concern</div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {selectedAlert.description}
                </div>
              </div>

              {selectedAlert.evidence && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Automated Audit Evidence</div>
                  <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3 text-xs space-y-1.5 font-mono text-slate-800">
                    {Object.entries(selectedAlert.evidence).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold text-slate-900">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Freeze / Unfreeze */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {(() => {
                  const targetBen = beneficiaries.find(b => b.id === selectedAlert.beneficiaryId);
                  const isFrozen = targetBen?.isFrozen;

                  return (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleToggleFreeze(selectedAlert)}
                        className={`w-full py-3 rounded-xl text-xs font-extrabold text-white transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                          isFrozen
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                      >
                        <span>{isFrozen ? '🔓' : '❄️'}</span>
                        {isFrozen ? 'Unfreeze Account & Restore Redemptions' : 'Freeze Suspected Misuse Immediately'}
                      </button>

                      <p className="text-[11px] text-slate-500 text-center">
                        {isFrozen
                          ? 'Unfreezing will restore wallet redemption capabilities at all partner supermarket checkouts.'
                          : 'Freezing immediately halts in-store checkout attempts and alerts supermarket POS terminals.'}
                      </p>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-slate-400">Select an alert to inspect evidence.</div>
          )}
        </div>
      </div>
    </div>
  );
}
