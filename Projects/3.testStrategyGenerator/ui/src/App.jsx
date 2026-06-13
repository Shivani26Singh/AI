import { useState, useCallback } from 'react';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { loadSettings, saveSettings } from './services/storage';
import { fetchJiraIssue } from './services/jiraApi';
import { generateTestStrategy } from './services/groqApi';
import { generateDocx } from './utils/docxGenerator';
import InputMethodSwitcher from './components/InputMethodSwitcher';
import SettingsForm from './components/SettingsForm';
import Progress from './components/Progress';
import Download from './components/Download';
import { FiSun, FiMoon, FiDownload } from 'react-icons/fi';
import './App.css';

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [activeTab, setActiveTab] = useState('generate');
  const [inputMethod, setInputMethod] = useState('jira');
  const [issueId, setIssueId] = useState('');
  const [contextText, setContextText] = useState('');
  const [state, setState] = useState('idle');
  const [error, setError] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [currentIssueId, setCurrentIssueId] = useState('');

  const settingsComplete = settings.jiraEmail && settings.jiraToken && settings.jiraBaseUrl && settings.groqApiKey;

  const handleSaveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!settingsComplete) return;

    if (inputMethod === 'jira' && !issueId.trim()) return;
    if (inputMethod === 'context' && !contextText.trim()) return;

    const jiraId = inputMethod === 'jira' ? issueId.trim().toUpperCase() : 'CONTEXT';
    setCurrentIssueId(jiraId);
    setError('');
    setState('fetching');

    try {
      if (inputMethod === 'jira') {
        const jiraIssue = await fetchJiraIssue(settings, jiraId);
        setState('generating');
        const text = await generateTestStrategy(settings.groqApiKey, jiraIssue);
        setGeneratedText(text);
      } else {
        setState('generating');
        const mockIssue = {
          key: 'CONTEXT',
          fields: {
            summary: 'User-provided context',
            description: contextText.trim(),
            issuetype: { name: 'Task' },
            status: { name: 'Open' },
            priority: { name: 'Medium' },
          }
        };
        const text = await generateTestStrategy(settings.groqApiKey, mockIssue);
        setGeneratedText(text);
      }
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }, [settings, settingsComplete, inputMethod, issueId, contextText]);

  const handleDownload = useCallback(async () => {
    if (generatedText) {
      await generateDocx(generatedText, currentIssueId);
    }
  }, [generatedText, currentIssueId]);

  const handleRetry = () => {
    setState('idle');
    setError('');
  };

  const busy = state === 'fetching' || state === 'generating';

  return (
    <ThemeProvider>
      <AppInner
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inputMethod={inputMethod}
        setInputMethod={setInputMethod}
        issueId={issueId}
        setIssueId={setIssueId}
        contextText={contextText}
        setContextText={setContextText}
        state={state}
        error={error}
        generatedText={generatedText}
        currentIssueId={currentIssueId}
        settings={settings}
        settingsComplete={settingsComplete}
        busy={busy}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        onRetry={handleRetry}
        onSaveSettings={handleSaveSettings}
      />
    </ThemeProvider>
  );
}

function AppInner({
  activeTab, setActiveTab,
  inputMethod, setInputMethod,
  issueId, setIssueId,
  contextText, setContextText,
  state, error, generatedText, currentIssueId,
  settings, settingsComplete, busy,
  onGenerate, onDownload, onRetry, onSaveSettings,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <div className="top-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Generate
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>
      </div>

      {activeTab === 'generate' && (
        <main className="main-content">
          <div className="main-card">
            <h1 className="card-title">Test Strategy Generator</h1>
            <p className="card-subtitle">Generate a comprehensive test strategy document from your Jira issue or requirements.</p>

            <InputMethodSwitcher method={inputMethod} onChange={setInputMethod} />

            {inputMethod === 'jira' && (
              <div className="input-group">
                <label htmlFor="jiraId">JIRA Issue ID</label>
                <div className="input-row">
                  <input
                    id="jiraId"
                    type="text"
                    value={issueId}
                    onChange={e => setIssueId(e.target.value)}
                    placeholder="e.g. KAN-4"
                    disabled={busy}
                  />
                </div>
              </div>
            )}

            {inputMethod === 'context' && (
              <div className="input-group">
                <label htmlFor="context">Requirement / Context</label>
                <textarea
                  id="context"
                  value={contextText}
                  onChange={e => setContextText(e.target.value)}
                  placeholder="Describe the feature, requirements, and scope..."
                  rows={6}
                  disabled={busy}
                />
              </div>
            )}

            <button
              className="generate-btn"
              onClick={onGenerate}
              disabled={!settingsComplete || busy || (inputMethod === 'jira' && !issueId.trim()) || (inputMethod === 'context' && !contextText.trim())}
            >
              {busy ? 'Processing...' : 'Generate Test Strategy'}
            </button>

            {!settingsComplete && (
              <p className="settings-note">
                Configure your Jira and AI settings before generating.
              </p>
            )}

            {(state === 'fetching' || state === 'generating') && (
              <Progress state={state} issueId={currentIssueId} />
            )}

            {state === 'error' && (
              <div className="result-block error">
                <p className="error-msg">{error}</p>
                <button className="retry-btn" onClick={onRetry}>Retry</button>
              </div>
            )}

            {state === 'done' && (
              <div className="result-block success">
                <div className="success-header">
                  <span className="success-dot" />
                  Test strategy generated
                </div>
                <p className="success-for">For: <strong>{currentIssueId}</strong></p>
                <button className="download-btn" onClick={onDownload} disabled={!generatedText}>
                  <FiDownload size={16} /> Download .docx
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {activeTab === 'settings' && (
        <main className="main-content">
          <div className="main-card">
            <SettingsForm settings={settings} onSave={onSaveSettings} />
          </div>
        </main>
      )}
    </div>
  );
}
