"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Link from "next/link";
import { FaEdit, FaSort, FaSortUp, FaSortDown, FaTrash } from "react-icons/fa";

interface ProjectData {
  id: string;
  projectName: string;
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

type SortKey = "projectName" | "port" | "projectEmail";
type SortOrder = "asc" | "desc";

export default function ProjectDetailsTable() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("projectName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data: ProjectData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ProjectData, "id">),
        }));
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (projectId: string, projectName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete project "${projectName}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Try again.");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      Object.values(p)
        .filter((v) => v !== undefined)
        .some((v) =>
          String(v).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [projects, searchTerm]);

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      const aValue = (a[sortKey] || "").toString().toLowerCase();
      const bValue = (b[sortKey] || "").toString().toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortKey, sortOrder]);

  if (loading) return <p className="text-center py-4">Loading projects...</p>;
  if (projects.length === 0)
    return <p className="text-center py-4 text-gray-600">No projects found.</p>;

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <FaSort className="inline ml-1 text-gray-400" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="inline ml-1 text-gray-600" />
    ) : (
      <FaSortDown className="inline ml-1 text-gray-600" />
    );
  };

  return (
    <div className="overflow-auto max-w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Details</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search projects..."
        className="mb-4 px-3 py-2 border rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table-auto w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Edit</th>
            <th className="border px-2 py-1">Delete</th>
            <th
              className="border px-2 py-1 cursor-pointer"
              onClick={() => handleSort("projectName")}
            >
              Project Name {renderSortIcon("projectName")}
            </th>
            <th
              className="border px-2 py-1 cursor-pointer"
              onClick={() => handleSort("projectEmail")}
            >
              Firestore Email {renderSortIcon("projectEmail")}
            </th>
            <th className="border px-2 py-1">HTTP Link</th>
            <th
              className="border px-2 py-1 cursor-pointer"
              onClick={() => handleSort("port")}
            >
              Port {renderSortIcon("port")}
            </th>
            <th className="border px-2 py-1">Firestore Project</th>
            <th className="border px-2 py-1">Firestore ID</th>
            <th className="border px-2 py-1">Domain Registrar</th>
            <th className="border px-2 py-1">Start Date</th>
            <th className="border px-2 py-1">Domain Renewal</th>
            <th className="border px-2 py-1">Username</th>
            <th className="border px-2 py-1">Password</th>
            <th className="border px-2 py-1">File Link</th>
            <th className="border px-2 py-1">Notes</th>
          </tr>
        </thead>
        <tbody>
          {sortedProjects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="border px-2 py-1 text-center">
                <Link href={`/projects/edit?projectId=${project.id}`}>
                  <FaEdit
                    size={18}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  />
                </Link>
              </td>
              <td className="border px-2 py-1 text-center">
                <button
                  onClick={() => handleDelete(project.id, project.projectName)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Project"
                >
                  <FaTrash size={16} />
                </button>
              </td>
              <td className="border px-2 py-1">{project.projectName}</td>
              <td className="border px-2 py-1">{project.projectEmail || "-"}</td>
              <td className="border px-2 py-1">
                {project.httpLink ? (
                  <a
                    href={project.httpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {project.httpLink}
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">{project.port || "-"}</td>
              <td className="border px-2 py-1">{project.firestoreProjectName || "-"}</td>
              <td className="border px-2 py-1">{project.firestoreId || "-"}</td>
              <td className="border px-2 py-1">{project.domainRegistrar || "-"}</td>
              <td className="border px-2 py-1">{project.startDate || "-"}</td>
              <td className="border px-2 py-1">{project.domainRenewalDate || "-"}</td>
              <td className="border px-2 py-1">{project.domainUsername || "-"}</td>
              <td className="border px-2 py-1">{project.domainPassword || "-"}</td>
              <td className="border px-2 py-1">
                {project.fileLink ? (
                  <a
                    href={project.fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    File
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">{project.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
