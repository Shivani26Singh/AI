import { useTheme } from '../hooks/useTheme';
import { FiSun, FiMoon, FiSettings } from 'react-icons/fi';

export default function Header({ onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <h1 className="app-title">Test Strategy Generator</h1>
      <div className="header-actions">
        <button className="icon-btn" onClick={onOpenSettings} title="Settings">
          <FiSettings size={20} />
        </button>
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      </div>
    </header>
  );
}
