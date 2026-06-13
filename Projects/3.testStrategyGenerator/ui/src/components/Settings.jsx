import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { testJiraConnection } from '../services/jiraApi';

export default function Settings({ settings, onSave, onClose }) {
  const [local, setLocal] = useState({ ...settings });
  const [testStatus, setTestStatus] = useState('');
  const [testing, setTesting] = useState(false);

  const handleChange = (field) => (e) => {
    setLocal(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus('Testing...');
    try {
      const user = await testJiraConnection(local);
      setTestStatus(`Connected as ${user.displayName} (${user.emailAddress})`);
    } catch (err) {
      setTestStatus(`Failed: ${err.message}`);
    }
    setTesting(false);
  };

  const isValid = local.jiraEmail && local.jiraToken && local.jiraBaseUrl;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose}><FiX size={20} /></button>
        </div>

        <div className="settings-section">
          <h3>Jira Configuration</h3>
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
          <button className="btn btn-secondary" onClick={handleTest} disabled={!isValid || testing}>
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          {testStatus && <p className={`test-status ${testStatus.startsWith('Connected') ? 'success' : 'error'}`}>{testStatus}</p>}
        </div>

        <div className="settings-section">
          <h3>AI Configuration</h3>
          <label>
            GROQ API Key
            <input type="password" value={local.groqApiKey} onChange={handleChange('groqApiKey')} placeholder="gsk_..." />
          </label>
          <p className="hint">Uses model: openai/gpt-oss-120b (free tier)</p>
        </div>

        <div className="settings-footer">
          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
