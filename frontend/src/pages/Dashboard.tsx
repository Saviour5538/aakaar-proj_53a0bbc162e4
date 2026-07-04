import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listDocuments as fetchDocuments, listConversations as fetchConversations } from '../api/client';
import { Document, Conversation } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [documentsResponse, conversationsResponse] = await Promise.all([
          fetchDocuments(),
          fetchConversations(),
        ]);
        setDocuments(documentsResponse);
        setConversations(conversationsResponse);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        toast.error('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <p className="text-2xl font-bold">{documents.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <p className="text-2xl font-bold">{conversations.length}</p>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
            <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {documents.slice(0, 5).map((doc) => (
                <li key={doc.id} className="p-4">
                  <p className="font-semibold">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.uploadedAt}</p>
                </li>
              ))}
              {documents.length === 0 && (
                <li className="p-4 text-gray-600">No documents available.</li>
              )}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
            <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {conversations.slice(0, 5).map((conv) => (
                <li key={conv.id} className="p-4">
                  <p className="font-semibold">Conversation {conv.id}</p>
                  <p className="text-sm text-gray-600">{conv.createdAt}</p>
                </li>
              ))}
              {conversations.length === 0 && (
                <li className="p-4 text-gray-600">No conversations available.</li>
              )}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleUploadClick}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
            >
              Upload Document
            </button>
            <button
              onClick={handleChatClick}
              className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
            >
              Start a Chat
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;