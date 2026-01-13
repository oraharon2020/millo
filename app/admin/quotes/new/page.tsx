"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Trash2,
  GripVertical,
  Calculator,
  Save,
  Send,
  FileText,
} from "lucide-react";

interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
}

interface QuoteItem {
  id: string;
  item_type: string;
  name: string;
  description: string;
  width_cm: number | null;
  height_cm: number | null;
  depth_cm: number | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_index: number;
}

const itemTypes = [
  { value: "cabinet", label: "ארון" },
  { value: "countertop", label: "משטח" },
  { value: "appliance", label: "מכשיר חשמלי" },
  { value: "accessory", label: "אביזר" },
  { value: "installation", label: "התקנה" },
  { value: "design", label: "תכנון ועיצוב" },
  { value: "delivery", label: "משלוח" },
  { value: "other", label: "אחר" },
];

// Simple UUID generator for client-side
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function NewQuotePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = searchParams.get("lead");
  const { profile } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  // Quote form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("50% מקדמה, 50% באספקה");
  const [deliveryTime, setDeliveryTime] = useState("6-8 שבועות");
  const [warranty, setWarranty] = useState("אחריות 5 שנים");
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Items
  const [items, setItems] = useState<QuoteItem[]>([]);

  // Calculated values
  const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const vatAmount = (subtotal - discountAmount) * 0.17;
  const total = subtotal - discountAmount + vatAmount;

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const fetchLead = async () => {
    const { data } = await supabase
      .from("leads")
      .select("id, full_name, email, phone, address, city")
      .eq("id", leadId)
      .single();

    if (data) {
      setLead(data);
      setCustomerName(data.full_name);
      setCustomerEmail(data.email || "");
      setCustomerPhone(data.phone);
      setCustomerAddress([data.address, data.city].filter(Boolean).join(", "));
      setTitle(`הצעת מחיר למטבח - ${data.full_name}`);
    }
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: generateId(),
      item_type: "cabinet",
      name: "",
      description: "",
      width_cm: null,
      height_cm: null,
      depth_cm: null,
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      order_index: items.length,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Auto-calculate total
        if (field === "quantity" || field === "unit_price") {
          updated.total_price = updated.quantity * updated.unit_price;
        }

        return updated;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const generateQuoteNumber = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const { data } = await supabase
      .from("quotes")
      .select("quote_number")
      .like("quote_number", `Q-${year}-%`)
      .order("quote_number", { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      const lastNum = parseInt(data[0].quote_number.split("-")[2]);
      return `Q-${year}-${String(lastNum + 1).padStart(3, "0")}`;
    }
    return `Q-${year}-001`;
  };

  const saveQuote = async (status: "draft" | "sent" = "draft") => {
    if (!title || !customerName || !customerPhone) {
      alert("נא למלא את כל השדות הנדרשים");
      return;
    }

    if (items.length === 0) {
      alert("נא להוסיף לפחות פריט אחד");
      return;
    }

    setSaving(true);

    try {
      const quoteNumber = await generateQuoteNumber();

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          quote_number: quoteNumber,
          lead_id: leadId || null,
          customer_name: customerName,
          customer_email: customerEmail || null,
          customer_phone: customerPhone,
          customer_address: customerAddress || null,
          title,
          description: description || null,
          subtotal,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          vat_percent: 17,
          vat_amount: vatAmount,
          total,
          payment_terms: paymentTerms,
          delivery_time: deliveryTime,
          warranty,
          validity_days: validityDays,
          notes: notes || null,
          status,
          sent_at: status === "sent" ? new Date().toISOString() : null,
          created_by: profile?.id || null,
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Add items
      const itemsToInsert = items.map((item, index) => ({
        quote_id: quote.id,
        item_type: item.item_type,
        name: item.name,
        description: item.description || null,
        width_cm: item.width_cm,
        height_cm: item.height_cm,
        depth_cm: item.depth_cm,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        order_index: index,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // If linked to lead, add activity
      if (leadId) {
        await supabase.from("lead_activities").insert({
          lead_id: leadId,
          activity_type: status === "sent" ? "quote_sent" : "note",
          title:
            status === "sent"
              ? `נשלחה הצעת מחיר ${quoteNumber}`
              : `נוצרה הצעת מחיר ${quoteNumber}`,
          quote_id: quote.id,
        });

        // Update lead status if sending
        if (status === "sent") {
          await supabase
            .from("leads")
            .update({ status: "quote_sent", updated_at: new Date().toISOString() })
            .eq("id", leadId);
        }
      }

      router.push(`/admin/quotes/${quote.id}`);
    } catch (error) {
      console.error("Error saving quote:", error);
      alert("שגיאה בשמירת ההצעה");
    } finally {
      setSaving(false);
    }
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
        <div className="flex items-center gap-4">
          <Link
            href={leadId ? `/admin/leads/${leadId}` : "/admin/quotes"}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowRight size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">הצעת מחיר חדשה</h1>
            {lead && (
              <p className="text-gray-500 mt-1">עבור {lead.full_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => saveQuote("draft")}
            disabled={saving}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            שמור טיוטה
          </button>
          <button
            onClick={() => saveQuote("sent")}
            disabled={saving}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
            שמור ושלח
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">פרטי ההצעה</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כותרת ההצעה *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="לדוגמה: הצעת מחיר למטבח - משפחת כהן"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תיאור
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="תיאור כללי של הפרויקט..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">פרטי הלקוח</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שם הלקוח *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  טלפון *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  אימייל
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  כתובת
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">פריטים</h2>
              <button
                onClick={addItem}
                className="text-sm text-black font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} />
                הוסף פריט
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">אין פריטים עדיין</p>
                <button
                  onClick={addItem}
                  className="mt-2 text-black font-medium hover:underline"
                >
                  הוסף פריט ראשון
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-gray-400 cursor-move mt-2">
                        <GripVertical size={18} />
                      </div>

                      <div className="flex-1 grid grid-cols-12 gap-3">
                        {/* Type */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">
                            סוג
                          </label>
                          <select
                            value={item.item_type}
                            onChange={(e) =>
                              updateItem(item.id, "item_type", e.target.value)
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                          >
                            {itemTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Name */}
                        <div className="col-span-4">
                          <label className="block text-xs text-gray-500 mb-1">
                            שם הפריט
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item.id, "name", e.target.value)
                            }
                            placeholder="לדוגמה: ארון עליון 80 ס״מ"
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            כמות
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">
                            מחיר ליחידה
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "unit_price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                          />
                        </div>

                        {/* Total */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">
                            סה״כ
                          </label>
                          <div className="px-2 py-1.5 text-sm bg-gray-50 rounded-lg font-medium">
                            {formatCurrency(item.total_price)}
                          </div>
                        </div>

                        {/* Delete */}
                        <div className="col-span-1 flex items-end justify-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-3 mr-8">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="תיאור נוסף (אופציונלי)"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">תנאים</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תנאי תשלום
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  זמן אספקה
                </label>
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  אחריות
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תוקף ההצעה (ימים)
                </label>
                <input
                  type="number"
                  min="1"
                  value={validityDays}
                  onChange={(e) =>
                    setValidityDays(parseInt(e.target.value) || 30)
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  הערות
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הערות נוספות שיופיעו בהצעה..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator size={20} />
              סיכום
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">סכום ביניים</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">הנחה</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) =>
                      setDiscountPercent(parseFloat(e.target.value) || 0)
                    }
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded"
                  />
                  <span className="text-gray-500">%</span>
                </div>
                <span className="text-red-600">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>מע״מ (17%)</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">סה״כ לתשלום</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => saveQuote("draft")}
                disabled={saving}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                שמור כטיוטה
              </button>
              <button
                onClick={() => saveQuote("sent")}
                disabled={saving}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                {saving ? "שומר..." : "שמור ושלח"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">טוען...</div>}>
      <NewQuotePageContent />
    </Suspense>
  );
}
