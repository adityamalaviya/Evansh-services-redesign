"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@backend/contexts/AuthContext";
import { databases, DB_ID, SERVICES_COLLECTION_ID } from "@backend/services/appwrite";
import { Query, Models } from "appwrite";
import {
  Plus,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Warning,
  Briefcase,
} from "@phosphor-icons/react";

type ServiceDocument = {
  $id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
};

export default function AdminServicesPage() {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
type ServiceDocument = Models.Document & {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.adminGetServices();
      setServices(res.services);
    } catch {
      setError("Could not load services. Please check your BFF connection.");
      const res = await databases.listDocuments(DB_ID, SERVICES_COLLECTION_ID, [
        Query.orderAsc("order"),
        Query.limit(100),
      ]);
      setServices(res.documents as unknown as ServiceDocument[]);
    } catch {
      setError("Could not load services. Please check your Appwrite database setup.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch after auth is confirmed to avoid 401 guest errors
    if (isAuthLoading || !isLoggedIn) return;
    fetchServices();
  }, [fetchServices, isAuthLoading, isLoggedIn]);
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (service: ServiceDocument) => {
    if (!confirm(`Are you sure you want to delete "${service.title}"?`)) return;
    setDeletingId(service.$id);
    try {
      await api.adminDeleteService(service.$id);
      await databases.deleteDocument(DB_ID, SERVICES_COLLECTION_ID, service.$id);
      setServices((prev) => prev.filter((s) => s.$id !== service.$id));
    } catch {
      alert("Failed to delete service. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    (s.subtitle || s.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1E1E24] flex items-center gap-2">
            <Briefcase size={26} className="text-[#14B8A6]" /> Manage Services
          </h1>
          <p className="text-slate-500 text-sm mt-1">{services.length} services offered on your website</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
            className="p-2.5 text-slate-500 hover:text-[#14B8A6] bg-white rounded-xl border border-slate-200 transition-all hover:border-teal-200"
          >
            <ArrowClockwise size={18} />
          </button>
          <Link
            href="/admin/services/new"
            className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-md shadow-teal-200/60"
          >
            <Plus size={18} weight="bold" /> Add Service
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-[#1E1E24] placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
          <Warning size={20} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Services List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#14B8A6]/30 border-t-[#14B8A6] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg font-semibold mb-2">No services found</p>
            <p className="text-slate-400 text-sm mb-6">Add your first service to get started.</p>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 bg-[#14B8A6] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0D9488] transition-all"
            >
              <Plus size={18} /> Add Service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Service</th>
                  <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-widest px-4 py-4">Image</th>
                  <th className="text-right text-xs font-bold text-slate-400 uppercase tracking-widest px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((service) => (
                  <tr key={service.$id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[#1E1E24] font-semibold text-sm leading-tight line-clamp-1">{service.title}</p>
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                          {service.subtitle || service.description || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {service.image ? (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${service.$id}`}
                          className="p-2 text-slate-400 hover:text-[#14B8A6] bg-slate-50 hover:bg-teal-50 rounded-lg transition-all border border-slate-200 hover:border-teal-200"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </Link>
                        <button
                          onClick={() => handleDelete(service)}
                          disabled={deletingId === service.$id}
                          className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-all border border-slate-200 hover:border-red-200 disabled:opacity-50"
                        >
                          {deletingId === service.$id ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                          ) : (
                            <Trash size={16} weight="bold" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
