import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Heart, Shield, Zap, Globe, Users, ArrowRight,
  Activity, Droplets, BarChart3, Bell, Sparkles, ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

const stats = [
  { value: '1,000+', label: 'Daily Donations Needed in Morocco' },
  { value: '<1%', label: 'Effective Donor Rate' },
  { value: '87%', label: 'AI Prediction Accuracy' },
  { value: '50%', label: 'Faster Emergency Response' },
];

const features = [
  { icon: Brain, title: 'AI Demand Prediction', desc: 'MindSpore-powered forecasting predicts blood shortages before they happen, enabling proactive hospital planning.', color: 'from-red-500 to-rose-600' },
  { icon: Zap, title: 'Smart Donor Matching', desc: 'Intelligent matching considers blood compatibility, proximity, eligibility, and urgency for optimal results.', color: 'from-amber-500 to-orange-600' },
  { icon: Heart, title: 'Gamified Engagement', desc: 'Points, badges, and impact stories keep donors motivated and create a sustainable culture of giving.', color: 'from-pink-500 to-rose-600' },
  { icon: Bell, title: 'Real-Time Alerts', desc: 'Instant notifications for urgent requests via push, email, or SMS — even in low-connectivity areas.', color: 'from-blue-500 to-indigo-600' },
  { icon: BarChart3, title: 'Hospital Dashboards', desc: 'Real-time stock monitoring, shortage predictions, and geographic heat maps for decision-makers.', color: 'from-emerald-500 to-teal-600' },
  { icon: Shield, title: 'Privacy & Ethics', desc: 'Full anonymization, medical compliance, and ethical reward systems. No monetary incentives for donations.', color: 'from-purple-500 to-violet-600' },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Sign up as a donor or hospital. Quick onboarding with blood type and location.', icon: Users },
  { num: '02', title: 'AI Matches', desc: 'Our AI engine finds the best donors for each request in real time.', icon: Brain },
  { num: '03', title: 'Save Lives', desc: 'Donate, track your impact, earn rewards. Every drop makes a difference.', icon: Heart },
];

const techStack = [
  { name: 'MindSpore', desc: 'Deep Learning Framework' },
  { name: 'ModelArts', desc: 'AI Development Platform' },
  { name: 'CANN', desc: 'Compute Architecture' },
  { name: 'Huawei Cloud', desc: 'Cloud Infrastructure' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-600/20">
              N
            </div>
            <span className="text-lg font-bold text-gray-900">
              NIDAA <span className="font-arabic text-sm text-gray-400">نداء</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-gray-900 transition-colors">Technology</a>
          </div>
          <button onClick={() => navigate('/login')} className="btn-primary text-sm py-2 px-5">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-red-50 blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-50 blur-3xl opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-6">
                <Sparkles size={14} />
                Powered by Huawei MindSpore AI
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Saving Lives Through{' '}
              <span className="gradient-text">Intelligent</span>{' '}
              Technology
            </motion.h1>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl leading-relaxed">
              NIDAA connects blood donors, hospitals, and blood banks through AI-powered predictions,
              smart matching, and gamified engagement — transforming blood donation across Morocco and Africa.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => navigate('/login')} className="btn-primary text-base py-3.5 px-8">
                Start Saving Lives <ArrowRight size={18} />
              </button>
              <a href="#features" className="btn-secondary text-base py-3.5 px-8">
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              AI-Powered Features for <span className="gradient-text">Every Stakeholder</span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              From predicting shortages to motivating donors, NIDAA brings intelligence to every step of the blood donation chain.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover p-6 group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How <span className="gradient-text">NIDAA</span> Works
            </h2>
            <p className="text-gray-500 mt-4 text-lg">Three simple steps to start saving lives.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                  <s.icon size={28} className="text-red-600" />
                </div>
                <span className="text-xs font-bold text-red-400 tracking-widest uppercase">Step {s.num}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-2">{s.title}</h3>
                <p className="text-gray-500 mt-2">{s.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight size={24} className="hidden md:block absolute top-8 -right-4 text-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology ─────────────────────────────────────── */}
      <section id="technology" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Built with <span className="text-red-400">Huawei</span> Technology
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Leveraging the full Huawei AI stack for enterprise-grade performance and reliability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center mx-auto mb-3">
                  <Activity size={24} className="text-red-400" />
                </div>
                <h3 className="font-bold text-lg">{t.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Ready to <span className="gradient-text">Save Lives</span>?
            </h2>
            <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
              Join NIDAA and be part of the AI revolution in blood donation.
              Every donation counts. Every life matters.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary text-lg py-4 px-10 mt-8">
              Join NIDAA Today <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-bold text-sm">
                N
              </div>
              <div>
                <span className="font-bold">NIDAA</span>
                <span className="font-arabic text-gray-500 ml-2">نداء</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Team ESPOIR — INPT</span>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <span>Huawei ICT Competition 2026</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe size={14} />
              <span>Morocco — Built for Africa & MENA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
