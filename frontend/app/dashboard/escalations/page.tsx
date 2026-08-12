'use client';

import { useEffect, useState } from 'react';

export default function EscalationsDashboard() {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEscalations() {
      try {
        const res = await fetch('/escalations.json');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setEscalations(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEscalations();
  }, []);

  if (error) {
    return <div>Error loading escalations: {error}</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Open Escalations</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Reference ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Reason</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Summary</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Urgency</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Language</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Follow‑up Method</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {escalations.map((e) => (
            <tr key={e.reference_id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.reference_id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.reason}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.summary}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.urgency}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.language}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.follow_up_method}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.status}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{e.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
</File>
</write_to_file>
</tool_call>