import { useState } from 'react';

export default function JiraInput({ onGenerate, disabled }) {
  const [issueId, setIssueId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (issueId.trim()) {
      onGenerate(issueId.trim().toUpperCase());
    }
  };

  return (
    <form className="jira-input-form" onSubmit={handleSubmit}>
      <label htmlFor="jiraId">Jira Issue ID</label>
      <div className="input-row">
        <input
          id="jiraId"
          type="text"
          value={issueId}
          onChange={e => setIssueId(e.target.value)}
          placeholder="KAN-4"
          disabled={disabled}
          autoFocus
        />
        <button type="submit" className="btn btn-primary" disabled={disabled || !issueId.trim()}>
          Generate Test Strategy
        </button>
      </div>
    </form>
  );
}
