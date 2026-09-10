import { useState, useEffect } from "react";
import {
  Gem,
  Wallet,
  TrendingUp,
  Share2,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PRODUCTS = [
  {
    id: 1,
    name: "Emerald Dream",
    price: 10000,
    dailyProfit: 3000,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Sapphire Elegance",
    price: 15000,
    dailyProfit: 5500,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Ruby Radiance",
    price: 20000,
    dailyProfit: 7000,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Diamond Brilliance",
    price: 25000,
    dailyProfit: 9500,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop",
  },
];

const REFERRAL_RATES = [
  { level: 1, percentage: 28 },
  { level: 2, percentage: 10 },
  { level: 3, percentage: 3 },
];

export default function ClientDashboard({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [referralCode, setReferralCode] = useState(
    `REF-${Math.random().toString(36).substring(7).toUpperCase()}`
  );
  const [copied, setCopied] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const savedBalance = localStorage.getItem(`nagapearls_balance_${userEmail}`);
    const savedEarnings = localStorage.getItem(`nagapearls_earnings_${userEmail}`);
    const savedDeposits = localStorage.getItem(`nagapearls_deposits_${userEmail}`);
    const savedPurchases = localStorage.getItem(`nagapearls_purchases_${userEmail}`);

    if (savedBalance) setWalletBalance(parseFloat(savedBalance));
    if (savedEarnings) setTotalEarnings(parseFloat(savedEarnings));
    if (savedDeposits) setDeposits(JSON.parse(savedDeposits));
    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
  }, [userEmail]);

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  const handleDeposit = (amount: number, method: string, txId: string) => {
    const newDeposit = {
      id: Date.now(),
      amount,
      method,
      transactionId: txId,
      status: "pending",
      date: new Date().toLocaleDateString(),
    };
    const updatedDeposits = [...deposits, newDeposit];
    setDeposits(updatedDeposits);
    localStorage.setItem(
      `nagapearls_deposits_${userEmail}`,
      JSON.stringify(updatedDeposits)
    );
    toast.success("Deposit submitted! Awaiting admin approval.");
    setShowDepositModal(false);
  };

  const handleBuyProduct = (product: any) => {
    if (walletBalance < product.price) {
      toast.error("Insufficient balance!");
      return;
    }

    const newBalance = walletBalance - product.price;
    const newEarnings = totalEarnings + product.dailyProfit;
    const newPurchase = {
      id: Date.now(),
      product: product.name,
      price: product.price,
      dailyProfit: product.dailyProfit,
      date: new Date().toLocaleDateString(),
      daysActive: 0,
    };

    setWalletBalance(newBalance);
    setTotalEarnings(newEarnings);
    setPurchases([...purchases, newPurchase]);

    localStorage.setItem(
      `nagapearls_balance_${userEmail}`,
      newBalance.toString()
    );
    localStorage.setItem(
      `nagapearls_earnings_${userEmail}`,
      newEarnings.toString()
    );
    localStorage.setItem(
      `nagapearls_purchases_${userEmail}`,
      JSON.stringify([...purchases, newPurchase])
    );

    toast.success(`Successfully purchased ${product.name}!`);
    setShowProductModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-purple-200 overflow-x-auto">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "products", label: "Products" },
          { id: "deposits", label: "Deposits" },
          { id: "referrals", label: "Referrals" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === tab.id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-purple-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Wallet Balance</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₦{walletBalance.toLocaleString()}
                  </p>
                </div>
                <Wallet className="w-12 h-12 text-purple-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">
                    ₦{totalEarnings.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-amber-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Plans</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {purchases.length}
                  </p>
                </div>
                <Gem className="w-12 h-12 text-amber-200" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowDepositModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-12 text-lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Make Deposit
            </Button>
            <Button
              onClick={() => setShowProductModal(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white h-12 text-lg"
            >
              <Gem className="w-5 h-5 mr-2" />
              Buy Plan
            </Button>
          </div>

          {/* Recent Purchases */}
          {purchases.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Active Plans
              </h3>
              <div className="space-y-2">
                {purchases.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{p.product}</p>
                      <p className="text-sm text-gray-600">
                        Daily: ₦{p.dailyProfit.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-purple-600 font-semibold">
                      {p.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 rounded p-3">
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="text-lg font-bold text-purple-600">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-xs text-gray-600">Daily</p>
                    <p className="text-lg font-bold text-green-600">
                      ₦{product.dailyProfit.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleBuyProduct(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deposits Tab */}
      {activeTab === "deposits" && (
        <div className="space-y-6">
          <Button
            onClick={() => setShowDepositModal(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            New Deposit
          </Button>

          {deposits.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-purple-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((d) => (
                    <tr key={d.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">
                        ₦{d.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{d.method}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            d.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : d.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{d.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No deposits yet</p>
            </div>
          )}
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === "referrals" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Your Referral Link
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={`${window.location.origin}?ref=${referralCode}`}
                readOnly
                className="flex-1 px-4 py-2 border border-purple-300 rounded-lg bg-gray-50"
              />
              <Button
                onClick={copyReferralLink}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REFERRAL_RATES.map((rate) => (
              <div key={rate.level} className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Level {rate.level}</p>
                <p className="text-3xl font-bold text-purple-600">
                  {rate.percentage}%
                </p>
                <p className="text-xs text-gray-500 mt-2">Commission Rate</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-900">
              <strong>How it works:</strong> Share your referral link and earn
              commissions from your referrals purchases. Level 1 (Direct): 28%,
              Level 2: 10%, Level 3: 3%.
            </p>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          onSubmit={handleDeposit}
        />
      )}

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          onClose={() => setShowProductModal(false)}
          products={PRODUCTS}
          onBuy={handleBuyProduct}
        />
      )}
    </div>
  );
}

function DepositModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (amount: number, method: string, txId: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("MTN");
  const [txId, setTxId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !txId) {
      toast.error("Please fill all fields");
      return;
    }
    onSubmit(parseFloat(amount), method, txId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Make a Deposit</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option>MTN</option>
              <option>AIRTEL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter transaction ID"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductModal({
  onClose,
  products,
  onBuy,
}: {
  onClose: () => void;
  products: any[];
  onBuy: (product: any) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select a Plan</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {products.map((p) => (
            <div key={p.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{p.name}</h4>
              <p className="text-lg font-bold text-purple-600 mt-2">
                ₦{p.price.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Daily: ₦{p.dailyProfit.toLocaleString()}
              </p>
              <Button
                onClick={() => onBuy(p)}
                className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Buy
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full mt-4"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
