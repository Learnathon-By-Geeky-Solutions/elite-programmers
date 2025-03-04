'use client'

import React from 'react'
import { Button, Input, Form } from '@heroui/react'
import '../../../../styles/globals.css'
import Link from 'next/link'
export default function Component() {
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    }
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col mt-16 gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold text-center mb-6">Password Recovery</h1>
                </div>
                <Form className="flex w-full flex-wrap md:flex-nowrap gap-4 flex-col" validationBehavior="native" onSubmit={handleSubmit}>
                <Input isRequired label="Email Address" name="email" type="email" variant="bordered" />
                    <Input isRequired label="New Password" name="newpassword" type="password" variant="bordered" />
                    <Input isRequired label="Confirm Password" name="newconfirmpassword" type="password" variant="bordered" />
                    <Button className="w-full mt-8 text-medium" color="primary" type="submit">
                        Change Password
                    </Button>
                    <p>Want to create a new account? <Link className="text-blue-500 ml-2" href="/auth/registration">Sign Up</Link></p>
                </Form>
            </div>
        </div>
    )
}
