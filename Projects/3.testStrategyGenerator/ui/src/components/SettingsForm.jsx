import { useState } from 'react';
import { testJiraConnection } from '../services/jiraApi';

export default function SettingsForm({ settings, onSave }) {
  const [local, setLocal] = useState({ ...settings });
  const [testStatus, setTestStatus] = useState('');
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setLocal(prev => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus('');
    try {
      const user = await testJiraConnection(local);
      setTestStatus(`Connected as ${user.displayName}`);
    } catch (err) {
      setTestStatus(`Failed: ${err.message}`);
    }
    setTesting(false);
  };

  const isValid = local.jiraEmail && local.jiraToken && local.jiraBaseUrl;

  return (
    <div className="settings-form">
      <h2 className="section-heading">Jira Configuration</h2>
      <label>
        Jira Email
        <input type="email" value={local.jiraEmail} onChange={handleChange('jiraEmail')} placeholder="you@company.com" />
      </label>
      <label>
        Jira API Token
        <input type="password" value={local.jiraToken} onChange={handleChange('jiraToken')} placeholder="Your Jira API token" />
      </label>
      <label>
        Jira Base URL
        <input type="text" value={local.jiraBaseUrl} onChange={handleChange('jiraBaseUrl')} placeholder="https://your-domain.atlassian.net" />
      </label>
      <div className="settings-actions">
        <button className="btn-secondary" onClick={handleTest} disabled={!isValid || testing}>
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
        {testStatus && (
          <span className={`test-status ${testStatus.startsWith('Connected') ? 'ok' : 'fail'}`}>
            {testStatus}
          </span>
        )}
      </div>

      <h2 className="section-heading">AI Configuration</h2>
      <label>
        GROQ API Key
        <input type="password" value={local.groqApiKey} onChange={handleChange('groqApiKey')} placeholder="gsk_..." />
      </label>
      <p className="hint">Model: openai/gpt-oss-120b (free tier)</p>

      <div className="settings-save">
        <button className="save-btn" onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
