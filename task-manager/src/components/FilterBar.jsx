import { FiSearch } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'overdue', label: 'Overdue' },
];

export default function FilterBar() {
  const { filter, setFilter, searchQuery, setSearchQuery } = useTasks();

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <FiSearch className="filter-bar__search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-bar__tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
