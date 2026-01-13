"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  ChevronDown,
  Eye,
  MoreVertical,
  Filter,
  FileText,
  User,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  city: string | null;
  source: string;
  project_type: string;
  kitchen_size_meters: number | null;
  budget_range: string | null;
  status: string;
  status_note: string | null;
  next_followup_date: string | null;
  meeting_date: string | null;
  created_at: string;
  quotes_count?: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "חדש", color: "text-blue-700", bg: "bg-blue-100" },
  contacted: { label: "יצרנו קשר", color: "text-purple-700", bg: "bg-purple-100" },
  meeting_set: { label: "נקבעה פגישה", color: "text-orange-700", bg: "bg-orange-100" },
  meeting_done: { label: "פגישה התקיימה", color: "text-indigo-700", bg: "bg-indigo-100" },
  quote_sent: { label: "נשלחה הצעה", color: "text-cyan-700", bg: "bg-cyan-100" },
  negotiating: { label: "במו״מ", color: "text-yellow-700", bg: "bg-yellow-100" },
  won: { label: "נסגר ✓", color: "text-green-700", bg: "bg-green-100" },
  lost: { label: "אבד", color: "text-red-700", bg: "bg-red-100" },
  on_hold: { label: "בהמתנה", color: "text-gray-700", bg: "bg-gray-100" },
};

const sourceLabels: Record<string, string> = {
  website: "אתר",
  phone: "טלפון",
  referral: "המלצה",
  social: "רשתות",
  exhibition: "תערוכה",
  other: "אחר",
};

const projectLabels: Record<string, string> = {
  kitchen: "מטבח",
  closet: "ארון",
  bathroom: "אמבטיה",
  other: "אחר",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    won: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLeads(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData: Lead[]) => {
    const total = leadsData.length;
    const newCount = leadsData.filter((l) => l.status === "new").length;
    const inProgress = leadsData.filter((l) =>
      ["contacted", "meeting_set", "meeting_done", "quote_sent", "negotiating"].includes(l.status)
    ).length;
    const won = leadsData.filter((l) => l.status === "won").length;
    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;

    setStats({ total, new: newCount, inProgress, won, conversionRate });
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      lead.full_name.toLowerCase().includes(query) ||
      lead.phone.includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.city?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול לידים</h1>
          <p className="text-gray-500 mt-1">מעקב אחר פניות והזדמנויות מכירה</p>
        </div>
        <button
          onClick={() => setShowNewLeadModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          ליד חדש
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-500">סה״כ לידים</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
              <p className="text-sm text-gray-500">חדשים</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-500">בטיפול</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.won}</p>
              <p className="text-sm text-gray-500">נסגרו</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
              <p className="text-sm text-gray-500">המרה</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון, אימייל..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              הכל
            </button>
            {Object.entries(statusConfig).slice(0, 5).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">טוען...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">לא נמצאו לידים</p>
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="mt-4 text-black font-medium hover:underline"
            >
              הוסף ליד ראשון
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">לקוח</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">יצירת קשר</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">פרויקט</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">מקור</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">סטטוס</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">תאריך</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="hover:text-black">
                        <p className="font-medium text-gray-900">{lead.full_name}</p>
                        {lead.city && (
                          <p className="text-sm text-gray-500">{lead.city}</p>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          <Phone size={14} />
                        </a>
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            <Mail size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{projectLabels[lead.project_type] || lead.project_type}</p>
                      {lead.kitchen_size_meters && (
                        <p className="text-xs text-gray-500">{lead.kitchen_size_meters} מ״ר</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {sourceLabels[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`appearance-none px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            statusConfig[lead.status]?.bg || "bg-gray-100"
                          } ${statusConfig[lead.status]?.color || "text-gray-700"}`}
                        >
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/quotes/new?lead=${lead.id}`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                          title="צור הצעת מחיר"
                        >
                          <FileText size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onSuccess={() => {
            setShowNewLeadModal(false);
            fetchLeads();
          }}
        />
      )}
    </div>
  );
}

// New Lead Modal Component
function NewLeadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    source: "website",
    project_type: "kitchen",
    kitchen_size_meters: "",
    budget_range: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from("leads").insert({
        ...formData,
        kitchen_size_meters: formData.kitchen_size_meters
          ? parseFloat(formData.kitchen_size_meters)
          : null,
      });

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("שגיאה ביצירת הליד");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">ליד חדש</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                טלפון *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                עיר
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מקור
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="website">אתר</option>
                <option value="phone">טלפון</option>
                <option value="referral">המלצה</option>
                <option value="social">רשתות חברתיות</option>
                <option value="exhibition">תערוכה</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סוג פרויקט
              </label>
              <select
                value={formData.project_type}
                onChange={(e) =>
                  setFormData({ ...formData, project_type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="kitchen">מטבח</option>
                <option value="closet">ארון</option>
                <option value="bathroom">אמבטיה</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                גודל (מ״ר)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.kitchen_size_meters}
                onChange={(e) =>
                  setFormData({ ...formData, kitchen_size_meters: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תקציב משוער
              </label>
              <input
                type="text"
                placeholder="לדוגמה: 50,000-80,000"
                value={formData.budget_range}
                onChange={(e) =>
                  setFormData({ ...formData, budget_range: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הערות
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "שומר..." : "צור ליד"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
