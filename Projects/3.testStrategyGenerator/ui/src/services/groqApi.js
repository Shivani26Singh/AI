import { SYSTEM_PROMPT } from '../utils/systemPrompt';

export async function generateTestStrategy(apiKey, jiraIssue) {
  const issueForPrompt = {
    key: jiraIssue.key,
    summary: jiraIssue.fields?.summary,
    description: jiraIssue.fields?.description || 'No description provided.',
    issueType: jiraIssue.fields?.issuetype?.name,
    status: jiraIssue.fields?.status?.name,
    priority: jiraIssue.fields?.priority?.name,
  };

  const res = await fetch('/api/groq/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(issueForPrompt, null, 2) }
      ],
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GROQ API failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
