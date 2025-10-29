import React, { Fragment } from 'react';
// FIX: Corrected import path for types.
import { type TodoItem, type View } from '../types';
import { ClipboardListIcon, CreditCardIcon, XIcon } from './Icons';

interface TodoListProps {
  isOpen: boolean;
  onClose: () => void;
  todos: TodoItem[];
  onTodoClick: (view: View) => void;
}

const ICONS_BY_TYPE: { [key in TodoItem['type']]: React.ReactElement } = {
  booking: <ClipboardListIcon className="h-5 w-5 text-purple-500" />,
  payment: <CreditCardIcon className="h-5 w-5 text-blue-500" />,
  task: <ClipboardListIcon className="h-5 w-5 text-green-500" />,
};

const VIEW_BY_TYPE: { [key in TodoItem['type']]: View | null } = {
    booking: 'reservas',
    payment: 'pagos',
    task: null, // o una vista de 'tareas' si existiera
}

const TodoList: React.FC<TodoListProps> = ({ isOpen, onClose, todos, onTodoClick }) => {

  const handleItemClick = (type: TodoItem['type']) => {
    const targetView = VIEW_BY_TYPE[type];
    if(targetView) {
        onTodoClick(targetView);
    }
  }

  return (
    <Fragment>
      {/* Background overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sliding panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold text-dark-gray">Tareas Pendientes ({todos.length})</h3>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
              <XIcon className="h-6 w-6" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            {todos.length > 0 ? (
              <ul className="space-y-3">
                {todos.map((todo) => {
                  const isClickable = VIEW_BY_TYPE[todo.type] !== null;
                  return (
                    <li key={todo.id}>
                        <button
                            onClick={() => handleItemClick(todo.type)}
                            disabled={!isClickable}
                            className={`w-full flex items-start p-3 text-left bg-gray-50 rounded-lg transition-colors ${isClickable ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className="flex-shrink-0 mr-3 mt-1">
                                {ICONS_BY_TYPE[todo.type]}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{todo.title}</p>
                                <p className="text-sm text-gray-500">{todo.description}</p>
                            </div>
                        </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-10">¡Todo en orden! No hay tareas pendientes.</p>
            )}
          </div>
        </div>
      </aside>
    </Fragment>
  );
};

export default TodoList;
