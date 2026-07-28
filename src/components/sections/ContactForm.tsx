"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Topic = "general" | "support" | "business" | "press" | "career";

const TOPICS: { value: Topic; label: string }[] = [
  { value: "general", label: "General" },
  { value: "support", label: "Game support" },
  { value: "business", label: "Business" },
  { value: "press", label: "Press" },
  { value: "career", label: "Careers" },
];

const MESSAGE_LIMIT = 1000;

const FIELD_BASE =
  "w-full rounded-xl border border-brand-white/10 bg-brand-white/[0.03] px-4 py-3.5 text-sm text-brand-white outline-none transition-all duration-300 placeholder:text-brand-grey/50 focus:border-brand-orange/60 focus:bg-brand-white/[0.05]";

const LABEL_BASE =
  "mb-2 block text-xs tracking-[0.15em] text-brand-grey uppercase transition-colors duration-300";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general" as Topic,
  });

  const set = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

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

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Topic */}
      <div>
        <p className={LABEL_BASE}>What is this about?</p>
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((topic) => (
            <button
              key={topic.value}
              type="button"
              onClick={() => set("type", topic.value)}
              className={cn(
                "relative rounded-full border px-5 py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-300",
                formData.type === topic.value
                  ? "border-brand-orange/60 text-brand-orange"
                  : "border-brand-white/10 text-brand-grey hover:border-brand-white/25 hover:text-brand-white/80"
              )}
            >
              {formData.type === topic.value && (
                <motion.span
                  layoutId="contact-topic-indicator"
                  className="absolute inset-0 rounded-full bg-brand-orange/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{topic.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="name"
          label="Full name"
          placeholder="Your name"
          required
          maxLength={80}
          value={formData.name}
          onChange={(v) => set("name", v)}
          focused={focused}
          setFocused={setFocused}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={(v) => set("email", v)}
          focused={focused}
          setFocused={setFocused}
        />
      </div>

      {/* Subject */}
      <Field
        id="subject"
        label="Subject"
        placeholder="What can we help with?"
        required
        maxLength={120}
        value={formData.subject}
        onChange={(v) => set("subject", v)}
        focused={focused}
        setFocused={setFocused}
      />

      {/* Message */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor="message"
            className={cn(LABEL_BASE, focused === "message" && "text-brand-orange/70")}
          >
            Message
          </label>
          <span
            className={cn(
              "mb-2 text-xs tabular-nums transition-colors duration-300",
              formData.message.length > MESSAGE_LIMIT * 0.9
                ? "text-brand-orange"
                : "text-brand-grey/60"
            )}
          >
            {formData.message.length}/{MESSAGE_LIMIT}
          </span>
        </div>
        <textarea
          id="message"
          required
          rows={6}
          maxLength={MESSAGE_LIMIT}
          placeholder="What do you need, and what would help most?"
          value={formData.message}
          onChange={(e) => set("message", e.target.value)}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          className={cn(FIELD_BASE, "resize-none leading-relaxed")}
        />
      </div>

      {/* Submit + status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-brand-orange px-8 py-4 font-display text-sm tracking-widest whitespace-nowrap text-brand-black uppercase transition-all duration-300 hover:gap-4 hover:bg-brand-orange/90 disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Send message"}
          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <StatusNote key="success" tone="success">
              Message sent. We&apos;ll be in touch.
            </StatusNote>
          )}
          {status === "error" && (
            <StatusNote key="error" tone="error">
              Something went wrong — please email us directly.
            </StatusNote>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function StatusNote({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-2 text-sm",
        tone === "success" ? "text-green-400" : "text-red-400"
      )}
    >
      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        {tone === "success" ? (
          <polyline points="20 6 9 17 4 12" />
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        )}
      </svg>
      {children}
    </motion.p>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  maxLength,
  value,
  onChange,
  focused,
  setFocused,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  value: string;
  onChange: (v: string) => void;
  focused: string | null;
  setFocused: (f: string | null) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={cn(LABEL_BASE, focused === id && "text-brand-orange/70")}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(id)}
        onBlur={() => setFocused(null)}
        className={FIELD_BASE}
      />
    </div>
  );
}
