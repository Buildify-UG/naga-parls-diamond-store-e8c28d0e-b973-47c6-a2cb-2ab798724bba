import { useState, useEffect } from "react";
import { Edit2, Check, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DEFAULT_PRODUCTS = [
  { id: 1, name: "Emerald Dream", price: 10000, dailyProfit: 3000 },
  { id: 2, name: "Sapphire Elegance", price: 15000, dailyProfit: 5500 },
  { id: 3, name: "Ruby Radiance", price: 20000, dailyProfit: 7000 },
  { id: 4, name: "Diamond Brilliance", price: 25000, dailyProfit: 9500 },
  { id: 5, name: "Crystal Crown", price: 30000, dailyProfit: 10000 },
  { id: 6, name: "Platinum Treasure", price: 50000, dailyProfit: 18000 },
  { id: 7, name: "Golden Glory", price: 75000, dailyProfit: 20000 },
  { id: 8, name: "Supreme Sovereign", price: 100000, dailyProfit: 27000 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("deposits");
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Load deposits from all users
  useEffect(() => {
    const allDeposits: any[] = [];
    const users = [
      "client@nagapearls.com",
      "admin@nagapearls.com",
      "test@example.com",
    ];

    users.forEach((user) => {
      const userDeposits = localStorage.getItem(`nagapearls_deposits_${user}`);
      if (userDeposits) {
        const parsed = JSON.parse(userDeposits);
        allDeposits.push(
          ...parsed.map((d: any) => ({ ...d, user, userEmail: user }))
        );
      }
    });

    setDeposits(allDeposits);
  }, []);

  const handleApproveDeposit = (depositId: number, userEmail: string) => {
    const updatedDeposits = deposits.map((d) => {
      if (d.id === depositId && d.user === userEmail) {
        // Add to user's wallet balance
        const currentBalance =
          parseFloat(localStorage.getItem(`nagapearls_balance_${userEmail}`) || "0") +
          d.amount;
        localStorage.setItem(
          `nagapearls_balance_${userEmail}`,
          currentBalance.toString()
        );
        return { ...d, status: "approved" };
      }
      return d;
    });

    setDeposits(updatedDeposits);

    // Update localStorage for all users
    const users = [
      "client@nagapearls.com",
      "admin@nagapearls.com",
      "test@example.com",
    ];
    users.forEach((user) => {
      const userDeposits = updatedDeposits.filter((d) => d.user === user);
      if (userDeposits.length > 0) {
        localStorage.setItem(
          `nagapearls_deposits_${user}`,
          JSON.stringify(userDeposits)
        );
      }
    });

    toast.success("Deposit approved!");
  };

  const handleRejectDeposit = (depositId: number, userEmail: string) => {
    const updatedDeposits = deposits.map((d) => {
      if (d.id === depositId && d.user === userEmail) {
        return { ...d, status: "rejected" };
      }
      return d;
    });

    setDeposits(updatedDeposits);

    // Update localStorage
    const users = [
      "client@nagapearls.com",
      "admin@nagapearls.com",
      "test@example.com",
    ];
    users.forEach((user) => {
      const userDeposits = updatedDeposits.filter((d) => d.user === user);
      if (userDeposits.length > 0) {
        localStorage.setItem(
          `nagapearls_deposits_${user}`,
          JSON.stringify(userDeposits)
        );
      }
    });

    toast.success("Deposit rejected!");
  };

  const handleSaveProduct = (product: any) => {
    if (editingProduct?.id === product.id) {
      const updated = products.map((p) =>
        p.id === product.id ? product : p
      );
      setProducts(updated);
      setEditingProduct(null);
      toast.success("Product updated!");
    }
  };

  const handleAddProduct = (product: any) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts([...products, newProduct]);
    setShowAddProduct(false);
    toast.success("Product added!");
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-purple-200 overflow-x-auto">
        {[
          { id: "deposits", label: "Pending Deposits" },
          { id: "products", label: "Manage Products" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === tab.id
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-600 hover:text-red-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deposits Tab */}
      {activeTab === "deposits" && (
        <div className="space-y-4">
          {deposits.filter((d) => d.status === "pending").length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No pending deposits</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits
                    .filter((d) => d.status === "pending")
                    .map((d) => (
                      <tr key={`${d.id}-${d.user}`} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{d.user}</td>
                        <td className="px-6 py-4 font-semibold">
                          ₦{d.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">{d.method}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {d.transactionId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleApproveDeposit(d.id, d.user)
                              }
                              className="bg-green-600 hover:bg-green-700 text-white gap-1 text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleRejectDeposit(d.id, d.user)
                              }
                              className="bg-red-600 hover:bg-red-700 text-white gap-1 text-sm"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Approved Deposits */}
          {deposits.filter((d) => d.status === "approved").length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Approved Deposits
              </h3>
              <div className="space-y-2">
                {deposits
                  .filter((d) => d.status === "approved")
                  .map((d) => (
                    <div
                      key={`${d.id}-${d.user}`}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{d.user}</p>
                        <p className="text-sm text-gray-600">
                          ₦{d.amount.toLocaleString()} via {d.method}
                        </p>
                      </div>
                      <span className="text-green-600 font-semibold">
                        Approved
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <Button
            onClick={() => setShowAddProduct(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <Button
                    onClick={() => setEditingProduct(product)}
                    variant="ghost"
                    className="p-2"
                  >
                    <Edit2 className="w-4 h-4 text-purple-600" />
                  </Button>
                </div>

                {editingProduct?.id === product.id ? (
                  <EditProductForm
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onChange={setEditingProduct}
                    onCancel={() => setEditingProduct(null)}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Daily Profit</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₦{product.dailyProfit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
}

function EditProductForm({
  product,
  onSave,
  onChange,
  onCancel,
}: {
  product: any;
  onSave: (product: any) => void;
  onChange: (product: any) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            onChange({ ...product, price: parseFloat(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Daily Profit
        </label>
        <input
          type="number"
          value={product.dailyProfit}
          onChange={(e) =>
            onChange({ ...product, dailyProfit: parseFloat(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onSave(product)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          Save
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 text-sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    dailyProfit: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.dailyProfit) {
      toast.error("Please fill all fields");
      return;
    }
    onAdd({
      name: formData.name,
      price: parseFloat(formData.price),
      dailyProfit: parseFloat(formData.dailyProfit),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Product</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Profit
            </label>
            <input
              type="number"
              value={formData.dailyProfit}
              onChange={(e) =>
                setFormData({ ...formData, dailyProfit: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Daily profit"
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
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
