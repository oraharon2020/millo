"use client";

import { useEffect, useState } from "react";
import { 
  FolderKanban, 
  MessageSquare, 
  Eye, 
  TrendingUp,
  Plus,
  ArrowUpLeft
} from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/components/admin/DashboardCard";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    insights: 0,
    contacts: 0,
    newContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentContacts();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, insightsRes, contactsRes, newContactsRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('kitchen_insights').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new')
      ]);

      setStats({
        projects: projectsRes.count || 0,
        insights: insightsRes.count || 0,
        contacts: contactsRes.count || 0,
        newContacts: newContactsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentContacts = async () => {
    try {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      setRecentContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">דשבורד</h1>
          <p className="text-gray-500 text-sm mt-1">ברוכים הבאים ללוח הניהול של MILLO</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span>פרויקט חדש</span>
        </Link>
      </div>

      {/* Stats Cards */}
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
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">פעולות מהירות</h2>
          <div className="grid grid-cols-2 gap-4">
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
            
            <Link 
              href="/admin/gallery"
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
            >
              <Eye className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
              <p className="font-medium text-gray-900">ניהול גלריה</p>
              <p className="text-sm text-gray-500">העלה תמונות</p>
            </Link>
            
            <Link 
              href="/admin/contacts"
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all group"
            >
              <MessageSquare className="text-gray-400 group-hover:text-gray-900 mb-2" size={24} />
              <p className="font-medium text-gray-900">צפה בפניות</p>
              <p className="text-sm text-gray-500">{stats.newContacts} פניות חדשות</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
