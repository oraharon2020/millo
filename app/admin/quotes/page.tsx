"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  Search,
  Plus,
  FileText,
  Eye,
  Send,
  Check,
  X,
  Clock,
  Filter,
} from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_phone: string | null;
  title: string;
  total: number;
  status: string;
  created_at: string;
  sent_at: string | null;
  lead_id: string | null;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  draft: { label: "טיוטה", color: "text-gray-700", bg: "bg-gray-100", icon: FileText },
  sent: { label: "נשלחה", color: "text-blue-700", bg: "bg-blue-100", icon: Send },
  viewed: { label: "נצפתה", color: "text-purple-700", bg: "bg-purple-100", icon: Eye },
  accepted: { label: "אושרה", color: "text-green-700", bg: "bg-green-100", icon: Check },
  rejected: { label: "נדחתה", color: "text-red-700", bg: "bg-red-100", icon: X },
  expired: { label: "פג תוקף", color: "text-orange-700", bg: "bg-orange-100", icon: Clock },
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setQuotes(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    setStats({
      total: quotesData.length,
      draft: quotesData.filter((q) => q.status === "draft").length,
      sent: quotesData.filter((q) => q.status === "sent").length,
      accepted: quotesData.filter((q) => q.status === "accepted").length,
      totalValue: quotesData
        .filter((q) => q.status === "accepted")
        .reduce((sum, q) => sum + q.total, 0),
    });
  };

  const filteredQuotes = quotes.filter((quote) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      quote.quote_number.toLowerCase().includes(query) ||
      quote.customer_name.toLowerCase().includes(query) ||
      quote.title.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הצעות מחיר</h1>
          <p className="text-gray-500 mt-1">ניהול ומעקב הצעות מחיר</p>
        </div>
        <Link
          href="/admin/quotes/new"
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          הצעה חדשה
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-gray-500">סה״כ הצעות</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-sm text-gray-500">טיוטות</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          <p className="text-sm text-gray-500">נשלחו</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          <p className="text-sm text-gray-500">אושרו</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.totalValue)}
          </p>
          <p className="text-sm text-gray-500">ערך עסקאות</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="חיפוש לפי מספר הצעה, שם לקוח..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

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
            {Object.entries(statusConfig)
              .slice(0, 4)
              .map(([key, { label }]) => (
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

      {/* Quotes Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">טוען...</div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">לא נמצאו הצעות מחיר</p>
          <Link
            href="/admin/quotes/new"
            className="mt-4 inline-block text-black font-medium hover:underline"
          >
            צור הצעה ראשונה
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((quote) => {
            const StatusIcon = statusConfig[quote.status]?.icon || FileText;
            return (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">{quote.quote_number}</p>
                    <p className="text-gray-500 text-sm">{quote.customer_name}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      statusConfig[quote.status]?.bg
                    } ${statusConfig[quote.status]?.color}`}
                  >
                    <StatusIcon size={12} />
                    {statusConfig[quote.status]?.label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {quote.title}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    {formatDate(quote.created_at)}
                  </span>
                  <span className="font-bold text-lg">
                    {formatCurrency(quote.total)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
