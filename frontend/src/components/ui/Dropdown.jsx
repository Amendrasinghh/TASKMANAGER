import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger || <ChevronDown className="w-4 h-4" />}
      </div>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-40`}>
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

Dropdown.Item = function DropdownItem({ children, onClick, className = '' }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition ${className}`}>
      {children}
    </button>
  );
};
