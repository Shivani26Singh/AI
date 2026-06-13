const STORAGE_KEY = 'testStrategySettings';

const ENV_DEFAULTS = {
  jiraEmail: import.meta.env.VITE_JIRA_EMAIL || '',
  jiraToken: import.meta.env.VITE_JIRA_TOKEN || '',
  jiraBaseUrl: import.meta.env.VITE_JIRA_BASE_URL || 'https://your-domain.atlassian.net',
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      return {
        jiraEmail: stored.jiraEmail || ENV_DEFAULTS.jiraEmail,
        jiraToken: stored.jiraToken || ENV_DEFAULTS.jiraToken,
        jiraBaseUrl: stored.jiraBaseUrl || ENV_DEFAULTS.jiraBaseUrl,
        groqApiKey: stored.groqApiKey || ENV_DEFAULTS.groqApiKey,
      };
    }
  } catch {}
  return { ...ENV_DEFAULTS };
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
