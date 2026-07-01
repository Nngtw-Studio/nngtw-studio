"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND_ASSETS } from "@/lib/brand";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src={BRAND_ASSETS.primaryLogo}
            alt="Nngtw Studio"
            className="mx-auto h-16 w-auto"
          />
          <p className="mt-4 text-xs tracking-[0.3em] text-brand-grey uppercase">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="border border-brand-white/5 p-8">
          <div className="mb-6">
            <label htmlFor="email" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none focus:border-brand-orange"
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange py-3 font-display text-sm tracking-widest text-brand-black uppercase transition-colors hover:bg-brand-orange/90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
