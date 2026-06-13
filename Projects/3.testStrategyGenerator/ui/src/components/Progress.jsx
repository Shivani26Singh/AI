export default function Progress({ state, issueId, error, onRetry }) {
  const messages = {
    fetching: `Fetching Jira issue ${issueId}...`,
    generating: 'Generating test strategy with AI...',
    done: 'Test strategy generated successfully!',
  };

  if (state === 'error') {
    return (
      <div className="progress-container error">
        <p className="error-message">{error}</p>
        <button className="btn btn-secondary" onClick={onRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="spinner" />
      <p>{messages[state]}</p>
    </div>
  );
}
