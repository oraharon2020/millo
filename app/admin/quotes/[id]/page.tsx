"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  Send,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  Eye,
  Printer,
  Copy,
  Mail,
  MessageSquare,
} from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  lead_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  title: string;
  description: string | null;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  vat_percent: number;
  vat_amount: number;
  total: number;
  payment_terms: string;
  delivery_time: string;
  warranty: string;
  validity_days: number;
  notes: string | null;
  status: string;
  sent_at: string | null;
  viewed_at: string | null;
  responded_at: string | null;
  created_at: string;
}

interface QuoteItem {
  id: string;
  item_type: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "טיוטה", color: "text-gray-700", bg: "bg-gray-100" },
  sent: { label: "נשלחה", color: "text-blue-700", bg: "bg-blue-100" },
  viewed: { label: "נצפתה", color: "text-purple-700", bg: "bg-purple-100" },
  accepted: { label: "אושרה ✓", color: "text-green-700", bg: "bg-green-100" },
  rejected: { label: "נדחתה", color: "text-red-700", bg: "bg-red-100" },
  expired: { label: "פג תוקף", color: "text-orange-700", bg: "bg-orange-100" },
};

const itemTypeLabels: Record<string, string> = {
  cabinet: "ארון",
  countertop: "משטח",
  appliance: "מכשיר חשמלי",
  accessory: "אביזר",
  installation: "התקנה",
  design: "תכנון ועיצוב",
  delivery: "משלוח",
  other: "אחר",
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, [params.id]);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .select("*")
        .eq("id", params.id)
        .single();

      if (quoteError) throw quoteError;
      setQuote(quoteData);

      const { data: itemsData } = await supabase
        .from("quote_items")
        .select("*")
        .eq("quote_id", params.id)
        .order("order_index");

      setItems(itemsData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!quote) return;

    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === "sent" && !quote.sent_at) {
        updates.sent_at = new Date().toISOString();
      }
      if (newStatus === "accepted" || newStatus === "rejected") {
        updates.responded_at = new Date().toISOString();
      }

      await supabase.from("quotes").update(updates).eq("id", quote.id);

      // Update lead status if linked
      if (quote.lead_id) {
        if (newStatus === "accepted") {
          await supabase
            .from("leads")
            .update({ status: "won", updated_at: new Date().toISOString() })
            .eq("id", quote.lead_id);

          await supabase.from("lead_activities").insert({
            lead_id: quote.lead_id,
            activity_type: "quote_accepted",
            title: `הצעת מחיר ${quote.quote_number} אושרה!`,
            quote_id: quote.id,
          });
        } else if (newStatus === "rejected") {
          await supabase.from("lead_activities").insert({
            lead_id: quote.lead_id,
            activity_type: "quote_rejected",
            title: `הצעת מחיר ${quote.quote_number} נדחתה`,
            quote_id: quote.id,
          });
        }
      }

      fetchQuote();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteQuote = async () => {
    if (!quote || !confirm("האם למחוק את ההצעה? פעולה זו לא ניתנת לביטול."))
      return;

    try {
      await supabase.from("quotes").delete().eq("id", quote.id);
      router.push("/admin/quotes");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyLink = () => {
    // In a real app, this would copy a shareable link
    navigator.clipboard.writeText(
      `${window.location.origin}/quote/${quote?.id}`
    );
    alert("הקישור הועתק!");
  };

  const sendWhatsApp = () => {
    if (!quote?.customer_phone) return;
    const phone = quote.customer_phone.replace(/^0/, "972");
    const message = encodeURIComponent(
      `שלום ${quote.customer_name},\nמצורפת הצעת מחיר ${quote.quote_number}.\nסה"כ: ₪${quote.total.toLocaleString()}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">טוען...</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ההצעה לא נמצאה</p>
      </div>
    );
  }

  const validUntil = new Date(quote.created_at);
  validUntil.setDate(validUntil.getDate() + quote.validity_days);
  const isExpired = new Date() > validUntil;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link
            href={quote.lead_id ? `/admin/leads/${quote.lead_id}` : "/admin/quotes"}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{quote.quote_number}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusConfig[quote.status]?.bg
                } ${statusConfig[quote.status]?.color}`}
              >
                {statusConfig[quote.status]?.label}
              </span>
              {isExpired && quote.status === "sent" && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  פג תוקף
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">{quote.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="הדפס"
          >
            <Printer size={20} />
          </button>
          <button
            onClick={copyLink}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="העתק קישור"
          >
            <Copy size={20} />
          </button>
          <button
            onClick={sendWhatsApp}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="שלח בוואטסאפ"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={deleteQuote}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
            title="מחק"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quote Preview */}
        <div className="lg:col-span-2">
          <div
            ref={printRef}
            className="bg-white rounded-xl border border-gray-100 p-8 print:border-none print:shadow-none"
          >
            {/* Quote Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">MILLO</h2>
                <p className="text-gray-500 mt-1">מטבחים בהתאמה אישית</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold">{quote.quote_number}</p>
                <p className="text-gray-500">{formatDate(quote.created_at)}</p>
                <p className="text-sm text-gray-400 mt-1">
                  תוקף עד: {formatDate(validUntil.toISOString())}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">לכבוד</h3>
              <p className="text-lg font-bold">{quote.customer_name}</p>
              {quote.customer_address && (
                <p className="text-gray-600">{quote.customer_address}</p>
              )}
              {quote.customer_phone && (
                <p className="text-gray-600">{quote.customer_phone}</p>
              )}
              {quote.customer_email && (
                <p className="text-gray-600">{quote.customer_email}</p>
              )}
            </div>

            {/* Quote Title */}
            <div className="mb-6">
              <h3 className="text-xl font-bold">{quote.title}</h3>
              {quote.description && (
                <p className="text-gray-600 mt-2">{quote.description}</p>
              )}
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-right py-3 text-sm font-medium text-gray-500">
                      #
                    </th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">
                      פריט
                    </th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">
                      סוג
                    </th>
                    <th className="text-center py-3 text-sm font-medium text-gray-500">
                      כמות
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      מחיר
                    </th>
                    <th className="text-left py-3 text-sm font-medium text-gray-500">
                      סה״כ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-500">{index + 1}</td>
                      <td className="py-3">
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </td>
                      <td className="py-3 text-gray-600">
                        {itemTypeLabels[item.item_type] || item.item_type}
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-left">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="py-3 text-left font-medium">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">סכום ביניים</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount_amount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>הנחה ({quote.discount_percent}%)</span>
                    <span>-{formatCurrency(quote.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>מע״מ ({quote.vat_percent}%)</span>
                  <span>{formatCurrency(quote.vat_amount)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-lg font-bold">
                  <span>סה״כ לתשלום</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">תנאי תשלום</p>
                  <p>{quote.payment_terms}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">זמן אספקה</p>
                  <p>{quote.delivery_time}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">אחריות</p>
                  <p>{quote.warranty}</p>
                </div>
              </div>

              {quote.notes && (
                <div className="pt-4">
                  <p className="font-medium text-gray-500 mb-1">הערות</p>
                  <p className="text-gray-700 whitespace-pre-line">
                    {quote.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>תודה שבחרתם ב-MILLO!</p>
              <p>טלפון: 03-1234567 | info@millo.co.il</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6 print:hidden">
          {/* Status Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">עדכון סטטוס</h3>

            <div className="space-y-2">
              {quote.status === "draft" && (
                <button
                  onClick={() => updateStatus("sent")}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Send size={18} />
                  סמן כנשלחה
                </button>
              )}

              {["sent", "viewed"].includes(quote.status) && (
                <>
                  <button
                    onClick={() => updateStatus("accepted")}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <Check size={18} />
                    סמן כאושרה
                  </button>
                  <button
                    onClick={() => updateStatus("rejected")}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <X size={18} />
                    סמן כנדחתה
                  </button>
                </>
              )}

              {quote.status === "accepted" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={32} className="text-green-600" />
                  </div>
                  <p className="font-medium text-green-700">ההצעה אושרה!</p>
                </div>
              )}

              {quote.status === "rejected" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <X size={32} className="text-red-600" />
                  </div>
                  <p className="font-medium text-red-700">ההצעה נדחתה</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">פעולות</h3>

            <div className="space-y-2">
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <Printer size={18} />
                הדפס / שמור PDF
              </button>

              <button
                onClick={sendWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
              >
                <MessageSquare size={18} />
                שלח בוואטסאפ
              </button>

              {quote.customer_email && (
                <a
                  href={`mailto:${quote.customer_email}?subject=הצעת מחיר ${quote.quote_number}&body=שלום ${quote.customer_name},%0A%0Aמצורפת הצעת מחיר.`}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Mail size={18} />
                  שלח במייל
                </a>
              )}

              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <Copy size={18} />
                העתק קישור
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold mb-4">ציר זמן</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock size={14} />
                </div>
                <div>
                  <p className="font-medium">נוצרה</p>
                  <p className="text-gray-500">{formatDate(quote.created_at)}</p>
                </div>
              </div>

              {quote.sent_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Send size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">נשלחה</p>
                    <p className="text-gray-500">{formatDate(quote.sent_at)}</p>
                  </div>
                </div>
              )}

              {quote.viewed_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">נצפתה</p>
                    <p className="text-gray-500">{formatDate(quote.viewed_at)}</p>
                  </div>
                </div>
              )}

              {quote.responded_at && (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      quote.status === "accepted"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {quote.status === "accepted" ? (
                      <Check size={14} className="text-green-600" />
                    ) : (
                      <X size={14} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {quote.status === "accepted" ? "אושרה" : "נדחתה"}
                    </p>
                    <p className="text-gray-500">
                      {formatDate(quote.responded_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Link to Lead */}
          {quote.lead_id && (
            <Link
              href={`/admin/leads/${quote.lead_id}`}
              className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-300 transition-colors"
            >
              <p className="text-sm text-gray-500">ליד מקושר</p>
              <p className="font-medium">{quote.customer_name}</p>
            </Link>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${printRef.current ? `#${printRef.current.id}` : "[ref=printRef]"},
          ${printRef.current ? `#${printRef.current.id}` : "[ref=printRef]"} * {
            visibility: visible;
          }
          ${printRef.current ? `#${printRef.current.id}` : "[ref=printRef]"} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
