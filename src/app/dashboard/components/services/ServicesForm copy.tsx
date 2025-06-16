"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

// Validation schema
const schema = z.object({
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  email: z.string().email(),

  serviceName: z.string().min(2),
  notes: z.string().optional(),
  serviceType: z.string().min(1),

  providerCompany: z.string().min(1),
  providerUrl: z.string().url(),
  providerUsername: z.string().min(1),
  providerPassword: z.string().min(1),

  serviceStartDate: z.string(),
  nextRenewDate: z.string(),

  costPerPeriod: z.number().positive(),
  costCurrency: z.string().min(1),
  costMonths: z.number().min(1).max(48),

  clientPrice: z.number().positive(),
  clientCurrency: z.string().min(1),
  clientMonths: z.number().min(1).max(48),

  totalPaid: z.number().nonnegative(),
});

type ServiceFormValues = z.infer<typeof schema>;

export function ServiceForm() {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId") || "";
  const email = searchParams.get("email") || "";
  const customerName = searchParams.get("name") || "";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId,
      customerName,
      email,
    },
  });

  useEffect(() => {
    setValue("customerId", customerId);
    setValue("customerName", customerName);
    setValue("email", email);
  }, [customerId, customerName, email, setValue]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "services"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      reset();
      alert("Service added successfully!");
    } catch (err) {
      console.error("Error adding service:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-3xl"
    >
      <h2 className="text-2xl font-bold text-green-700">Add New Service</h2>

      {/* Customer Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-green-700">Customer Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block font-semibold">Customer Name</label>
            <input {...register("customerName")} className="input bg-gray-200" readOnly />
          </div>
          <div>
            <label className="block font-semibold">Customer ID</label>
            <input {...register("customerId")} className="input bg-gray-200" readOnly />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input {...register("email")} className="input bg-gray-200" readOnly />
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-green-700">Service Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block font-semibold">Service Name</label>
            <input {...register("serviceName")} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Service Type</label>
            <input
              list="service-types"
              {...register("serviceType")}
              className="input"
              placeholder="e.g., Email, Hosting..."
            />
            <datalist id="service-types">
              <option value="Email" />
              <option value="Hosting" />
              <option value="Domain" />
              <option value="Web App" />
            </datalist>
          </div>
        </div>
        <div className="mt-4">
          <label className="block font-semibold">Notes / Description</label>
          <textarea {...register("notes")} className="input" rows={3} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold">Start Date</label>
            <input type="date" {...register("serviceStartDate")} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Next Renew Date</label>
            <input type="date" {...register("nextRenewDate")} className="input" />
          </div>
        </div>
      </div>

      {/* Provider Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-green-700">Service Provider Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block font-semibold">Provider Company</label>
            <input {...register("providerCompany")} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Provider URL</label>
            <input type="url" {...register("providerUrl")} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Username</label>
            <input {...register("providerUsername")} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Password</label>
            <input type="password" {...register("providerPassword")} className="input" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-green-700">Pricing</h3>

        {/* Client Price Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block font-semibold">Client Price</label>
            <input type="number" step="0.01" {...register("clientPrice", { valueAsNumber: true })} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Currency</label>
            <select {...register("clientCurrency")} className="input">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Months</label>
            <select {...register("clientMonths", { valueAsNumber: true })} className="input">
              {Array.from({ length: 48 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Paid */}
        <div className="mt-4">
          <label className="block font-semibold">Total Paid by Client</label>
          <input type="number" step="0.01" {...register("totalPaid", { valueAsNumber: true })} className="input" />
        </div>

        {/* Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-semibold">Base Cost</label>
            <input type="number" step="0.01" {...register("costPerPeriod", { valueAsNumber: true })} className="input" />
          </div>
          <div>
            <label className="block font-semibold">Currency</label>
            <select {...register("costCurrency")} className="input">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Months</label>
            <select {...register("costMonths", { valueAsNumber: true })} className="input">
              {Array.from({ length: 48 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 flex items-center"
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Add Service
      </button>
    </form>
  );
}
