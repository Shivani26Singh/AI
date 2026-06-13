export async function fetchJiraIssue(settings, issueId) {
  const auth = btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
  const res = await fetch(`/api/jira/issue/${issueId}`, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira fetch failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function testJiraConnection(settings) {
  const auth = btoa(`${settings.jiraEmail}:${settings.jiraToken}`);
  const res = await fetch('/api/jira/myself', {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Jira connection failed (${res.status}): ${text}`);
  }
  return res.json();
}
