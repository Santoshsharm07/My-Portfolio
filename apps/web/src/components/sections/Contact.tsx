"use client";

import { useState } from "react";
import type { SiteSettings } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { API_URL } from "@/lib/env";

import emailjs from "@emailjs/browser";

type Status = "idle" | "sending" | "sent" | "error";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_anjwxdx";
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_izhvyrs";
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "HeCXZiu-R2XzqOURM";

export function Contact({ settings }: { settings: SiteSettings | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    console.log("EmailJS Credentials runtime:", { serviceId, templateId, publicKey });
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""), // honeypot
    };

    if (payload.company) {
      // Honeypot field filled by spam bot
      setStatus("sent");
      return;
    }

    try {
      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Email service configuration is missing in environment variables.");
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: payload.name,
          name: payload.name,
          from_email: payload.email,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
        },
        publicKey
      );

      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error("EmailJS Error details:", err);
      setStatus("error");
      const msg = err?.text || err?.message || (typeof err === "string" ? err : "Something went wrong");
      setError(msg);
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      index="07 / "
      title="Let's make something unforgettable."
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-8">
          <p className="max-w-md text-lg text-ink-400">
            Have a project in mind or just want to trade ideas? My inbox is
            always open.
          </p>
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              data-cursor="hover"
              className="inline-block whitespace-nowrap font-display text-sm text-ink-50 underline-offset-8 transition-colors hover:text-accent-500 hover:underline md:text-lg"
            >
              {settings.email}
            </a>
          )}
          {settings?.socials && settings.socials.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {settings.socials.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="rounded-none border border-base-600 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink-300 transition-colors hover:border-accent-500 hover:bg-accent-500 hover:text-base-950"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <Reveal>
          {status === "sent" ? (
            <div className="card-lux flex min-h-[300px] flex-col items-center justify-center p-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center bg-accent-500 text-2xl text-base-950">
                ✓
              </div>
              <h3 className="mt-5 text-xl text-ink-50">Message sent</h3>
              <p className="mt-2 text-ink-400">
                Thanks — I'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card-lux space-y-5 p-8">
              {/* honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" label="Name" required />
                <Field name="email" label="Email" type="email" required />
              </div>
              <Field name="subject" label="Subject" />
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-ink-500">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-none border border-base-600 bg-base-900 px-4 py-3 text-ink-100 outline-none transition-colors focus:border-accent-500"
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-danger">{error}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor="hover"
                className="w-full rounded-none bg-accent-500 py-4 font-mono text-xs font-medium uppercase tracking-widest text-base-950 transition-all hover:bg-accent-400 hover:shadow-brutal-ink disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-ink-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-none border border-base-600 bg-base-900 px-4 py-3 text-ink-100 outline-none transition-colors focus:border-accent-500"
      />
    </div>
  );
}
