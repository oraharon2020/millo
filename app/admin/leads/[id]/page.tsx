"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  PhoneCall,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  source: string;
  source_details: string | null;
  project_type: string;
  kitchen_size_meters: number | null;
  budget_range: string | null;
  timeline: string | null;
  notes: string | null;
  status: string;
  status_note: string | null;
  next_followup_date: string | null;
  meeting_date: string | null;
  created_at: string;
  updated_at: string;
}

interface Quote {
  id: string;
  quote_number: string;
  title: string;
  total: number;
  status: string;
  created_at: string;
  sent_at: string | null;
}

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string | null;
  created_at: string;
  quote_id: string | null;
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

const activityIcons: Record<string, any> = {
  note: MessageSquare,
  call: PhoneCall,
  email: Mail,
  meeting: Users,
  quote_sent: Send,
  quote_accepted: CheckCircle,
  quote_rejected: XCircle,
  status_change: AlertCircle,
  followup: Clock,
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [editingLead, setEditingLead] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch lead
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", params.id)
        .single();

      if (leadError) throw leadError;
      setLead(leadData);

      // Fetch quotes
      const { data: quotesData } = await supabase
        .from("quotes")
        .select("id, quote_number, title, total, status, created_at, sent_at")
        .eq("lead_id", params.id)
        .order("created_at", { ascending: false });

      setQuotes(quotesData || []);

      // Fetch activities
      const { data: activitiesData } = await supabase
        .from("lead_activities")
        .select("*")
        .eq("lead_id", params.id)
        .order("created_at", { ascending: false });

      setActivities(activitiesData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!lead) return;

    try {
      // Update lead
      await supabase
        .from("leads")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", lead.id);

      // Add activity
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: "status_change",
        title: `סטטוס שונה ל: ${statusConfig[newStatus]?.label || newStatus}`,
      });

      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addActivity = async (type: string, title: string, description?: string) => {
    if (!lead) return;

    try {
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        activity_type: type,
        title,
        description,
      });

      fetchData();
      setShowAddActivity(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteLead = async () => {
    if (!lead || !confirm("האם למחוק את הליד? פעולה זו לא ניתנת לביטול.")) return;

    try {
      await supabase.from("leads").delete().eq("id", lead.id);
      router.push("/admin/leads");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("he-IL", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">טוען...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">הליד לא נמצא</p>
        <Link href="/admin/leads" className="text-black font-medium hover:underline mt-2 inline-block">
          חזור לרשימת הלידים
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/leads"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{lead.full_name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusConfig[lead.status]?.bg
                } ${statusConfig[lead.status]?.color}`}
              >
                {statusConfig[lead.status]?.label}
              </span>
            </div>
            <p className="text-gray-500 mt-1">נוצר ב-{formatDate(lead.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/quotes/new?lead=${lead.id}`}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
          >
            <FileText size={18} />
            צור הצעת מחיר
          </Link>
          <button
            onClick={deleteLead}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">פרטי התקשרות</h2>
              <button
                onClick={() => setEditingLead(true)}
                className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
              >
                <Edit size={14} />
                עריכה
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">טלפון</p>
                  <a href={`tel:${lead.phone}`} className="font-medium hover:text-green-600">
                    {lead.phone}
                  </a>
                </div>
              </div>

              {lead.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">אימייל</p>
                    <a href={`mailto:${lead.email}`} className="font-medium hover:text-blue-600">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}

              {(lead.address || lead.city) && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">כתובת</p>
                    <p className="font-medium">
                      {[lead.address, lead.city].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">פרטי הפרויקט</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">סוג פרויקט</p>
                <p className="font-medium">
                  {lead.project_type === "kitchen"
                    ? "מטבח"
                    : lead.project_type === "closet"
                    ? "ארון"
                    : lead.project_type === "bathroom"
                    ? "אמבטיה"
                    : "אחר"}
                </p>
              </div>

              {lead.kitchen_size_meters && (
                <div>
                  <p className="text-sm text-gray-500">גודל</p>
                  <p className="font-medium">{lead.kitchen_size_meters} מ״ר</p>
                </div>
              )}

              {lead.budget_range && (
                <div>
                  <p className="text-sm text-gray-500">תקציב</p>
                  <p className="font-medium">₪{lead.budget_range}</p>
                </div>
              )}

              {lead.timeline && (
                <div>
                  <p className="text-sm text-gray-500">לו״ז</p>
                  <p className="font-medium">{lead.timeline}</p>
                </div>
              )}
            </div>

            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">הערות</p>
                <p className="text-gray-700 whitespace-pre-line">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">הצעות מחיר</h2>
              <Link
                href={`/admin/quotes/new?lead=${lead.id}`}
                className="text-sm text-black font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} />
                הצעה חדשה
              </Link>
            </div>

            {quotes.length === 0 ? (
              <p className="text-gray-500 text-center py-6">אין הצעות מחיר עדיין</p>
            ) : (
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="block p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{quote.title}</p>
                        <p className="text-sm text-gray-500">
                          {quote.quote_number} • {formatDate(quote.created_at)}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{formatCurrency(quote.total)}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            quote.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : quote.status === "sent"
                              ? "bg-blue-100 text-blue-700"
                              : quote.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {quote.status === "draft"
                            ? "טיוטה"
                            : quote.status === "sent"
                            ? "נשלחה"
                            : quote.status === "accepted"
                            ? "אושרה"
                            : quote.status === "rejected"
                            ? "נדחתה"
                            : quote.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">היסטוריית פעילות</h2>
              <button
                onClick={() => setShowAddActivity(true)}
                className="text-sm text-black font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} />
                הוסף פעילות
              </button>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 right-5 w-px bg-gray-200" />

              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activityIcons[activity.activity_type] || MessageSquare;
                  return (
                    <div key={activity.id} className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center z-10">
                        <Icon size={18} className="text-gray-600" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium">{activity.title}</p>
                        {activity.description && (
                          <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {activities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">אין פעילות עדיין</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">שינוי סטטוס</h3>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([key, { label, color, bg }]) => (
                <button
                  key={key}
                  onClick={() => updateStatus(key)}
                  className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                    lead.status === key
                      ? `${bg} ${color} font-medium`
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">פעולות מהירות</h3>
            <div className="space-y-2">
              <a
                href={`tel:${lead.phone}`}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
              >
                <Phone size={18} />
                התקשר
              </a>
              <a
                href={`https://wa.me/972${lead.phone.replace(/^0/, "")}`}
                target="_blank"
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
              >
                <MessageSquare size={18} />
                וואטסאפ
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Mail size={18} />
                  שלח מייל
                </a>
              )}
              <button
                onClick={() =>
                  addActivity("call", "שיחה טלפונית")
                }
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                <PhoneCall size={18} />
                רשום שיחה
              </button>
            </div>
          </div>

          {/* Source Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">מקור הליד</h3>
            <p className="text-gray-700">
              {lead.source === "website"
                ? "אתר"
                : lead.source === "phone"
                ? "טלפון"
                : lead.source === "referral"
                ? "המלצה"
                : lead.source === "social"
                ? "רשתות חברתיות"
                : lead.source === "exhibition"
                ? "תערוכה"
                : "אחר"}
            </p>
            {lead.source_details && (
              <p className="text-sm text-gray-500 mt-1">{lead.source_details}</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <AddActivityModal
          onClose={() => setShowAddActivity(false)}
          onAdd={addActivity}
        />
      )}
    </div>
  );
}

function AddActivityModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (type: string, title: string, description?: string) => void;
}) {
  const [type, setType] = useState("note");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const activityTypes = [
    { value: "note", label: "הערה" },
    { value: "call", label: "שיחה" },
    { value: "email", label: "אימייל" },
    { value: "meeting", label: "פגישה" },
    { value: "followup", label: "תזכורת" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(type, title, description || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">הוסף פעילות</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סוג פעילות
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              {activityTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כותרת *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="לדוגמה: התקשרתי, לא ענה"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              פירוט (אופציונלי)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              הוסף
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
