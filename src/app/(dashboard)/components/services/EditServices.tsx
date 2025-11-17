"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
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

export function EditServiceForm() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!serviceId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "services", serviceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            ...data,
            costPerPeriod: data.costPerPeriod || 0,
            costMonths: data.costMonths || 1,
            clientPrice: data.clientPrice || 0,
            clientMonths: data.clientMonths || 1,
            totalPaid: data.totalPaid || 0,
          });
        } else {
          alert("Service not found");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId, reset]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (!serviceId) return;
    try {
      setLoading(true);
      const docRef = doc(db, "services", serviceId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      alert("Service updated successfully!");
    } catch (err) {
      console.error("Error updating service:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) return <p>No service ID provided.</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md space-y-6 max-w-3xl"
    >
      <h2 className="text-2xl font-bold text-blue-700">Edit Service</h2>

      {/* --- REUSE THE SAME FORM STRUCTURE FROM YOUR ADD FORM --- */}
      {/* Only replace the heading and button label. */}

      {/* Customer Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-blue-700">Customer Information</h3>
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
        <h3 className="text-lg font-semibold text-blue-700">Service Information</h3>
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
        <h3 className="text-lg font-semibold text-blue-700">Service Provider Details</h3>
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

      {/* Pricing Info */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-blue-700">Pricing</h3>

        {/* Client Price */}
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

      <button
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 flex items-center"
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Update Service
      </button>
    </form>
  );
}
