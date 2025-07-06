import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get('/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, read: true } : n))
      );
      setMessage('Notification marked as read.');
    } catch (err) {
      console.error('Error marking as read', err);
      setMessage('Failed to update notification.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {message && <p className="mb-4 text-green-600 text-sm">{message}</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm font-semibold">
            <tr>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((note) => (
              <tr key={note.notification_id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-pre-wrap">{note.message}</td>
                <td className="px-4 py-2">{note.read ? 'Read' : 'Unread'}</td>
                <td className="px-4 py-2">
                  {!note.read && (
                    <button
                      onClick={() => markAsRead(note.notification_id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
                <td className="px-4 py-2">{new Date(note.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
