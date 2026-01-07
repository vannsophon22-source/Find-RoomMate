'use client';

import React, { useState } from 'react';
import OwnerSidebar from '@/components/OwnerSidebar';
import OwnerHeader from '@/components/OwnerHeader';
import { Bell, User, Mail, Phone, Home, Check, X } from 'lucide-react';

export default function OwnerNotificationsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New booking request received',
      date: 'Jan 7, 2026',
      read: false,
      type: 'booking',
      status: 'pending',
      user: {
        name: 'Cheata',
        avatar: '/users/user-02.jpg',
        email: 'cheata@example.com',
        phone: '+855 12 000 111'
      },
      room: {
        id: 203,
        title: 'Bright Room with Balcony'
      },
      message: 'I would like to book this room starting next week.'
    },
    
  ]);

  const [selected, setSelected] = useState(null);

  const handleSelect = (n) => {
    setSelected(n);
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
  };

  const handleAction = (id, status) => {
    setNotifications(prev => prev.map(item => item.id === id ? { ...item, status, read: true } : item));
    setSelected(prev => prev ? { ...prev, status, read: true } : prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <OwnerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OwnerHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Bell className="text-blue-600" size={20} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  {notifications.filter(n => !n.read).length} unread
                </span>
              </div>
              <div className="space-y-3">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(n)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                      n.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                    } hover:shadow`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-600'}`} />
                      <p className={`font-medium ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                      {n.type === 'booking' && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                          Booking
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{n.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              {selected && selected.type === 'booking' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Request</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={selected.user.avatar} alt={selected.user.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{selected.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{selected.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{selected.user.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Home size={16} className="text-emerald-600" />
                      <span className="font-medium">{selected.room.title}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{selected.message}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      selected.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      selected.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">{selected.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAction(selected.id, 'confirmed')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                      <Check size={16} />
                      Confirm
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, 'rejected')}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              )}
              {!selected && (
                <div className="bg-white rounded-xl border border-gray-200 shadow p-6 text-center text-gray-600">
                  Select a notification to view details
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
