import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">404 - Page Not Found</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The screen or group link you are looking for does not exist or has been moved.
          </p>
        </div>
        <div>
          <Link to={ROUTES.DASHBOARD}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
