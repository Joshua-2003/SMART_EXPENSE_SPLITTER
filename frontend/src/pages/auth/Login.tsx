import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputField from '../../components/form/InputField';
import { Button } from '../../components/ui/Button';
import FormWrapper from '../../components/form/FormWrapper';
import { useAuth } from '../../hooks/useAuth';
import type { LoginFormInputs } from '../../types/form';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: 'onBlur', 
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError(null);

    try {
      await login(data.email, data.password);

      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      // Handle API errors
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.';

      setApiError(errorMessage);
      console.error('Login error:', error);
    }
  };

  return (
    <FormWrapper
      title="Welcome Back"
      subtitle="Sign in to your SplitWise account"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* API Error Message */}
      {apiError && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-600/70">
          <p className="text-sm text-red-400">{apiError}</p>
        </div>
      )}

      {/* Email Field */}
      <InputField
        label="Email Address"
        placeholder="name@example.com"
        type="email"
        register={register('email', { required: 'Email is required' })}
        error={errors.email}
      />

      {/* Password Field */}
      <InputField
        label="Password"
        placeholder="Enter your password"
        type="password"
        register={register('password', { required: 'Password is required' })}
        error={errors.password}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        className="w-full mt-6"
      >
        Sign In
      </Button>

      {/* Sign Up Link */}
      <div className="text-center mt-4">
        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </FormWrapper>
  );
}