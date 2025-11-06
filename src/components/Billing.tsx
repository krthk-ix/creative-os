import { useEffect, useState } from 'react';
import { Check, Zap, CreditCard, Download, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  credits_per_month: number;
  active: boolean;
}

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  plan_name: string;
  date: string;
}

export default function Billing() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<BillingPlan | null>(null);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    if (!user) return;

    try {
      const [subsResult, plansResult, invoicesResult] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('billing_plans')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: true }),
        supabase
          .from('invoices')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10),
      ]);

      if (subsResult.data) {
        setSubscription(subsResult.data);
        const planResult = await supabase
          .from('billing_plans')
          .select('*')
          .eq('id', subsResult.data.plan_id)
          .maybeSingle();

        if (planResult.data) {
          setCurrentPlan(planResult.data);
        }
      }

      setPlans(plansResult.data || []);
      setInvoices(invoicesResult.data || []);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (_planId: string) => {
    alert('Upgrade functionality would be connected to payment processor');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading billing information...</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Billing</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Manage your subscription and billing</p>
        </div>

        {currentPlan && (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mb-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{currentPlan.name} Plan</h2>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium">Active</span>
                </div>
                <p className="text-white/80 text-sm">{currentPlan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${currentPlan.price}</div>
                <div className="text-white/60 text-xs">per {currentPlan.interval}</div>
              </div>
            </div>
            {subscription && (
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span>Started: {new Date(subscription.current_period_start).toLocaleDateString()}</span>
                <span>•</span>
                <span>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</span>
                {subscription.cancel_at_period_end && (
                  <>
                    <span>•</span>
                    <span className="text-red-400">Cancels at period end</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.length === 0 ? (
              <div className="col-span-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No plans available</p>
              </div>
            ) : (
              plans.map((plan) => {
                const isCurrentPlan = currentPlan?.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border-2 p-5 transition-all ${
                      isCurrentPlan
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-900'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{plan.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">/{plan.interval}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-xs">
                        <Zap size={12} className="text-brand flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {plan.credits_per_month} credits per month
                        </span>
                      </div>
                      {plan.features && plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <Check size={12} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        isCurrentPlan
                          ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                      }`}
                    >
                      {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Billing History</h2>
          {invoices.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
              <CreditCard className="mx-auto mb-3 text-gray-300 dark:text-gray-700" size={32} />
              <p className="text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Invoice</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Plan</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-200 dark:border-gray-800 last:border-0">
                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-white font-medium">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                          {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                          {invoice.plan_name}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-900 dark:text-white font-medium">
                          ${invoice.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          }`}>
                            {invoice.status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <Download size={12} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
