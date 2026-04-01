import { Link } from 'react-router-dom'
import {
  BookOpen, Gamepad2, Trophy, Shield,
  CheckCircle, ArrowRight, Star, ChevronDown,
} from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Feature data ─────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BookOpen,
    title: '10 Expert Modules',
    description: 'From budgeting basics to credit rebuilding — everything you need, explained simply.',
    color: 'text-fresh-blue',
    bg: 'bg-blue-50',
  },
  {
    icon: Gamepad2,
    title: '7 Interactive Games',
    description: 'Practice real-world financial decisions in a safe, fun environment.',
    color: 'text-gentle-purple',
    bg: 'bg-purple-50',
  },
  {
    icon: Trophy,
    title: '38 Badges to Earn',
    description: 'Track your progress with achievements that celebrate every milestone.',
    color: 'text-warm-amber',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Judgment-Free Zone',
    description: 'Built by bankruptcy attorneys who understand your journey. No shame, only support.',
    color: 'text-soft-green',
    bg: 'bg-emerald-50',
  },
]

const MODULES_PREVIEW = [
  { num: 1, title: 'Welcome & Orientation', icon: '👋' },
  { num: 2, title: 'Your Money Story', icon: '📖' },
  { num: 3, title: 'Budget Foundations', icon: '📊' },
  { num: 4, title: 'Cash Flow Mastery', icon: '✉️' },
  { num: 5, title: 'Emergency Savings', icon: '🏦' },
  { num: 6, title: 'Emotional Recovery', icon: '💚' },
  { num: 7, title: 'Credit Rebuilding', icon: '📈' },
  { num: 8, title: 'Predatory Lending Defense', icon: '🛡️' },
  { num: 9, title: 'Income Growth', icon: '🚀' },
  { num: 10, title: 'Your 12-Month Road Map', icon: '🗺️' },
]

const TESTIMONIALS = [
  {
    quote: "I went from being terrified of my finances to actually having a plan. This course changed everything.",
    name: 'Maria T.',
    detail: 'Chapter 7 graduate',
  },
  {
    quote: "The games made learning about credit scores actually fun. My kids even wanted to play!",
    name: 'James R.',
    detail: 'Chapter 13 graduate',
  },
  {
    quote: "Hariette and Sheldon made me feel like I had friends cheering me on. I'm on a 30-day streak!",
    name: 'Denise W.',
    detail: 'Chapter 7 graduate',
  },
]

