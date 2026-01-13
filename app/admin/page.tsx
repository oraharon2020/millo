"use client";

import { useEffect, useState } from "react";
import { 
  FolderKanban, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Plus,
  ArrowUpLeft,
  UserPlus,
  FileText,
  DollarSign,
  Users
} from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    insights: 0,
    contacts: 0,
    newContacts: 0,
    leads: 0,
    newLeads: 0,
    quotes: 0,
    acceptedQuotes: 0,
    totalRevenue: 0
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        projectsRes, 
        insightsRes, 
        contactsRes, 
        newContactsRes,
        leadsRes,
        newLeadsRes,
        quotesRes,
        acceptedQuotesRes
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('kitchen_insights').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('quotes').select('*', { count: 'exact', head: true }),
        supabase.from('quotes').select('total').eq('status', 'accepted')
      ]);

      const totalRevenue = acceptedQuotesRes.data?.reduce((sum: number, q: any) => sum + (q.total || 0), 0) || 0;

      setStats({
        projects: projectsRes.count || 0,
        insights: insightsRes.count || 0,
        contacts: contactsRes.count || 0,
        newContacts: newContactsRes.count || 0,
        leads: leadsRes.count || 0,
        newLeads: newLeadsRes.count || 0,
        quotes: quotesRes.count || 0,
        acceptedQuotes: acceptedQuotesRes.data?.length || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [leadsData, contactsData] = await Promise.all([
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);
      
      setRecentLeads(leadsData.data || []);
      setRecentContacts(contactsData.data || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    new: { label: "חדש", color: "bg-blue-100 text-blue-700" },
    contacted: { label: "יצרנו קשר", color: "bg-purple-100 text-purple-700" },
    meeting_set: { label: "נקבעה פגישה", color: "bg-orange-100 text-orange-700" },
    quote_sent: { label: "נשלחה הצעה", color: "bg-cyan-100 text-cyan-700" },
    won: { label: "נסגר", color: "bg-green-100 text-green-700" },
    lost: { label: "אבד", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">דשבורד</h1>
          <p className="text-gray-500 text-sm mt-1">ברוכים הבאים ללוח הניהול של MILLO</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/admin/leads"
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserPlus size={18} />
            <span>ליד חדש</span>
          </Link>
          <Link 
            href="/admin/quotes/new"
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FileText size={18} />
            <span>הצעת מחיר</span>
          </Link>
        </div>
      </div>

      {/* CRM Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/leads" className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.leads}</p>
              <p className="text-sm text-gray-500">לידים</p>
            </div>
          </div>
          {stats.newLeads > 0 && (
            <p className="mt-2 text-xs text-blue-600 font-medium">{stats.newLeads} חדשים</p>
          )}
        </Link>

        <Link href="/admin/quotes" className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.quotes}</p>
              <p className="text-sm text-gray-500">הצעות מחיר</p>
            </div>
          </div>
          {stats.acceptedQuotes > 0 && (
            <p className="mt-2 text-xs text-green-600 font-medium">{stats.acceptedQuotes} אושרו</p>
          )}
        </Link>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-500">עסקאות שנסגרו</p>
            </div>
          </div>
        </div>

        <Link href="/admin/contacts" className="bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.contacts}</p>
              <p className="text-sm text-gray-500">פניות</p>
            </div>
          </div>
          {stats.newContacts > 0 && (
            <p className="mt-2 text-xs text-orange-600 font-medium">{stats.newContacts} חדשות</p>
          )}
        </Link>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="פרויקטים"
          value={stats.projects}
          icon={FolderKanban}
          color="blue"
        />
        <DashboardCard
          title="Kitchen Insights"
          value={stats.insights}
          icon={TrendingUp}
          color="purple"
        />
        <DashboardCard
          title="סה״כ פניות"
          value={stats.contacts}
          icon={MessageSquare}
          color="green"
        />
        <DashboardCard
          title="פניות חדשות"
          value={stats.newContacts}
          change={stats.newContacts > 0 ? "דורש טיפול" : ""}
          changeType={stats.newContacts > 0 ? "negative" : "neutral"}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">לידים אחרונים</h2>
            <Link 
              href="/admin/leads" 
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <span>הצג הכל</span>
              <ArrowUpLeft size={14} />
            </Link>
          </div>
          
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין לידים עדיין</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link 
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{lead.full_name}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusLabels[lead.status]?.color || 'bg-gray-100 text-gray-700'
                  }`}>
                    {statusLabels[lead.status]?.label || lead.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">פניות אחרונות</h2>
            <Link 
              href="/admin/contacts" 
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <span>הצג הכל</span>
              <ArrowUpLeft size={14} />
            </Link>
          </div>
          
          {recentContacts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין פניות עדיין</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contact.status === 'new' 
                      ? 'bg-orange-100 text-orange-700'
                      : contact.status === 'contacted'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {contact.status === 'new' ? 'חדש' : 
                     contact.status === 'contacted' ? 'בטיפול' : 'סגור'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">פעולות מהירות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/admin/leads"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
          >
            <UserPlus className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
            <p className="font-medium text-gray-900">הוסף ליד</p>
            <p className="text-sm text-gray-500">ליד חדש</p>
          </Link>
          
          <Link 
            href="/admin/quotes/new"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
          >
            <FileText className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
            <p className="font-medium text-gray-900">הצעת מחיר</p>
            <p className="text-sm text-gray-500">צור הצעה חדשה</p>
          </Link>
          
          <Link 
            href="/admin/projects/new"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
          >
            <FolderKanban className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
            <p className="font-medium text-gray-900">הוסף פרויקט</p>
            <p className="text-sm text-gray-500">צור פרויקט חדש</p>
          </Link>
          
          <Link 
            href="/admin/insights/new"
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
          >
            <TrendingUp className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
            <p className="font-medium text-gray-900">הוסף Insight</p>
            <p className="text-sm text-gray-500">כתוב מאמר חדש</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
