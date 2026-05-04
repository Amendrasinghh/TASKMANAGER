import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColors[type]} shadow-lg`}>
      {icons[type]}
      <p className="text-sm text-gray-700 flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="p-0.5 hover:bg-black/5 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
