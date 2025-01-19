"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AddQuotation() {
  //const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    quotation_details: "",
    total_cost: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: session, isPending, error: sessionError } = authClient.useSession();

  if (isPending) {
    return <div>Loading session...</div>;
  }

  if (sessionError) {
    return <div>Error loading session: {sessionError.message}</div>;
  }

  if (!session?.user) {
    return <div>Please log in to add a quotation.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8558/api/quotation/new-quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          quotation_details: formData.quotation_details, // Ensure details are valid JSON
          total_cost: parseFloat(formData.total_cost),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add quotation.");
      }

      setSuccess("Quotation added successfully!");
      setFormData({ name: "", quotation_details: "", total_cost: "" }); // Reset form
    } catch (err) {
        console.log(err);
        
      setError(" Failed to add quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Add New Quotation</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Quotation Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="quotation_details">
              Quotation Details (JSON)
            </label>
            <textarea
              id="quotation_details"
              name="quotation_details"
              value={formData.quotation_details}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="total_cost">
              Total Cost
            </label>
            <input
              type="number"
              id="total_cost"
              name="total_cost"
              value={formData.total_cost}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Quotation"}
          </button>
        </form>
      </div>
    </div>
  );
}
