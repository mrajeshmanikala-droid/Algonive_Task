import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export default function TaskModal({ isOpen, onClose, editTask }) {
  const { addTask, updateTask } = useTasks();
  const { users } = useAuth();

  const initialFormData = editTask
    ? {
        title: editTask.title,
        description: editTask.description || '',
        dueDate: editTask.dueDate || '',
        priority: editTask.priority || 'medium',
        status: editTask.status || 'pending',
        assigneeId: editTask.assigneeId || '',
      }
    : {
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending',
        assigneeId: '',
      };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
      priority: formData.priority,
      status: formData.status,
      assigneeId: formData.assigneeId || null,
    };

    if (editTask) {
      updateTask(editTask.id, data);
    } else {
      addTask(data);
    }

    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{editTask ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal__close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-group__label" htmlFor="task-title">Title</label>
              <input
                id="task-title"
                className="form-group__input"
                type="text"
                name="title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={handleChange}
                autoFocus
                style={errors.title ? { borderColor: 'var(--danger-400)' } : {}}
              />
              {errors.title && (
                <span style={{ color: 'var(--danger-400)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.title}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="task-desc">Description</label>
              <textarea
                id="task-desc"
                className="form-group__textarea"
                name="description"
                placeholder="Add some details..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-group__label" htmlFor="task-date">Due Date</label>
                <input
                  id="task-date"
                  className="form-group__input"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-group__label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-group__select"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-group__label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-group__select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-group__label" htmlFor="task-assignee">Assignee</label>
                <select
                  id="task-assignee"
                  className="form-group__select"
                  name="assigneeId"
                  value={formData.assigneeId}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
