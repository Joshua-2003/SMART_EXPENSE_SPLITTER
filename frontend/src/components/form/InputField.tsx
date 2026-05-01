import type { InputHTMLAttributes } from 'react';
import type { FormFieldProps } from '../../types/form';

interface InputFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'placeholder'>,
    FormFieldProps {
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  error,
  register,
  className = '',
  ...props
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">
        {label}
      </label>
      
      <input
        type={type}
        placeholder={placeholder}
        className={`
          h-9 px-3 rounded-md
          bg-slate-800/50 border border-slate-700
          text-slate-100 placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${errorMessage ? 'border-red-600/70 focus:ring-red-500/50' : ''}
          ${className}
        `}
        {...register}
        {...props}
      />
      
      {errorMessage && (
        <span className="text-xs text-red-400">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default InputField;
