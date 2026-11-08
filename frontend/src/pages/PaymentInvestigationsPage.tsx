import React from 'react';
import { CreditCard, Search, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Transaction } from '../types';

interface PaymentsProps {
  transactions: Transaction[];
}

export const PaymentInvestigationsPage: React.FC<PaymentsProps> = ({ transactions }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Payment Investigations & Ledgers</h2>
        <p className="text-xs text-slate-500">Authoritative transaction registry, gateway codes (U69, U00), and anomaly classifications</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Merchant</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Gateway Code</th>
                <th className="p-3.5">Bank RRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transactions.map((txn) => (
                <tr key={txn.transaction_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#002970]">{txn.transaction_id}</td>
                  <td className="p-3.5 font-medium">{txn.customer_id}</td>
                  <td className="p-3.5 font-medium">{txn.merchant_id}</td>
                  <td className="p-3.5 font-bold text-slate-900">₹{Number(txn.amount).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-mono text-[11px]">{txn.payment_method}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : txn.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">{txn.gateway_response_code || '-'}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{txn.bank_ref_no || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
