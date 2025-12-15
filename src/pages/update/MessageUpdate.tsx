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


const formatDate = (dateStr?: string) => {
	if (!dateStr) return '';
	const d = new Date(dateStr);
	return d.toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true
	});
};

const MessageUpdate: React.FC = () => {
	const [messages, setMessages] = useState<Msg[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [requests, setRequests] = useState<any[]>([]);
	const [loadingRequests, setLoadingRequests] = useState(true);
	const [requestsError, setRequestsError] = useState<string | null>(null);
	const [tab, setTab] = useState<'messages' | 'requests'>('messages');
	// Search and pagination
	const [search, setSearch] = useState('');
	const [msgPage, setMsgPage] = useState(1);
	const [msgTotal, setMsgTotal] = useState(0);
	const [reqPage, setReqPage] = useState(1);
	const [reqTotal, setReqTotal] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [actionMenu, setActionMenu] = useState<{ type: 'message' | 'request'; id: string | number | null } | null>(null);

	const fetchMessages = async (page = 1, q = '', size = pageSize) => {
		setLoading(true);
		setError(null);
		try {
			const url = new URL('https://glowac-api.onrender.com/messages');
			url.searchParams.set('limit', String(size));
			url.searchParams.set('offset', String((page - 1) * size));
			if (q) url.searchParams.set('search', q);
			const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (Array.isArray(data?.results)) {
				setMessages(data.results);
				setMsgTotal(Number(data.count) || 0);
			} else if (Array.isArray(data)) {
				setMessages(data);
				setMsgTotal(data.length);
			} else {
				setMessages(Array.isArray(data?.data) ? data.data : []);
				setMsgTotal(Array.isArray(data?.data) ? data.data.length : 0);
			}
		} catch (err: any) {
			setError(String(err?.message || err));
			setMessages([]);
			setMsgTotal(0);
		} finally {
			setLoading(false);
		}
	};

	const fetchRequests = async (page = 1, q = '', size = pageSize) => {
		setLoadingRequests(true);
		setRequestsError(null);
		try {
			const url = new URL('https://glowac-api.onrender.com/geotech-requests');
			url.searchParams.set('limit', String(size));
			url.searchParams.set('offset', String((page - 1) * size));
			if (q) url.searchParams.set('search', q);
			const res = await fetch(url.toString(), { headers: { accept: 'application/json' } });
			if (!res.ok) throw new Error(`Status ${res.status}`);
			const data = await res.json();
			if (Array.isArray(data?.results)) {
				setRequests(data.results);
				setReqTotal(Number(data.count) || 0);
			} else if (Array.isArray(data)) {
				setRequests(data);
				setReqTotal(data.length);
			} else {
				setRequests(Array.isArray(data?.data) ? data.data : []);
				setReqTotal(Array.isArray(data?.data) ? data.data.length : 0);
			}
		} catch (err: any) {
			setRequestsError(String(err?.message || err));
			setRequests([]);
			setReqTotal(0);
		} finally {
			setLoadingRequests(false);
		}
	};

	// Fetch only for the active tab
	useEffect(() => {
		if (tab === 'messages') {
			fetchMessages(msgPage, search, pageSize);
		} else {
			fetchRequests(reqPage, search, pageSize);
		}
		// eslint-disable-next-line
	}, [tab, msgPage, reqPage, pageSize, search]);

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
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<div className="flex flex-col sm:flex-row sm:items-center gap-2">
					<h2 className="text-2xl font-semibold">Messages</h2>
					<div className="ml-0 sm:ml-4 flex rounded-lg bg-gray-100 p-1 shadow-inner">
						<button onClick={() => setTab('messages')} className={`px-4 py-2 rounded-l-lg font-medium transition-all duration-150 ${tab === 'messages' ? 'bg-emerald-600 text-white shadow' : 'bg-transparent text-emerald-700 hover:bg-emerald-50'}`}>Messages</button>
						<button onClick={() => setTab('requests')} className={`px-4 py-2 rounded-r-lg font-medium transition-all duration-150 ${tab === 'requests' ? 'bg-emerald-600 text-white shadow' : 'bg-transparent text-emerald-700 hover:bg-emerald-50'}`}>Requests</button>
					</div>
				</div>
					<div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
						<input
							type="text"
							placeholder="Search..."
							value={search}
							onChange={e => {
								setSearch(e.target.value);
								if (tab === 'messages') {
									setMsgPage(1);
								} else {
									setReqPage(1);
								}
							}}
							className="px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 text-sm min-w-[180px]"
						/>
						<select
							value={pageSize}
							onChange={e => {
								setPageSize(Number(e.target.value));
								if (tab === 'messages') {
									setMsgPage(1);
								} else {
									setReqPage(1);
								}
							}}
							className="px-2 py-2 border border-gray-300 rounded-md text-sm"
							style={{ minWidth: 80 }}
						>
							{[5, 10, 20, 50].map(size => (
								<option key={size} value={size}>{size} / page</option>
							))}
						</select>
						<button onClick={() => { if (tab === 'messages') fetchMessages(msgPage, search, pageSize); else fetchRequests(reqPage, search, pageSize); }} className="px-3 py-1 bg-emerald-600 text-white rounded">Refresh</button>
						<span className="text-sm text-gray-500">{tab === 'messages' ? (loading ? 'Loading…' : `${msgTotal} feedback`) : (loadingRequests ? 'Loading…' : `${reqTotal} requests`)}</span>
					</div>
			</div>

			{(tab === 'messages' && error) && <div className="mb-4 text-red-600">{error}</div>}
			{(tab === 'requests' && requestsError) && <div className="mb-4 text-red-600">{requestsError}</div>}

			{tab === 'messages' ? (
				<section>
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-lg font-medium">Feedback Messages ({msgTotal})</h3>
					</div>
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
								{feedbackMessages.slice(0, pageSize).map((m) => (
									<tr key={String(m.id)} className="border-t">
										<td className="px-4 py-2 text-sm">{String(m.id)}</td>
										<td className="px-4 py-2 text-sm">{m.name}</td>
										<td className="px-4 py-2 text-sm">{m.email}</td>
										<td className="px-4 py-2 text-sm">{m.message}</td>
										<td className="px-4 py-2 text-sm whitespace-nowrap text-gray-600 font-mono">{formatDate(m.created_at)}</td>
										<td className="px-4 py-2 text-sm relative">
											<button onClick={() => setActionMenu({ type: 'message', id: m.id })} className="text-gray-600 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none" title="Actions">
												<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
											</button>
											{actionMenu && actionMenu.type === 'message' && actionMenu.id === m.id && (
												<div className="absolute right-0 z-10 mt-2 w-32 bg-white border rounded shadow-lg">
													<button onClick={() => { handleDelete(m.id); setActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
													<button onClick={() => setActionMenu(null)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
												</div>
											)}
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
						{/* Pagination and row count at bottom */}
						<div className="flex flex-col sm:flex-row sm:justify-between items-center mt-2 px-2 py-2">
							<span className="text-xs text-gray-500 mb-2 sm:mb-0">Showing {feedbackMessages.length} of {msgTotal} messages</span>
							{msgTotal > pageSize && (
								<div className="flex gap-2 items-center">
									<button disabled={msgPage === 1} onClick={() => { setMsgPage(msgPage - 1); fetchMessages(msgPage - 1, search); }} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
									<span className="text-sm">Page {msgPage} of {Math.ceil(msgTotal / pageSize)}</span>
									<button disabled={msgPage >= Math.ceil(msgTotal / pageSize)} onClick={() => { setMsgPage(msgPage + 1); fetchMessages(msgPage + 1, search); }} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
								</div>
							)}
						</div>
					</div>
				</section>
			) : (
				<section>
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-lg font-medium">Geotech Requests ({reqTotal})</h3>
					</div>
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
								{requests.slice(0, pageSize).map((r) => (
									<tr key={String(r.id)} className="border-t">
										<td className="px-4 py-2 text-sm">{String(r.id)}</td>
										<td className="px-4 py-2 text-sm">{r.name}</td>
										<td className="px-4 py-2 text-sm">{r.email}</td>
										<td className="px-4 py-2 text-sm">{r.phone}</td>
										<td className="px-4 py-2 text-sm">{r.project_details}</td>
										<td className="px-4 py-2 text-sm whitespace-nowrap text-gray-600 font-mono">{formatDate(r.created_at)}</td>
										<td className="px-4 py-2 text-sm relative">
											<button onClick={() => setActionMenu({ type: 'request', id: r.id })} className="text-gray-600 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none" title="Actions">
												<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
											</button>
											{actionMenu && actionMenu.type === 'request' && actionMenu.id === r.id && (
												<div className="absolute right-0 z-10 mt-2 w-32 bg-white border rounded shadow-lg">
													<button onClick={() => { handleDeleteRequest(r.id); setActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
													<button onClick={() => setActionMenu(null)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
												</div>
											)}
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
						{/* Pagination and row count at bottom */}
						<div className="flex flex-col sm:flex-row sm:justify-between items-center mt-2 px-2 py-2">
							<span className="text-xs text-gray-500 mb-2 sm:mb-0">Showing {requests.length} of {reqTotal} requests</span>
							{reqTotal > pageSize && (
								<div className="flex gap-2 items-center">
									<button disabled={reqPage === 1} onClick={() => { setReqPage(reqPage - 1); fetchRequests(reqPage - 1, search); }} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
									<span className="text-sm">Page {reqPage} of {Math.ceil(reqTotal / pageSize)}</span>
									<button disabled={reqPage >= Math.ceil(reqTotal / pageSize)} onClick={() => { setReqPage(reqPage + 1); fetchRequests(reqPage + 1, search); }} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
								</div>
							)}
						</div>
					</div>
				</section>
			)}
		</div>
	);
};

export default MessageUpdate;