// ── Landing Page ─────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ─── Top bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-fresh-blue">Fresh Start</span>
            <span className="text-sm text-gray-400 hidden xs:inline">Academy</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/academy/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/academy/register"
              className="text-sm font-semibold text-white bg-fresh-blue hover:bg-blue-600 px-4 py-2 rounded-xl transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Mascots */}
          <div className="flex justify-center gap-3 sm:gap-5 mb-6 sm:mb-8">
            <img
              src="/mascots/hariette/hariette.png"
              alt="Hariette the Hare"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border-2 border-white"
            />
            <img
              src="/mascots/sheldon/sheldon.png"
              alt="Sheldon the Tortoise"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border-2 border-white"
            />
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
            Your Fresh Start{' '}
            <span className="text-fresh-blue">Begins Here</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 mb-3 max-w-xl mx-auto leading-relaxed">
            The post-bankruptcy financial recovery course built with compassion, 
            guided by experts, and powered by fun.
          </p>

          <p className="text-sm text-gray-400 mb-8">
            40 hours · 10 modules · 7 games · Personalized for Chapter 7 & 13
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <Link
              to="/academy/register"
              className="flex items-center justify-center gap-2 bg-fresh-blue text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-600 transition-all shadow-lg shadow-blue-200/50 active:scale-[0.98]"
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 sm:px-8 py-3.5 rounded-xl font-semibold text-base sm:text-lg border border-gray-200 hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              Learn More
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-4">No credit card required to start · Cancel anytime</p>
        </div>
      </section>

      {/* ─── Social proof bar ─────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">500+</p>
            <p className="text-xs text-gray-500">Fresh starts made</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block" />
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">4.9 ★</p>
            <p className="text-xs text-gray-500">Student rating</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block" />
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">92%</p>
            <p className="text-xs text-gray-500">Completion rate</p>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block" />
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">14 days</p>
            <p className="text-xs text-gray-500">Free trial</p>
          </div>
        </div>
      </section>

      {/* ─── Features grid ────────────────────────────────────────── */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Everything you need to rebuild
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              A complete financial recovery program designed specifically for people starting over after bankruptcy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow"
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', f.bg)}>
                  <f.icon className={cn('w-6 h-6', f.color)} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Chapter path selector ────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Personalized for your path
          </h2>
          <p className="text-gray-500 mb-8 sm:mb-10 max-w-lg mx-auto">
            Choose your guide based on which bankruptcy chapter you filed. ~80% of the course is shared, with personalized advice where it matters most.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {/* Chapter 7 */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-5 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <img
                src="/mascots/hariette/hariette.png"
                alt="Hariette the Hare"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-amber-100 shadow-sm"
              />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Chapter 7</h3>
              <p className="text-sm text-amber-700 font-medium mb-2">Guided by Hariette 🐇</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Fresh start path — debt discharged, rebuilding from a clean slate.
              </p>
            </div>

            {/* Chapter 13 */}
            <div className="bg-white rounded-2xl border-2 border-teal-200 p-5 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <img
                src="/mascots/sheldon/sheldon.png"
                alt="Sheldon the Tortoise"
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-teal-100 shadow-sm"
              />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Chapter 13</h3>
              <p className="text-sm text-teal-700 font-medium mb-2">Guided by Sheldon 🐢</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Repayment plan completed — steady progress toward financial freedom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Course overview ──────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              10 modules, one transformation
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Each module builds on the last — from healing your relationship with money to creating a 12-month road map.
            </p>
          </div>

          <div className="space-y-2">
            {MODULES_PREVIEW.map(mod => (
              <div
                key={mod.num}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-100 transition-colors"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-fresh-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">{mod.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    <span className="text-fresh-blue font-bold mr-1.5">{mod.num}.</span>
                    {mod.title}
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-gray-200 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Real people, real fresh starts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-10">
            Simple, honest pricing
          </h2>

          <div className="bg-white rounded-2xl border-2 border-fresh-blue/20 shadow-lg p-6 sm:p-8">
            {/* Trial badge */}
            <div className="flex justify-center mb-4">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                14-Day Free Trial
              </span>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-gray-900">$19</span>
                <span className="text-lg text-gray-400 mb-1">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Cancel anytime · No hidden fees</p>
            </div>

            {/* What's included */}
            <ul className="space-y-3 mb-8">
              {[
                'All 10 modules (48 lessons)',
                '7 interactive financial games',
                'Personalized Ch.7 or Ch.13 path',
                'XP, badges, and streak tracking',
                'Downloadable worksheets & guides',
                'Secure, private — your data stays yours',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/academy/register"
              className="flex items-center justify-center gap-2 w-full bg-fresh-blue text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-600 transition-colors shadow-sm active:scale-[0.98]"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-3">
              No credit card required to start
            </p>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-fresh-blue to-blue-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Every expert was once a beginner
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Bankruptcy was the end of one chapter and the beginning of another. 
            Let us help you make this chapter your best one yet.
          </p>
          <Link
            to="/academy/register"
            className="inline-flex items-center gap-2 bg-white text-fresh-blue px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg active:scale-[0.98]"
          >
            Begin Your Fresh Start
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-gray-900 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <div className="text-center sm:text-left">
              <p className="text-white font-bold">Fresh Start Academy</p>
              <p className="text-gray-400 text-sm mt-1">A Diment Law Firm initiative</p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <Link to="/academy/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/academy/terms" className="hover:text-white transition-colors">Terms</Link>
              <a href="mailto:support@freshstartacademy.com" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Fresh Start Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
