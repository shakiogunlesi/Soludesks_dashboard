"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/apiSlice";
import { setUser } from "../store/userSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading: loading }] = useLoginMutation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({
        email: form.email,
        password: form.password,
      }).unwrap();

      dispatch(setUser(result.user));

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.data ?? "Invalid email or password. Try shaki_ogunlesi@outlook.com / admin125@#"
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0d1b4b] overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1a3a8a]/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#e84c1e]/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-16">
            <Image src="/icons/logo.svg" alt="Soludesks logo" width={300} height={108} priority />
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "📚", label: "123", sub: "Total Courses" },
                { icon: "👥", label: "11", sub: "Enrollments" },
                { icon: "✅", label: "99%", sub: "Completion" },
              ].map((stat) => (
                <div key={stat.sub} className="bg-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-white font-bold text-lg">{stat.label}</div>
                  <div className="text-white/60 text-xs">{stat.sub}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { title: "Effective Workplace Communication", tag: "Soft Skill", color: "bg-blue-500/20 text-blue-300" },
                { title: "Mastering Interpersonal Skills", tag: "Compliance", color: "bg-orange-500/20 text-orange-300" },
              ].map((c) => (
                <div key={c.title} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg flex-shrink-0">
                    📖
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white text-xs font-medium leading-snug">{c.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${c.color}`}>
                      {c.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-white text-2xl font-bold mb-3">Manage Learning at Scale</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Organise courses, track progress, and empower your teams — all from one powerful dashboard.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/icons/logo.svg" alt="Soludesks logo" width={300} height={100} priority />
          </div>

          <h1 className="text-[#0d1b4b] font-bold text-3xl mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-xs text-blue-600">
            <span className="font-semibold">Demo credentials:</span>{" "}
            shaki_ogunlesi@outlook.com / admin125@#
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-xs text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0d1b4b] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="shaki_ogunlesi@outlook.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-[#0d1b4b] placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84c1e]/30 focus:border-[#e84c1e] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0d1b4b]">
                  Password
                </label>
                <Link href="#" className="text-xs text-[#e84c1e] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 text-[#0d1b4b] placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#e84c1e]/30 focus:border-[#e84c1e] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#e84c1e]" />
              <label htmlFor="remember" className="text-sm text-gray-500">Keep me signed in</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#e84c1e] text-white font-semibold text-sm hover:bg-[#d43e12] active:scale-[0.98] transition-all shadow-lg shadow-[#e84c1e]/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", icon: "G" },
              { label: "Microsoft", icon: "M" },
            ].map((provider) => (
              <button
                key={provider.label}
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                  {provider.icon}
                </span>
                {provider.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link href="#" className="text-[#e84c1e] font-semibold hover:underline">
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}