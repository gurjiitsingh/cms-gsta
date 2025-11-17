"use client";

import { useForm } from "react-hook-form";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  customerName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  serviceName: z.string().min(2),
  serviceStartDate: z.string(),
  nextRenewDate: z.string(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof schema>;

export function CustomerForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "customers"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      reset();
      alert("Customer added successfully!");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Add Customer</h2>

      <div>
        <label className="block font-medium">Customer Name</label>
        <input {...register("customerName")} className="input" />
        {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Email</label>
          <input type="email" {...register("email")} className="input" />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input {...register("phone")} className="input" />
        </div>
      </div>

      <div>
        <label className="block font-medium">Service Name</label>
        <input {...register("serviceName")} className="input" />
        {errors.serviceName && <p className="text-red-500 text-sm">{errors.serviceName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Service Start Date</label>
          <input type="date" {...register("serviceStartDate")} className="input" />
        </div>
        <div>
          <label className="block font-medium">Next Renew Date</label>
          <input type="date" {...register("nextRenewDate")} className="input" />
        </div>
      </div>

      <div>
        <label className="block font-medium">Notes</label>
        <textarea {...register("notes")} className="input" />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Add Customer
      </button>
    </form>
  );
}
