import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Building2, Heart, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

const roles = [
  {
    id: 'admin',
    label: 'Administrator',
    desc: 'Platform management & AI monitoring',
    icon: Shield,
    color: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50',
    path: '/admin',
  },
  {
    id: 'hospital',
    label: 'Hospital / Blood Bank',
    desc: 'Manage requests, stock & predictions',
    icon: Building2,
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50',
    path: '/hospital',
  },
  {
    id: 'donor',
    label: 'Blood Donor',
    desc: 'Donate, track impact & earn rewards',
    icon: Heart,
    color: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    path: '/donor',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleDemoLogin = () => {
    if (selectedRole) {
      const role = roles.find((r) => r.id === selectedRole);
      navigate(role.path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-[45%] bg-gray-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-rose-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-2xl shadow-red-600/30">
            N
          </div>
          <h1 className="text-4xl font-black text-white mt-6">
            NIDAA <span className="font-arabic text-red-400">نداء</span>
          </h1>
          <p className="text-gray-400 mt-3 text-lg">AI-Powered Blood Donation Platform</p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">15K+</p>
              <p className="text-xs text-gray-500">Donors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">142</p>
              <p className="text-xs text-gray-500">Hospitals</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">87%</p>
              <p className="text-xs text-gray-500">AI Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md">

          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </button>

          <h2 className="text-2xl font-bold text-gray-900">Welcome to NIDAA</h2>
          <p className="text-gray-500 mt-1">Select your role to continue</p>

          {/* Role Selection */}
          <div className="grid gap-3 mt-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={clsx(
                  'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200',
                  selectedRole === role.id
                    ? 'border-red-500 bg-red-50/50 shadow-lg shadow-red-600/10'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                )}
              >
                <div className={clsx(
                  'w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shrink-0',
                  role.color
                )}>
                  <role.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{role.label}</p>
                  <p className="text-sm text-gray-500">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Login Form (decorative) */}
          {selectedRole && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue={selectedRole === 'donor' ? 'aminetiyane@gmail.com' : selectedRole === 'hospital' ? 'admin@chu-ibnsina.ma' : 'admin@nidaa.ai'}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-sm pr-10"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button onClick={handleDemoLogin} className="btn-primary w-full mt-2">
                Enter Dashboard <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Demo mode — no authentication required for prototype
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
