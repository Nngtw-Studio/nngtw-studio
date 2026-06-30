"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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

  const inputClass =
    "w-full border border-brand-white/10 bg-transparent px-4 py-3 text-sm text-brand-white outline-none transition-colors focus:border-brand-orange";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4">
        {(["general", "business"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, type }))}
            className={cn(
              "border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors",
              formData.type === type
                ? "border-brand-orange text-brand-orange"
                : "border-brand-white/10 text-brand-grey hover:border-brand-white/20"
            )}
          >
            {type === "business" ? "Business Enquiry" : "General Contact"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs tracking-wider text-brand-grey uppercase">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center bg-brand-orange px-10 py-4 font-display text-sm tracking-widest text-brand-black uppercase transition-all hover:bg-brand-orange/90 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-400">Message sent successfully. We&apos;ll be in touch.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
