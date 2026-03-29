import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useTasks } from '../context/TaskContext';

export default function TaskModal({ isOpen, onClose, editTask }) {
  const { addTask, updateTask } = useTasks();

  const initialFormData = editTask
    ? {
        title: editTask.title,
        description: editTask.description || '',
        dueDate: editTask.dueDate || '',
        priority: editTask.priority || 'medium',
      }
    : {
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
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

    if (editTask) {
      updateTask(editTask.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
        priority: formData.priority,
      });
    } else {
      addTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
        priority: formData.priority,
      });
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
