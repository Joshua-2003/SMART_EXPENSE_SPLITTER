import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputField from '../../components/form/InputField';
import { Button } from '../../components/ui/Button';
import FormWrapper from '../../components/form/FormWrapper';
import type { SignUpFormInputs } from "../../types/form";
import { authService } from "../../services/auth/auth.service";
import { useAuth } from '../../hooks/useAuth';

export default function SignUpPage() {
    const [apiError, setApiError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormInputs>({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
    });

    const onSubmit = async (data: SignUpFormInputs) => {
        setApiError(null);

        try {
            const res = await authService.register(data);
            const { token, user } = res.data;

            localStorage.setItem("token", token);
            setUser(user);

            navigate('/dashboard', { replace: true }); // Redirect to dashboard after successful registration
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Sign up failed. Please try again.';

            setApiError(errorMessage);
            console.error('Sign up   error:', error.response);
        }
    }

    return (
       <FormWrapper
             title="Sign Up"
             subtitle="Register your SplitWise account"
             onSubmit={handleSubmit(onSubmit)}
           >
             {/* API Error Message */}
             {apiError && (
               <div className="p-3 rounded-md bg-red-500/10 border border-red-600/70">
                 <p className="text-sm text-red-400">{apiError}</p>
               </div>
             )}

             {/* Name Field */}
             <InputField
               label="Full Name"
               placeholder="John Doe"
               type="text"
               register={register('name', { required: 'Name is required' })}
               error={errors.name}
             />

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
               Sign Up
             </Button>
       
             {/* Sign Up Link */}
             <div className="text-center mt-4">
               <p className="text-sm text-slate-400">
                 Already have an account?{' '}
                 <a
                   href="/login"
                   className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                 >
                   Log in
                 </a>
               </p>
             </div>
        </FormWrapper>
    )
}