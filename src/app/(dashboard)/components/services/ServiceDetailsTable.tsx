"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

import { FaEdit } from "react-icons/fa";
import Link from "next/link";

interface ServiceData {
  id: string;
  serviceName: string;
  serviceType: string;
  providerCompany: string;
  providerUrl: string;
  providerUsername: string;
  providerPassword: string;
  serviceStartDate: string;
  nextRenewDate: string;
  basePrice: number;
  baseCurrency: string;
  baseMonths: number;
  clientPrice: number;
  clientCurrency: string;
  clientMonths: number;
  totalPaid: number;
  notes?: string;
  customerId: string;
  customerName: string;
  email: string;
}

export default function ServiceDetailsTable() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "services"));
        const data: ServiceData[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<ServiceData, "id">),
        }));
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p className="text-center py-4">Loading services...</p>;
  }

  return (
    <div className="overflow-auto max-w-full p-4">
      <table className="table-auto w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
              <th className="border px-2 py-1">Edit</th>
                <th className="border px-2 py-1">Provider Company</th>
          
            {/* <th className="border px-2 py-1">Email</th> */}
            <th className="border px-2 py-1">Service Name</th>
            <th className="border px-2 py-1">Service Type</th>
          
            <th className="border px-2 py-1">Provider URL</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Password</th>
              <th className="border px-2 py-1">Customer Name</th>
            <th className="border px-2 py-1">Start Date</th>
            <th className="border px-2 py-1">Next Renew Date</th>
            <th className="border px-2 py-1">Base Price</th>
            <th className="border px-2 py-1">Base Months</th>
            <th className="border px-2 py-1">Base Currency</th>
            <th className="border px-2 py-1">Client Price</th>
            <th className="border px-2 py-1">Client Months</th>
            <th className="border px-2 py-1">Client Currency</th>
            <th className="border px-2 py-1">Client Total Paid</th>
            <th className="border px-2 py-1">Notes</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">
       <Link href={`/dashboard/services/edit?serviceId=${service.id}`}>
        <FaEdit
          size={18}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
        />
      </Link>
    </td>
    <td className="border px-2 py-1">{service.providerCompany}</td>
            
              {/* <td className="border px-2 py-1">{service.email}</td> */}
              <td className="border px-2 py-1">{service.serviceName}</td>
              <td className="border px-2 py-1">{service.serviceType}</td>
              
              <td className="border px-2 py-1">{service.providerUrl}</td>
              <td className="border px-2 py-1">{service.providerUsername}</td>
              <td className="border px-2 py-1">{service.providerPassword}</td>
                <td className="border px-2 py-1">{service.customerName}</td>
              <td className="border px-2 py-1">{service.serviceStartDate}</td>
              <td className="border px-2 py-1">{service.nextRenewDate}</td>
              <td className="border px-2 py-1">{service.basePrice}</td>
              <td className="border px-2 py-1">{service.baseMonths}</td>
              <td className="border px-2 py-1">{service.baseCurrency}</td>
              <td className="border px-2 py-1">{service.clientPrice}</td>
              <td className="border px-2 py-1">{service.clientMonths}</td>
              <td className="border px-2 py-1">{service.clientCurrency}</td>
              <td className="border px-2 py-1">{service.totalPaid}</td>
              <td className="border px-2 py-1">{service.notes || "-"}</td>
             {/* Edit button */}
  
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
