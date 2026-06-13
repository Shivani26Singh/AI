export default function InputMethodSwitcher({ method, onChange }) {
  const tabs = [
    { key: 'jira', label: 'JIRA ID' },
    { key: 'context', label: 'Requirement/Context' },
  ];

  return (
    <div className="method-switcher">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`method-tab ${method === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
