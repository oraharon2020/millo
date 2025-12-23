"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Phone, Mail, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase, Contact } from "@/lib/supabase";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.includes(searchTerm);
    
    const matchesFilter = filterStatus === "all" || contact.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="text-orange-500" size={16} />;
      case 'contacted': return <Phone className="text-blue-500" size={16} />;
      case 'closed': return <CheckCircle className="text-green-500" size={16} />;
      default: return <XCircle className="text-gray-400" size={16} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'חדש';
      case 'contacted': return 'בטיפול';
      case 'closed': return 'סגור';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">פניות</h1>
        <p className="text-gray-500 text-sm mt-1">ניהול פניות מלקוחות</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון או אימייל..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filterStatus === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'הכל' : getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">טוען...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500">אין פניות {filterStatus !== 'all' ? `בסטטוס "${getStatusLabel(filterStatus)}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'new' 
                        ? 'bg-orange-100 text-orange-700'
                        : contact.status === 'contacted'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getStatusIcon(contact.status)}
                      {getStatusLabel(contact.status)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-gray-900">
                        <Phone size={14} />
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-gray-900">
                        <Mail size={14} />
                        <span>{contact.email}</span>
                      </a>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{formatDate(contact.created_at)}</span>
                    </span>
                  </div>
                  
                  {contact.message && (
                    <p className="mt-4 text-gray-600 bg-gray-50 p-4 rounded-xl">
                      {contact.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={contact.status}
                    onChange={(e) => updateStatus(contact.id, e.target.value as 'new' | 'contacted' | 'closed')}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white text-sm"
                  >
                    <option value="new">חדש</option>
                    <option value="contacted">בטיפול</option>
                    <option value="closed">סגור</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
