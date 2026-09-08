import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginSuccess, setLoading } from '../../store/slices/authSlice';
import { addToast } from '../../store/slices/uiSlice';
import { ROUTES } from '../../constants/routes';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    dispatch(setLoading(true));

    // Simulate API registration response (POST /api/auth/signup)
    setTimeout(() => {
      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      };

      dispatch(
        loginSuccess({
          user: newUser,
          token: `mock-jwt-token-${newUser.id}`,
        })
      );
      dispatch(setLoading(false));
      dispatch(
        addToast({
          type: 'success',
          title: 'Account created',
          message: `Welcome to Smart Expense Splitter, ${newUser.name}!`,
        })
      );
      navigate(ROUTES.DASHBOARD);
    }, 450);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Join or create expense groups with instant transparency
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Full name"
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        leftIcon={<User className="w-3.5 h-3.5" />}
        placeholder="Juan Dela Cruz"
      />

      <Input
        label="Email address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        leftIcon={<Mail className="w-3.5 h-3.5" />}
        placeholder="juan@example.com"
      />

      <Input
        label="Password"
        type="password"
        required
        helperText="Minimum 8 characters"
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
          Create Account
        </Button>
      </div>

      <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-emerald-600 hover:text-emerald-700">
          Sign in
        </Link>
      </div>
    </form>
  );
};
