import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/sections/ContactForm";
import { Button } from "@/components/ui/Button";
import { BRAND, SOCIAL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NNGTW Studio for business enquiries, partnerships, or general contact.",
};

const contactLinks = [
  { label: "Email", href: `mailto:${BRAND.email}`, value: BRAND.email },
  { label: "Discord", href: SOCIAL.discord, value: "Join our community" },
  { label: "LinkedIn", href: SOCIAL.linkedin, value: "NNGTW Studio" },
  { label: "GitHub", href: SOCIAL.github, value: "nngtw-studio" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Get In Touch"
        title="Contact"
        description="Business enquiries, partnerships, career interest, or just saying hello — we'd love to hear from you."
      />

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 lg:px-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <FadeIn>
            <ContactForm />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h2 className="font-display text-xl tracking-wide text-brand-white uppercase">
                Connect
              </h2>
              <div className="mt-8 space-y-6">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.label === "Email" ? undefined : "_blank"}
                    rel={link.label === "Email" ? undefined : "noopener noreferrer"}
                    className="group block border-b border-brand-white/5 pb-6"
                  >
                    <p className="text-xs tracking-[0.2em] text-brand-grey uppercase">
                      {link.label}
                    </p>
                    <p className="mt-2 text-sm text-brand-white transition-colors group-hover:text-brand-orange">
                      {link.value}
                    </p>
                  </a>
                ))}
              </div>

              <div className="mt-12 glass-panel p-8">
                <h3 className="font-display text-sm tracking-wider text-brand-white uppercase">
                  Join Our Community
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-grey">
                  For development updates, feedback, and playtest opportunities — Discord is the best place to reach us.
                </p>
                <div className="mt-6">
                  <Button href={SOCIAL.discord} variant="discord" size="sm" external>
                    Join Discord
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
