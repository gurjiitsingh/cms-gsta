"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProjectData {
  projectName: string;
  domain?: string;
  httpLink?: string;
  port?: string;
  firestoreProjectName?: string;
  firestoreEmail?: string;
  firestoreId?: string;
  projectEmail?: string;
  domainRegistrarLink?: string;
  hostingPanelLink?: string;
  billingPanelLink?: string;
  startDate?: string;
  domainRenewalDate?: string;
  domainUsername?: string;
  domainPassword?: string;
  fileLink?: string;
  notes?: string;
}

export default function ProjectForm() {
  const [formData, setFormData] = useState<ProjectData>({
    projectName: "",
    domain: "",
    httpLink: "",
    port: "",
    firestoreProjectName: "",
    firestoreEmail: "",
    firestoreId: "",
    projectEmail: "",
    domainRegistrarLink: "",
    hostingPanelLink: "",
    billingPanelLink: "",
    startDate: "",
    domainRenewalDate: "",
    domainUsername: "",
    domainPassword: "",
    fileLink: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName) {
      toast.error("Project Name is required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "projects"), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      toast.success("Project added successfully!");
      setFormData({
        projectName: "",
        domain: "",
        httpLink: "",
        port: "",
        firestoreProjectName: "",
        firestoreEmail: "",
        firestoreId: "",
        projectEmail: "",
        domainRegistrarLink: "",
        hostingPanelLink: "",
        billingPanelLink: "",
        startDate: "",
        domainRenewalDate: "",
        domainUsername: "",
        domainPassword: "",
        fileLink: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error adding project:", err);
      toast.error("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-md mt-6 border border-gray-100"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Add New Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Project Name *"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
          <Input
            label="Domain"
            name="domain"
            value={formData.domain || ""}
            onChange={handleChange}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="HTTPS Link"
            name="httpLink"
            value={formData.httpLink || ""}
            onChange={handleChange}
            placeholder="https://example.com"
          />
          <Input
            label="Port"
            name="port"
            value={formData.port || ""}
            onChange={handleChange}
          />
        </div>

        {/* Firestore Section */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">🔥 Firestore Details</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              label="Firestore Project Name"
              name="firestoreProjectName"
              value={formData.firestoreProjectName || ""}
              onChange={handleChange}
            />
            <Input
              label="Firestore Email"
              name="firestoreEmail"
              value={formData.firestoreEmail || ""}
              onChange={handleChange}
            />
            <Input
              label="Firestore ID"
              name="firestoreId"
              value={formData.firestoreId || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Domain & Hosting */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">🌐 Domain & Hosting</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Domain Registrar Link"
              name="domainRegistrarLink"
              value={formData.domainRegistrarLink || ""}
              onChange={handleChange}
              placeholder="https://domainprovider.com"
            />
            <Input
              label="Hosting Panel Link"
              name="hostingPanelLink"
              value={formData.hostingPanelLink || ""}
              onChange={handleChange}
              placeholder="https://hosting.com/panel"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Billing Panel Link"
              name="billingPanelLink"
              value={formData.billingPanelLink || ""}
              onChange={handleChange}
              placeholder="https://billing.com"
            />
            <Input
              label="Project Email"
              name="projectEmail"
              value={formData.projectEmail || ""}
              onChange={handleChange}
              placeholder="project@domain.com"
            />
          </div>
        </div>

        {/* Access Info */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Input
            label="Domain Username"
            name="domainUsername"
            value={formData.domainUsername || ""}
            onChange={handleChange}
          />
          <Input
            label="Domain Password"
            name="domainPassword"
            value={formData.domainPassword || ""}
            onChange={handleChange}
            type="password"
          />
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Input
            label="Start Date"
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleChange}
            type="date"
          />
          <Input
            label="Domain Renewal Date"
            name="domainRenewalDate"
            value={formData.domainRenewalDate || ""}
            onChange={handleChange}
            type="date"
          />
        </div>

        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">📎 Additional Info</h3>
          <Input
            label="File / Info Link"
            name="fileLink"
            value={formData.fileLink || ""}
            onChange={handleChange}
            placeholder="https://drive.google.com/... or https://github.com/..."
          />
          <div className="mt-3">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              placeholder="Additional information..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: InputProps) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
    />
  </div>
);
