import { useState, useEffect } from "react";
import { Gem, LogOut, Menu, X, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientDashboard from "@/components/ClientDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import LoginForm from "@/components/LoginForm";
import { toast } from "sonner";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("nagapearls_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setIsAdmin(user.isAdmin);
      setUserEmail(user.email);
    }
  }, []);

  const handleLogin = (email: string, isAdminUser: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
    setUserEmail(email);
    localStorage.setItem(
      "nagapearls_user",
      JSON.stringify({ email, isAdmin: isAdminUser })
    );
    setShowSignup(false);
    toast.success("Welcome to NAGA PEARLS!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserEmail("");
    localStorage.removeItem("nagapearls_user");
    setShowMobileMenu(false);
    toast.success("Logged out successfully");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gem className="w-8 h-8 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">NAGA PEARLS</h1>
            </div>
            <p className="text-purple-200 text-sm hidden md:block">
              Premium Diamond Investment Platform
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {!showSignup ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <SignupForm onSignup={handleLogin} />
            )}

            <div className="mt-6 text-center">
              <p className="text-purple-200">
                {showSignup ? "Already have an account? " : "New to NAGA PEARLS? "}
                <button
                  onClick={() => setShowSignup(!showSignup)}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition"
                >
                  {showSignup ? "Login" : "Create Account"}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-8 bg-black/40 backdrop-blur rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-amber-400 font-semibold mb-3">Demo Accounts</h3>
              <div className="space-y-3 text-sm text-purple-200">
                <div>
                  <p className="font-semibold text-white">Admin:</p>
                  <p>Email: admin@nagapearls.com</p>
                  <p>Password: admin123</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Client:</p>
                  <p>Email: client@nagapearls.com</p>
                  <p>Password: client123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-900">NAGA PEARLS</h1>
            {isAdmin && (
              <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                ADMIN
              </span>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-600">{userEmail}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 text-purple-900" />
            ) : (
              <Menu className="w-6 h-6 text-purple-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-purple-200 p-4 bg-purple-50">
            <p className="text-gray-600 mb-4">{userEmail}</p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <ClientDashboard userEmail={userEmail} />
        )}
      </main>
    </div>
  );
}

function SignupForm({ onSignup }: { onSignup: (email: string, isAdmin: boolean) => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    onSignup(formData.email, false);
    toast.success("Account created successfully!");
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-xl p-8 border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="+256..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}
