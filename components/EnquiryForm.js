"use client";

import { useState } from "react";
import Button from "@/components/Button";
import InputField from "@/components/InputField";

const initialFormData = {
  name: "",
  phone: "",
  message: "",
};

export default function EnquiryForm({ carId, carTitle }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          carId: String(carId),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFeedbackType("error");
        setFeedbackMessage(result.message || "Could not send your enquiry.");
        return;
      }

      // Clear the form after a successful enquiry so the user knows it was saved.
      setFormData(initialFormData);
      setFeedbackType("success");
      setFeedbackMessage(result.message || `Your enquiry for ${carTitle} was sent successfully.`);
    } catch (error) {
      console.error("Enquiry form error:", error);
      setFeedbackType("error");
      setFeedbackMessage("Something went wrong while sending your enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Your name"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <InputField
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleInputChange}
        helperText="The dealer will use this number to contact you."
        required
      />

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={`Hi, I am interested in the ${carTitle}. Please share more details.`}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full rounded-2xl border border-[var(--color-line-strong)] bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      {feedbackMessage ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedbackType === "success"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedbackMessage}
        </p>
      ) : null}

      <Button type="submit" fullWidth className={isSubmitting ? "pointer-events-none opacity-70" : ""}>
        {isSubmitting ? "Sending enquiry..." : "Send enquiry"}
      </Button>
    </form>
  );
}
