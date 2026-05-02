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
      const errorMessage =
        error.response?.data?.error?.message ||
        'Sign up failed. Please try again.';

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
        register={register('email',
          {
            required: 'Email is required',
            maxLength: { value: 255, message: 'Email must be less than 255 characters' },
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email must be a valid email address' },
          }
        )}
        error={errors.email}
      />

      {/* Password Field */}
      <InputField
        label="Password"
        placeholder="Enter your password"
        type="password"
        register={register('password',
          {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
          }
        )}
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
        Log In
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