'use client'

import { getAuthToken, setAuthToken } from '@/utils/auth'
import ROUTES from '@/constants/route'
import { useAuth } from '@/context/AuthProvider'
import { Button, Divider, Link, useDisclosure } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback } from 'react'
import { FieldValues, Path, useForm } from 'react-hook-form'
import { ZodType } from 'zod'
import api from '@/utils/api'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import axios from 'axios'
import OTPModal from '@/components/ui/Modal/otp-verification'
import SignUpFormFields from './SignUpFormField'
import SignInFormFields from './SignInFormField'

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>
  formType: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm = <T extends FieldValues>({ schema, formType }: AuthFormProps<T>) => {
  const buttonText = formType === 'SIGN_IN' ? 'Sign In' : 'Sign Up'
  const { login, user: authenticatedUser, fetchUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [uniqueemailerror, setUniqueEmailError] = useState('')
  const [uniqueusernameerror, setUniqueUsernameError] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError: setUniqueError,
    watch,
  } = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

  const {
    handleSubmit: handleOtpSubmit,
    control: otpControl, 
    formState: { errors: otpErrors },
  } = useForm<{ otp: string }>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAuthError = useCallback((error:any, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || defaultMessage)
    } else {
      toast.error(defaultMessage)
    }
    setError(error?.response?.data?.message || defaultMessage); 
  }, []);

  const checkUserUniqueness = useCallback(
    async (field: 'username' | 'email', value: string) => {
      if (!value) return;
      try {
        const response = await api.post(ROUTES.ISUSERUNIQUE, { [field]: value });
        if (response.data.isUnique === false) {
          if (field === 'username') setUniqueUsernameError('Username is already taken');
          else setUniqueEmailError('Email is already taken');
        } else {
          if (field === 'username') setUniqueUsernameError('');
          else setUniqueEmailError('');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.errors) {
          Object.values(error.response.data.errors).forEach((errorMessages) => {
            if (Array.isArray(errorMessages)) {
              errorMessages.forEach((message) => {
                if (message.includes(field === 'username' ? 'Username' : 'Email')) {
                  setUniqueError(field as Path<T>, { type: 'manual', message });
                }
              });
            }
          });
        }
        return false;
      }
    },
    [setUniqueError]
  );

  const handleFieldBlur = useCallback(
    async (field: 'username' | 'email') => {
      const value = watch(field as Path<T>);
      if (field === 'username') setUniqueUsernameError('');
      if (field === 'email') setUniqueEmailError('');

      if (value) {
        await trigger(field as Path<T>);
        if (!errors[field]) {
          await checkUserUniqueness(field, value);
        }
      }
    },
    [checkUserUniqueness, errors, trigger, watch]
  );

  const handleOtpVerification = useCallback(
    async (otpData: { otp: string }) => {
      if (otpVerified) return;
      if (!otpData.otp) {
        toast.error('OTP is required');
        return;
      }

      try {
        const verifyResponse = await api.post(ROUTES.ISVALIDOTP, {
          email: formData?.email,
          otp: otpData.otp,
        });

        if (verifyResponse.data.isValidOtp) {
          setOtpVerified(true);
          setFormData(null);
          toast.success('OTP verified successfully!');
          return true; 
        } else {
          toast.error(verifyResponse.data?.message || 'Invalid OTP. Please try again.');
          return false; 
        }
      } catch (error) {
        handleAuthError(error, 'Failed to verify OTP. Please try again.');
        return false; 
      }
    },
    [formData, handleAuthError, otpVerified]
  );
  const onSubmit = useCallback(
    async (data: T) => {
      setLoading(true);
      try {
        const response = await api.post(ROUTES.SENDOTP, { email: data.email });
        if (response.status === 200) {
          toast.success('OTP sent to your email. Please check your inbox.');
          setFormData(data);
          onOpen();
        }
      } catch (error) {
        handleAuthError(error, 'Failed to send OTP.');
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, onOpen]
  );

  const onOtpSubmit = useCallback(
    async (data: { otp: string }) => {
      const isOtpValid = await handleOtpVerification(data);
      if (isOtpValid) {
        try {
          const response = await api.post(ROUTES.REGISTER, {
            username: formData?.username,
            email: formData?.email,
            password: formData?.password,
            otp: data.otp,
          });

          if (response.status === 200) {
            toast.success('Signup successful!');
            router.push(ROUTES.PROFILE_SETUP);
            setAuthToken(response.data.token, false);
            fetchUser();
          } else {
            router.push(ROUTES.SIGN_UP);
          }
        } catch (error) {
          handleAuthError(error, 'Failed to Register. Please try again.');
        } finally {
          onOpenChange();
        }
      }
    },
    [formData, handleAuthError, handleOtpVerification, fetchUser, onOpenChange, router]
  );

  const handleSignin = useCallback(
    async (data: T) => {
      if (getAuthToken()) {
        if (authenticatedUser?.roles.includes('Admin')) {
          router.push(ROUTES.OVERVIEW);
        } else {
          router.push(ROUTES.HOME);
        }
      } else {
        login(data.usernameOrEmail, data.password, setError, rememberMe);
      }
    },
    [authenticatedUser, login, rememberMe, router, setError]
  );



  return (
    <div>
      <form
        onSubmit={formType === 'SIGN_IN' ? handleSubmit(handleSignin) : handleSubmit(onSubmit)}
        className="flex w-full flex-wrap gap-4 flex-col"
      >
        {error && <p className="text-red-500">{error}</p>}
        {formType === 'SIGN_IN' ? (
                    <SignInFormFields
                        register={register}
                        errors={errors}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                    />
                ) : (
                    <SignUpFormFields
                        register={register}
                        errors={errors}
                        uniqueusernameerror={uniqueusernameerror}
                        uniqueemailerror={uniqueemailerror}
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        isConfirmVisible={isConfirmVisible}
                        setIsConfirmVisible={setIsConfirmVisible}
                        handleFieldBlur={handleFieldBlur}
                    />
                )}
        <Button className="w-full text-white" color="primary" type="submit" isDisabled={loading}>
          {!loading ? buttonText : 'Processing...'}
        </Button>
      </form>

      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1" />
      </div>

      <div className="flex flex-col gap-2">
        <Button className="w-full" startContent={<Icon icon="flat-color-icons:google" />} variant="bordered">
          Continue with Google
        </Button>
        <Button
          className="w-full"
          startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
          variant="bordered"
        >
          Continue with Github
        </Button>
      </div>

      {formType === 'SIGN_IN' ? (
        <p className="w-full flex gap-2 text-center text-sm items-center justify-center">
          Need to create an account?
          <Link href={ROUTES.SIGN_UP}>Sign up</Link>
        </p>
      ) : (
        <p className="w-full flex gap-2 text-center text-sm items-center justify-center">
          Already have an account?
          <Link href={ROUTES.SIGN_IN}>Sign in</Link>
        </p>
      )}

      <OTPModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleFormSubmit={handleOtpSubmit(onOtpSubmit)}
        control={otpControl} 
        errors={otpErrors}
      />
    </div>
  );
};

export default AuthForm