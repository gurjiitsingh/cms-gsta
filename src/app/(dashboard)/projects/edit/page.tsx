"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProjectData {
  projectName: string;
  domain?: string;
  httpLink?: string;
  port?: string;
  firestoreProjectName?: string;
  projectEmail?: string;
  firestoreId?: string;
  domainRegistrar?: string;
  startDate?: string;
  domainRenewalDate?: string;
  domainUsername?: string;
  domainPassword?: string;
  notes?: string;
  fileLink?: string;
}

export default function EditProjectForm() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectData>({
    projectName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const docRef = doc(db, "projects", projectId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFormData(snap.data() as ProjectData);
        } else {
          toast.error("Project not found.");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    if (!formData.projectName.trim()) {
      toast.error("Project name is required.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "projects", projectId), formData);
      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-500">Loading project details...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Domain & HTTPS Link */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Domain</label>
            <input
              type="text"
              name="domain"
              value={formData.domain || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">HTTPS Link</label>
            <input
              type="text"
              name="httpLink"
              value={formData.httpLink || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Firestore Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Firestore Project Name
            </label>
            <input
              type="text"
              name="firestoreProjectName"
              value={formData.firestoreProjectName || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Firestore Email
            </label>
            <input
              type="email"
              name="projectEmail"
              value={formData.projectEmail || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Firestore ID
            </label>
            <input
              type="text"
              name="firestoreId"
              value={formData.firestoreId || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Registrar & Credentials */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domain Registrar Link
            </label>
            <input
              type="text"
              name="domainRegistrar"
              value={formData.domainRegistrar || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              placeholder="https://registrar.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Port</label>
            <input
              type="text"
              name="port"
              value={formData.port || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Domain Renewal Date
            </label>
            <input
              type="date"
              name="domainRenewalDate"
              value={formData.domainRenewalDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Credentials */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="domainUsername"
              value={formData.domainUsername || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="text"
              name="domainPassword"
              value={formData.domainPassword || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* File & Notes */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">File Link</label>
          <input
            type="text"
            name="fileLink"
            value={formData.fileLink || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="https://docs.google.com/..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 rounded-lg text-white transition ${
              saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Update Project"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
