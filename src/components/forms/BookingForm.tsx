"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";

type Booking = {
  service: string;
  cleaningOptions: string[];
  frequency: string;
  location: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
  website: string;
};

const initial: Booking = { service: "", cleaningOptions: [], frequency: "", location: "", preferredDate: "", preferredTime: "", name: "", company: "", email: "", phone: "", notes: "", consent: false, website: "" };
const services = ["Fleet Cleaning", "Facility / Commercial Cleaning", "House / Residential Cleaning"];
const options: Record<string, string[]> = {
  "Fleet Cleaning": ["Regular cleaning", "Deep cleaning", "Vacuuming", "Outside wash"],
  "Facility / Commercial Cleaning": ["Office cleaning", "Warehouse cleaning", "Garbage removal", "Yard / lawn care", "General facility cleaning"],
  "House / Residential Cleaning": ["Regular house cleaning", "Move-in / move-out", "Deep cleaning", "Post-construction", "New-build cleaning"],
};

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const update = (key: keyof Booking, value: Booking[keyof Booking]) => setData((current) => ({ ...current, [key]: value }));
  const toggle = (value: string) => update("cleaningOptions", data.cleaningOptions.includes(value) ? data.cleaningOptions.filter((item) => item !== value) : [...data.cleaningOptions, value]);

  const canContinue =
    (step === 1 && data.service) ||
    (step === 2 && data.frequency) ||
    (step === 3 && data.location) ||
    (step === 4 && data.name && data.email && data.phone && data.consent) ||
    step === 5;

  async function submit() {
    setStatus("loading");
    const response = await fetch("/api/public/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setStatus(response.ok ? "success" : "error");
  }

  if (status === "success") return <div className="form-success"><CheckCircle2 /><h2>Your request is in.</h2><p>We saved your booking request. This is not a confirmed appointment yet—our team will follow up to confirm scope and availability.</p></div>;

  return (
    <div className="booking-card">
      <div className="booking-progress" aria-label={`Step ${step} of 5`}>
        {[1, 2, 3, 4, 5].map((number) => <span key={number} className={number <= step ? "active" : ""}><i>{number < step ? <Check size={13} /> : number}</i><small>{["Service", "Plan", "Location", "Contact", "Review"][number - 1]}</small></span>)}
      </div>
      <div className="booking-stage">
        {step === 1 && <><StageTitle kicker="01 / Service" title="What needs cleaning?" /><div className="choice-grid">{services.map((item) => <Choice key={item} active={data.service === item} onClick={() => { update("service", item); update("cleaningOptions", []); }}>{item}</Choice>)}</div>{data.service && <><h3 className="option-heading">Select any options that apply</h3><div className="option-pills">{options[data.service].map((item) => <Choice key={item} active={data.cleaningOptions.includes(item)} onClick={() => toggle(item)}>{item}</Choice>)}</div></>}</>}
        {step === 2 && <><StageTitle kicker="02 / Plan" title="How often do you need us?" /><div className="choice-grid frequencies">{["One-time", "Daily", "Weekly", "Monthly", "Yearly"].map((item) => <Choice key={item} active={data.frequency === item} onClick={() => update("frequency", item)}>{item}</Choice>)}</div><p className="custom-quote-note">Flexible plans available. We&apos;ll prepare a custom quote for your scope.</p></>}
        {step === 3 && <><StageTitle kicker="03 / Location" title="Where and when?" /><div className="form-grid"><label className="field wide"><span>City / Province</span><input value={data.location} onChange={(e) => update("location", e.target.value)} /></label><label className="field"><span>Preferred date</span><input type="date" value={data.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} /></label><label className="field"><span>Preferred time</span><input type="time" value={data.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} /></label></div></>}
        {step === 4 && <><StageTitle kicker="04 / Contact" title="How can we reach you?" /><div className="form-grid"><label className="field"><span>Name</span><input value={data.name} onChange={(e) => update("name", e.target.value)} /></label><label className="field"><span>Company (optional)</span><input value={data.company} onChange={(e) => update("company", e.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} /></label><label className="field"><span>Phone</span><input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} /></label><label className="field wide"><span>Notes</span><textarea rows={4} value={data.notes} onChange={(e) => update("notes", e.target.value)} /></label></div><input className="honeypot" value={data.website} onChange={(e) => update("website", e.target.value)} /><label className="consent"><input type="checkbox" checked={data.consent} onChange={(e) => update("consent", e.target.checked)} />I agree that Canam may contact me about this request.</label></>}
        {step === 5 && <><StageTitle kicker="05 / Review" title="Does everything look right?" /><dl className="review-list"><div><dt>Service</dt><dd>{data.service}</dd></div><div><dt>Options</dt><dd>{data.cleaningOptions.join(", ") || "To be discussed"}</dd></div><div><dt>Frequency</dt><dd>{data.frequency}</dd></div><div><dt>Location</dt><dd>{data.location}</dd></div><div><dt>Preferred time</dt><dd>{[data.preferredDate, data.preferredTime].filter(Boolean).join(" at ") || "Flexible"}</dd></div><div><dt>Contact</dt><dd>{data.name} · {data.email} · {data.phone}</dd></div></dl>{status === "error" && <p className="form-error">We couldn&apos;t save the request. Please try again.</p>}</>}
      </div>
      <div className="booking-actions">
        <button type="button" className="text-link" disabled={step === 1 || status === "loading"} onClick={() => setStep(step - 1)}><ArrowLeft />Back</button>
        {step < 5 ? <button type="button" className="button" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue<ArrowRight /></button> : <button type="button" className="button" disabled={status === "loading"} onClick={submit}>{status === "loading" ? "Saving…" : "Submit request"}<ArrowRight /></button>}
      </div>
    </div>
  );
}

function Choice({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return <button type="button" className={`choice ${active ? "active" : ""}`} onClick={onClick}>{children}<i>{active && <Check size={14} />}</i></button>;
}
function StageTitle({ kicker, title }: { kicker: string; title: string }) {
  return <header className="stage-title"><span className="eyebrow">{kicker}</span><h2>{title}</h2></header>;
}
