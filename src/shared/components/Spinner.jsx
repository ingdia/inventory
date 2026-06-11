const sizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <span
    className={`inline-block animate-spin rounded-full border-2
      border-cyan-200 border-t-cyan-600
      dark:border-gray-600 dark:border-t-cyan-400
      ${sizes[size] || sizes.md} ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;