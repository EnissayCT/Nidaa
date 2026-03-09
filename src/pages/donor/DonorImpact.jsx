import { Heart, Users, Syringe, Baby, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { impactData, currentDonor } from '../../data/mockData';

export default function DonorImpact() {
  const impactStats = [
    { label: 'Lives Helped', value: impactData.livesHelped, icon: Heart, color: 'from-red-500 to-rose-600' },
    { label: 'Emergencies Resolved', value: impactData.emergenciesResolved, icon: Syringe, color: 'from-amber-500 to-orange-600' },
    { label: 'Surgeries Supported', value: impactData.surgeriesSupported, icon: Users, color: 'from-blue-500 to-indigo-600' },
    { label: 'Children Helped', value: impactData.childrenHelped, icon: Baby, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Impact Hero */}
      <div className="card p-8 bg-gradient-to-br from-red-50 to-rose-50 border-red-100 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mx-auto shadow-xl shadow-red-200">
            <Heart size={36} className="text-white" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mt-5">
            {impactData.livesHelped} Lives Helped
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Through your {currentDonor.totalDonations} donations, you've made a real difference.
            Each donation tells a story of hope and recovery.
          </p>
        </motion.div>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5 text-center"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto`}>
              <stat.icon size={22} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recipient Stories */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-amber-500" />
          <h3 className="font-semibold text-gray-900">Your Impact Stories</h3>
          <span className="text-xs text-gray-400">(Anonymized for privacy)</span>
        </div>

        <div className="space-y-4">
          {impactData.recipients.map((recipient, i) => (
            <motion.div
              key={recipient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center shrink-0">
                <Heart size={16} className="text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-semibold text-gray-900">{recipient.condition}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(recipient.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{recipient.ageGroup} · {recipient.hospital}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700">{recipient.outcome}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="card p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
        <p className="text-xl font-bold">Every Drop Counts 🩸</p>
        <p className="text-gray-400 mt-2">
          Your next eligible donation date is <strong className="text-white">{currentDonor.nextEligible}</strong>.
          Keep up the incredible work!
        </p>
      </div>
    </div>
  );
}
