"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  company: z.string().max(120).optional(),
  email: z.email("Enter a valid email."),
  phone: z.string().min(7, "Enter a phone number."),
  customerType: z.string().min(1, "Choose a customer type."),
  serviceInterest: z.string().min(1, "Choose a service."),
  location: z.string().min(2, "Enter your city or province."),
  frequency: z.string().min(1, "Choose a frequency."),
  message: z.string().min(10, "Tell us a little more."),
  consent: z.boolean().refine((value) => value, "Consent is required."),
  website: z.string().max(0).optional(),
});

type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { consent: false, website: "" },
  });

  async function submit(values: Values) {
    setState("submitting");
    const response = await fetch("/api/public/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      reset();
      setState("success");
    } else {
      setState("error");
    }
  }

  if (state === "success") return <div className="form-success"><CheckCircle2 /><h2>Request received.</h2><p>Your inquiry is saved. Our team will use the details you provided to follow up.</p><button type="button" className="text-link" onClick={() => setState("idle")}>Send another</button></div>;

  return (
    <form className="form-card" onSubmit={handleSubmit(submit)} noValidate>
      <div className="form-heading"><span className="eyebrow">Custom quote</span><h2>What can we help you clean?</h2><p>No fixed package. Tell us what you need.</p></div>
      <div className="form-grid">
        <Field label="Name" error={errors.name?.message}><input {...register("name")} autoComplete="name" /></Field>
        <Field label="Company (optional)" error={errors.company?.message}><input {...register("company")} autoComplete="organization" /></Field>
        <Field label="Email" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" /></Field>
        <Field label="Phone" error={errors.phone?.message}><input {...register("phone")} type="tel" autoComplete="tel" /></Field>
        <Field label="Customer type" error={errors.customerType?.message}><select {...register("customerType")}><option value="">Select</option><option>Fleet operator</option><option>Commercial property</option><option>Homeowner / Resident</option><option>Builder / Landlord</option><option>Other</option></select></Field>
        <Field label="Service interest" error={errors.serviceInterest?.message}><select {...register("serviceInterest")}><option value="">Select</option><option>Fleet Cleaning</option><option>Facility / Commercial Cleaning</option><option>House / Residential Cleaning</option><option>Not sure yet</option></select></Field>
        <Field label="City / Province" error={errors.location?.message}><input {...register("location")} autoComplete="address-level2" /></Field>
        <Field label="Preferred frequency" error={errors.frequency?.message}><select {...register("frequency")}><option value="">Select</option>{["One-time", "Daily", "Weekly", "Monthly", "Yearly"].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field wide label="Tell us about the job" error={errors.message?.message}><textarea {...register("message")} rows={5} /></Field>
      </div>
      <input className="honeypot" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
      <label className="consent"><input type="checkbox" {...register("consent")} />I agree that Canam may use these details to respond to my request.</label>
      {errors.consent && <p className="field-error">{errors.consent.message}</p>}
      {state === "error" && <p className="form-error" role="alert">We couldn&apos;t save the request. Please try again or call (587) 433-0000.</p>}
      <button className="button" disabled={state === "submitting"}>{state === "submitting" ? "Saving…" : "Send request"}<ArrowRight /></button>
    </form>
  );
}

function Field({ label, error, children, wide = false }: { label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={wide ? "field wide" : "field"}><span>{label}</span>{children}{error && <small className="field-error">{error}</small>}</label>;
}
