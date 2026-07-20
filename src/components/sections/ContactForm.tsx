"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general" as "business" | "general",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "", type: "general" });
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full border bg-transparent px-4 py-3.5 text-sm text-brand-white outline-none transition-all duration-300";
  const inputBorder = "border-brand-white/10 focus:border-brand-orange/60";
  const inputBg = "focus:bg-brand-white/[0.02]";

  const labelBase = "mb-2 block text-xs tracking-[0.15em] text-brand-grey uppercase transition-colors duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Type toggle */}
      <div className="flex gap-3">
        {(["general", "business"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type }))}
            className={cn(
              "relative border px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-300",
              formData.type === type
                ? "border-brand-orange text-brand-orange"
                : "border-brand-white/10 text-brand-grey hover:border-brand-white/20 hover:text-brand-white/70"
            )}
          >
            {formData.type === type && (
              <motion.div
                layoutId="contact-type-indicator"
                className="absolute inset-0 bg-brand-orange/5"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">
              {type === "business" ? "Business Enquiry" : "General Contact"}
            </span>
          </button>
        ))}
      </div>

      {/* Name + Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          value={formData.name}
          onChange={(v) => setFormData((prev) => ({ ...prev, name: v }))}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(v) => setFormData((prev) => ({ ...prev, email: v }))}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className={cn(labelBase, focusedField === "subject" && "text-brand-orange/70")}
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          onFocus={() => setFocusedField("subject")}
          onBlur={() => setFocusedField(null)}
          className={cn(inputBase, inputBorder, inputBg)}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className={cn(labelBase, focusedField === "message" && "text-brand-orange/70")}
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField(null)}
          className={cn(inputBase, inputBorder, inputBg, "resize-none leading-relaxed")}
        />
      </div>

      {/* Submit + status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="group relative inline-flex items-center justify-center overflow-hidden bg-brand-orange px-10 py-4 font-display text-sm tracking-widest text-brand-black uppercase transition-all duration-300 hover:bg-brand-orange/90 disabled:opacity-50"
        >
          <span className="relative z-10">
            {status === "loading" ? "Sending..." : "Send Message"}
          </span>
          {status !== "loading" && (
            <span className="absolute inset-0 translate-y-full bg-brand-black/10 transition-transform duration-300 group-hover:translate-y-0" />
          )}
        </button>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-green-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Message sent. We&apos;ll be in touch.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-sm text-red-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Something went wrong. Please try again or email us directly.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* ── Sub-component: animated text field ─────────────────────────────────── */

function Field({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  focusedField,
  setFocusedField,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  focusedField: string | null;
  setFocusedField: (f: string | null) => void;
}) {
  const labelBase = "mb-2 block text-xs tracking-[0.15em] text-brand-grey uppercase transition-colors duration-300";
  const inputBase =
    "w-full border bg-transparent px-4 py-3.5 text-sm text-brand-white outline-none transition-all duration-300";

  return (
    <div>
      <label htmlFor={id} className={cn(labelBase, focusedField === id && "text-brand-orange/70")}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocusedField(id)}
        onBlur={() => setFocusedField(null)}
        className={cn(
          inputBase,
          "border-brand-white/10 focus:border-brand-orange/60 focus:bg-brand-white/[0.02]"
        )}
      />
    </div>
  );
}
