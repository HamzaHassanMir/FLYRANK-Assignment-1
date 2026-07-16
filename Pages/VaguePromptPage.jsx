import React, { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, RadioTower } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');`;

const initialForm = { name: "", email: "", subject: "", message: "", company: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Tell us who's sending this.";
  if (!values.email.trim()) {
    errors.email = "We'll need an address to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "That email doesn't look complete.";
  }
  if (!values.message.trim()) {
    errors.message = "The message field is empty.";
  } else if (values.message.trim().length < 12) {
    errors.message = "A few more words will help us understand.";
  }
  return errors;
}

// Signal strength is a stand-in for "how much you've told us" — it fills
// as the message grows, capping out around a well-formed paragraph.
function SignalMeter({ length }) {
  const bars = 5;
  const filled = Math.min(bars, Math.ceil(length / 40));
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all duration-300"
          style={{
            height: `${8 + i * 4}px`,
            backgroundColor: i < filled ? "#C99A3E" : "#D8D2C2",
          }}
        />
      ))}
    </div>
  );
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[11px] tracking-[0.16em] uppercase"
        style={{ fontFamily: "'Space Mono', monospace", color: "#5B5546" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-[#A6432E] text-xs mt-0.5">
          <AlertCircle size={13} strokeWidth={2.5} />
          <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const inputClass = (hasError) =>
    `w-full bg-transparent border-b-2 py-2 text-[15px] outline-none transition-colors duration-200 ${
      hasError ? "border-[#A6432E]" : "border-[#C9C2AC] focus:border-[#1F2A24]"
    }`;
  const inputStyle = { fontFamily: "'Inter', sans-serif", color: "#1F2A24" };

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (values.company) return; // honeypot — silently drop bot submissions
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    // Replace this block with a real request, e.g.:
    // await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
    setTimeout(() => setStatus("sent"), 1100);
  }

  function handleReset() {
    setValues(initialForm);
    setErrors({});
    setStatus("idle");
  }

  return (
    <div className="min-h-screen w-full flex items-stretch" style={{ backgroundColor: "#14202B" }}>
      <style>{FONT_IMPORT}</style>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto">
        {/* Left: identity panel */}
        <div className="lg:w-2/5 flex flex-col justify-between px-8 py-12 lg:px-14 lg:py-16" style={{ color: "#EFE9DC" }}>
          <div>
            <div className="flex items-center gap-2 mb-10 opacity-80">
              <RadioTower size={16} strokeWidth={2} />
              <span
                className="text-[11px] tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Open channel
              </span>
            </div>
            <h1
              className="text-4xl lg:text-[2.75rem] leading-[1.1] mb-6"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Send word, and&nbsp;we'll write back.
            </h1>
            <p
              className="text-[15px] leading-relaxed opacity-75 max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A real person reads every message here. Tell us what you're working on
              and we'll reply within a couple of business days.
            </p>
          </div>

          <dl className="mt-14 lg:mt-0 space-y-5">
            <div className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 opacity-60" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] opacity-50" style={{ fontFamily: "'Space Mono', monospace" }}>Email</dt>
                <dd className="text-[15px] opacity-90" style={{ fontFamily: "'Inter', sans-serif" }}>hello@yourstudio.com</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 opacity-60" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] opacity-50" style={{ fontFamily: "'Space Mono', monospace" }}>Studio</dt>
                <dd className="text-[15px] opacity-90" style={{ fontFamily: "'Inter', sans-serif" }}>Lahore, Pakistan · remote-friendly</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 opacity-60" />
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] opacity-50" style={{ fontFamily: "'Space Mono', monospace" }}>Response time</dt>
                <dd className="text-[15px] opacity-90" style={{ fontFamily: "'Inter', sans-serif" }}>1–2 business days</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Right: form panel */}
        <div className="lg:w-3/5 flex items-center px-6 py-10 lg:px-14 lg:py-16">
          <div
            className="w-full rounded-md p-8 lg:p-12 shadow-2xl"
            style={{ backgroundColor: "#F4F0E4" }}
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center text-center py-10">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ backgroundColor: "#E4DCC4" }}
                >
                  <CheckCircle2 size={28} color="#3F6B63" strokeWidth={2} />
                </div>
                <h2
                  className="text-2xl mb-2"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: "#1F2A24" }}
                >
                  Message received.
                </h2>
                <p className="text-sm max-w-xs opacity-70 mb-8" style={{ fontFamily: "'Inter', sans-serif", color: "#1F2A24" }}>
                  Thanks, {values.name.split(" ")[0] || "there"} — we'll reply to {values.email} soon.
                </p>
                <button
                  onClick={handleReset}
                  className="text-[13px] uppercase tracking-[0.14em] underline underline-offset-4"
                  style={{ fontFamily: "'Space Mono', monospace", color: "#5B5546" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div
                  className="text-[11px] uppercase tracking-[0.18em] mb-8"
                  style={{ fontFamily: "'Space Mono', monospace", color: "#8A8266" }}
                >
                  Contact form
                </div>

                {/* honeypot — hidden from real people */}
                <input
                  type="text"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <Field label="Name" htmlFor="name" error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="Jordan Malik"
                      className={inputClass(errors.name)}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="jordan@email.com"
                      className={inputClass(errors.email)}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="mb-6">
                  <Field label="Subject (optional)" htmlFor="subject">
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={values.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className={inputClass(false)}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="mb-2">
                  <Field label="Message" htmlFor="message" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={handleChange}
                      placeholder="Tell us a bit about what you need."
                      className={inputClass(errors.message) + " resize-none"}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span
                    className="text-[11px] uppercase tracking-[0.14em]"
                    style={{ fontFamily: "'Space Mono', monospace", color: "#8A8266" }}
                  >
                    Signal strength
                  </span>
                  <SignalMeter length={values.message.length} />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm text-[13px] uppercase tracking-[0.16em] transition-opacity duration-200 disabled:opacity-60"
                  style={{ fontFamily: "'Space Mono', monospace", backgroundColor: "#1F2A24", color: "#F4F0E4" }}
                >
                  {status === "sending" ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send size={14} />
                      Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}