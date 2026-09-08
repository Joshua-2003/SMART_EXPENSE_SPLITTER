import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginSuccess, setLoading } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ROUTES } from '../../constants/routes';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { allUsers, isLoading } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    dispatch(setLoading(true));

    // Simulate API authentication response (POST /api/auth/login)
    setTimeout(() => {
      const matchedUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      ) || allUsers[0];

      dispatch(
        loginSuccess({
          user: matchedUser,
          token: `mock-jwt-token-${matchedUser.id}`,
        })
      );
      dispatch(setLoading(false));
      dispatch(
        addToast({
          type: 'success',
          title: 'Welcome back',
          message: `Signed in as ${matchedUser.name}`,
        })
      );
      navigate(ROUTES.DASHBOARD);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Sign in to your account</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Access your shared expense groups and balances
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-3.5 h-3.5" />}
        placeholder="alex.rivera@example.com"
      />

      <Input
        label="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        leftIcon={<Lock className="w-3.5 h-3.5" />}
        placeholder="••••••••"
      />

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Sign In
        </Button>
      </div>

      <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
        Don&apos;t have an account yet?{' '}
        <Link to={ROUTES.SIGNUP} className="font-medium text-emerald-600 hover:text-emerald-700">
          Sign up
        </Link>
      </div>
    </form>
  );
};
