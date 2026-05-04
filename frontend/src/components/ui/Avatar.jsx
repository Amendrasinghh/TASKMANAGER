export default function Avatar({ name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-6 h-6 text-xs', md: 'w-8 h-8 text-xs', lg: 'w-12 h-12 text-sm' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className={`${sizes[size]} bg-indigo-100 rounded-full flex items-center justify-center font-medium text-indigo-700 ${className}`}>
      {initials}
    </div>
  );
}
