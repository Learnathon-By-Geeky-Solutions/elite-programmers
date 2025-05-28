'use Client'

import React, { useCallback } from 'react';
import { Input, Checkbox, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface SignUpFormFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  handleFieldBlur: (field: 'username' | 'email') => Promise<void>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isConfirmVisible: boolean;
  setIsConfirmVisible: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueusernameerror: string;
  uniqueemailerror: string;
}

const SignUpFormFields = <T extends FieldValues>({
  register,
  errors,
  handleFieldBlur,
  isVisible,
  setIsVisible,
  isConfirmVisible,
  setIsConfirmVisible,
  uniqueusernameerror,
  uniqueemailerror,
}: SignUpFormFieldsProps<T>) => {
  const renderSignUpFields = useCallback(() => {
    return (
      <>
        <Input
          {...register('username' as Path<T>)}
          onBlur={() => handleFieldBlur('username')}
         isRequired
          label="Username"
          type="text"
          className=" rounded-xl"
        />
        {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username.message as string}</p>}
        {uniqueusernameerror && <p className="text-red-500">{uniqueusernameerror}</p>}
        <Input
          {...register('email' as Path<T>)}
          onBlur={() => handleFieldBlur('email')}
          isRequired
          label="Email"
          type="email"
          className=" rounded-xl"
        />
        {uniqueemailerror && <p className="text-red-500">{uniqueemailerror}</p>}
        <Input
          {...register('password' as Path<T>)}
          className=" rounded-xl"
         isRequired
          endContent={
            <button type="button" onClick={() => setIsVisible(!isVisible)}>
              <Icon
                className="text-2xl text-default-400"
                icon={isVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'}/>
            </button>
          }
          label="Password"
          type={isVisible ? 'text' : 'password'}/>
        {errors.password && <p className="text-sm text-red-500">{errors.password.message as string}</p>}
        <Input
          {...register('confirmPassword' as Path<T>)}
          className=" rounded-xl"
          isRequired
          endContent={
            <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)}>
              <Icon
                className="text-2xl text-default-400"
                icon={isConfirmVisible ? 'solar:eye-closed-linear' : 'solar:eye-bold'}/>
            </button>
          }
          label="Confirm Password"
          type={isConfirmVisible ? 'text' : 'password'}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>
        )}
        <Checkbox {...register('agreeTerms' as Path<T>)} className="pt-4 pb-0" size="sm">
          I agree with the &nbsp;
          <Link href="#" size="sm">Terms</Link>&nbsp; and &nbsp;
          <Link href="#" size="sm">Privacy Policy</Link>
        </Checkbox>
        {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms.message as string}</p>}
      </>
    );
  }, [errors.agreeTerms, errors.confirmPassword, errors.password, errors.username, handleFieldBlur, isConfirmVisible, isVisible, register, setIsConfirmVisible, setIsVisible, uniqueemailerror, uniqueusernameerror]);

  return renderSignUpFields();
};

export default SignUpFormFields;