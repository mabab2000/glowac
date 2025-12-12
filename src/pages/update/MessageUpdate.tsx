import React, { useEffect, useState } from 'react';

type Msg = {
	id: number | string;
	name?: string;
	email?: string;
	message?: string;
	created_at?: string;
	[k: string]: any;
};

const keywordsForService = ['service', 'request', 'quote', 'test', 'estimate', 'price', 'project', 'inquiry'];

const classify = (m: Msg) => {
	const text = `${m.message || ''} ${m.name || ''} ${m.email || ''}`.toLowerCase();
	for (const k of keywordsForService) if (text.includes(k)) return 'service';
	return 'feedback';
};

const MessageUpdate: React.FC = () => {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [requests, setRequests] = useState<any[]>([]);
	const [loadingRequests, setLoadingRequests] = useState(true);
	const [requestsError, setRequestsError] = useState<string | null>(null);

	const [tab, setTab] = useState<'messages' | 'requests'>('messages');

	const fetchMessages = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('https://glowac-api.onrender.com/messages', { headers: { accept: 'application/json' } });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (Array.isArray(data)) setMessages(data);
			else setMessages(Array.isArray(data?.data) ? data.data : []);
		} catch (err: any) {
			setError(String(err?.message || err));
			setMessages([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchRequests = async () => {
		setLoadingRequests(true);
		setRequestsError(null);
		try {
			const res = await fetch('https://glowac-api.onrender.com/geotech-requests', { headers: { accept: 'application/json' } });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (Array.isArray(data)) setRequests(data);
			else setRequests(Array.isArray(data?.data) ? data.data : []);
		} catch (err: any) {
			setRequestsError(String(err?.message || err));
			setRequests([]);
		} finally {
			setLoadingRequests(false);
		}
	};

	useEffect(() => {
		fetchMessages();
		fetchRequests();
	}, []);

	const handleDelete = async (id: string | number) => {
		if (!window.confirm('Delete this message?')) return;
		try {
			const res = await fetch(`https://glowac-api.onrender.com/messages/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Delete failed');
			setMessages((s) => s.filter((m) => String(m.id) !== String(id)));
		} catch (err) {
			window.alert('Failed to delete message');
		}
	};

	const handleDeleteRequest = async (id: string | number) => {
		if (!window.confirm('Delete this request?')) return;
		try {
			const res = await fetch(`https://glowac-api.onrender.com/geotech-requests/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Delete failed');
			setRequests((s) => s.filter((r) => String(r.id) !== String(id)));
		} catch (err) {
			window.alert('Failed to delete request');
		}
	};

	const toggleTypeLocal = (id: string | number) => {
		// local toggle: we add a temporary _type field to message
		setMessages((s) => s.map((m) => (String(m.id) === String(id) ? { ...m, _type: m._type === 'service' ? 'feedback' : 'service' } : m)));
	};

	const serviceMessages = messages.filter((m) => (m._type ? m._type === 'service' : classify(m) === 'service'));
	const feedbackMessages = messages.filter((m) => (m._type ? m._type === 'feedback' : classify(m) === 'feedback'));

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<h2 className="text-2xl font-semibold">Messages</h2>
					<div className="ml-4 inline-flex rounded-md bg-white/5 p-1">
						<button onClick={() => setTab('messages')} className={`px-3 py-1 rounded ${tab === 'messages' ? 'bg-emerald-600 text-white' : 'text-emerald-200'}`}>Messages</button>
						<button onClick={() => setTab('requests')} className={`px-3 py-1 rounded ${tab === 'requests' ? 'bg-emerald-600 text-white' : 'text-emerald-200'}`}>Requests</button>
					</div>
				</div>
				<div className="flex gap-2">
					<button onClick={() => { if (tab === 'messages') fetchMessages(); else fetchRequests(); }} className="px-3 py-1 bg-emerald-600 text-white rounded">Refresh</button>
					<span className="text-sm text-gray-500">{tab === 'messages' ? (loading ? 'Loading messages…' : `${feedbackMessages.length} feedback`) : (loadingRequests ? 'Loading requests…' : `${requests.length} requests`)}</span>
				</div>
			</div>

			{(tab === 'messages' && error) && <div className="mb-4 text-red-600">{error}</div>}
			{(tab === 'requests' && requestsError) && <div className="mb-4 text-red-600">{requestsError}</div>}

			{tab === 'messages' ? (
				<section>
					<h3 className="text-lg font-medium mb-3">Feedback Messages ({feedbackMessages.length})</h3>
					<div className="overflow-auto bg-white border rounded">
						<table className="min-w-full table-auto">
							<thead>
								<tr className="bg-gray-50 text-left">
									<th className="px-4 py-2 text-sm">ID</th>
									<th className="px-4 py-2 text-sm">Name</th>
									<th className="px-4 py-2 text-sm">Email</th>
									<th className="px-4 py-2 text-sm">Message</th>
									<th className="px-4 py-2 text-sm">Date</th>
									<th className="px-4 py-2 text-sm">Actions</th>
								</tr>
							</thead>
							<tbody>
								{feedbackMessages.map((m) => (
									<tr key={String(m.id)} className="border-t">
										<td className="px-4 py-2 text-sm">{String(m.id)}</td>
										<td className="px-4 py-2 text-sm">{m.name}</td>
										<td className="px-4 py-2 text-sm">{m.email}</td>
										<td className="px-4 py-2 text-sm">{m.message}</td>
										<td className="px-4 py-2 text-sm">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</td>
										<td className="px-4 py-2 text-sm">
											<button onClick={() => toggleTypeLocal(m.id)} className="mr-2 text-sm text-emerald-600">Toggle</button>
											<button onClick={() => handleDelete(m.id)} className="text-sm text-red-600">Delete</button>
										</td>
									</tr>
								))}
								{feedbackMessages.length === 0 && !loading && (
									<tr>
										<td colSpan={6} className="px-4 py-6 text-center text-gray-500">No feedback messages found.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			) : (
				<section>
					<h3 className="text-lg font-medium mb-3">Geotech Requests ({requests.length})</h3>
					<div className="overflow-auto bg-white border rounded">
						<table className="min-w-full table-auto">
							<thead>
								<tr className="bg-gray-50 text-left">
									<th className="px-4 py-2 text-sm">ID</th>
									<th className="px-4 py-2 text-sm">Name</th>
									<th className="px-4 py-2 text-sm">Email</th>
									<th className="px-4 py-2 text-sm">Phone</th>
									<th className="px-4 py-2 text-sm">Project Details</th>
									<th className="px-4 py-2 text-sm">Date</th>
									<th className="px-4 py-2 text-sm">Actions</th>
								</tr>
							</thead>
							<tbody>
								{requests.map((r) => (
									<tr key={String(r.id)} className="border-t">
										<td className="px-4 py-2 text-sm">{String(r.id)}</td>
										<td className="px-4 py-2 text-sm">{r.name}</td>
										<td className="px-4 py-2 text-sm">{r.email}</td>
										<td className="px-4 py-2 text-sm">{r.phone}</td>
										<td className="px-4 py-2 text-sm">{r.project_details}</td>
										<td className="px-4 py-2 text-sm">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
										<td className="px-4 py-2 text-sm">
											<button onClick={() => handleDeleteRequest(r.id)} className="text-sm text-red-600">Delete</button>
										</td>
									</tr>
								))}
								{requests.length === 0 && !loadingRequests && (
									<tr>
										<td colSpan={7} className="px-4 py-6 text-center text-gray-500">No geotech requests found.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</div>
	);
};

export default MessageUpdate;
