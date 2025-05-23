'use client'

import { Button, InputOtp, Modal, ModalBody, ModalContent } from '@heroui/react'
import { Control, Controller, FieldErrors } from 'react-hook-form'

interface OTPModalProps {
 readonly isOpen: boolean
 readonly onOpenChange: (isOpen: boolean) => void
 readonly control: Control<{ otp: string }>
 readonly handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void
 readonly errors: FieldErrors<{ otp: string }>
}

export default function OTPModal({ isOpen, onOpenChange, control, handleFormSubmit, errors }: OTPModalProps) {
  return (
    <Modal isOpen={isOpen} placement="top-center" size="4xl" classNames={{
      base: 'w-[600px] h-[400px]'
    }} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <ModalBody>
            <form id="#" className="flex flex-col ml-8 gap-6 p-10" onSubmit={handleFormSubmit}>
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOtp
                    classNames={{
                      segmentWrapper: 'gap-x-5',
                      segment: [
                        'relative',
                        'h-24',
                        'w-24',
                        'text-4xl',
                        'mt-12',
                        'border-y',
                        'border-r',
                        'first:rounded-l-md',
                        'first:border-l',
                        'last:rounded-r-md',
                        'border-default-200',
                        'data-[active=true]:border',
                        'data-[active=true]:z-20',
                        'data-[active=true]:ring-2',
                        'data-[active=true]:ring-offset-2',
                        'data-[active=true]:ring-offset-background',
                        'data-[active=true]:ring-foreground',
                      ],
                    }}
                    {...field}
                    errorMessage={errors.otp?.message}
                    isInvalid={!!errors.otp}
                    length={4}
                  />
                )}
                rules={{
                  required: 'OTP is required',
                  minLength: {
                    value: 4,
                    message: 'Please enter a valid OTP',
                  },
                }}
              />
              <Button color="primary" className="max-w-fit ml-32 mt-12 p-8 text-xl" type="submit" variant="solid">
                Verify OTP
              </Button>
            </form>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
