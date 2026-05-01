import type { ReactNode, SubmitEvent, FC } from "react";
interface FormWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}

export const FormWrapper: FC<FormWrapperProps> = ({
  title,
  subtitle,
  children,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-slate-950">
      <div className="w-full max-w-sm">
        {/* Card Container */}
        <div className="rounded-lg bg-slate-900/50 border border-slate-800 p-6 md:p-8">
          {/* Header */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-slate-100">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
          </form>
        </div>

        {/* Footer Link (optional) */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Part of <span className="font-semibold text-slate-400">SplitWise</span>
        </p>
      </div>
    </div>
  );
};

export default FormWrapper;
