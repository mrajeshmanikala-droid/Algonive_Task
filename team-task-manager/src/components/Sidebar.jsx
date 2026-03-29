import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineViewColumns, HiOutlineClipboardDocumentList, HiOutlineUserGroup, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { TbSubtask } from 'react-icons/tb';

const NAV_ITEMS = [
  { to: '/', icon: <HiOutlineViewColumns />, label: 'Dashboard' },
  { to: '/tasks', icon: <HiOutlineClipboardDocumentList />, label: 'Tasks' },
  { to: '/team', icon: <HiOutlineUserGroup />, label: 'Team' },
];

export default function Sidebar() {
  const { currentUser, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <TbSubtask />
        </div>
        <span className="sidebar__app-name">TeamFlow</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {currentUser && (
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">{currentUser.avatar}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{currentUser.name}</div>
              <div className={`sidebar__role-badge sidebar__role-badge--${currentUser.role.toLowerCase()}`}>
                {currentUser.role}
              </div>
            </div>
          </div>
        )}
        <button className="sidebar__logout" onClick={logout}>
          <HiOutlineArrowRightOnRectangle />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
