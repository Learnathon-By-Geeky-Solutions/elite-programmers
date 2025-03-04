'use client'

import React from 'react'
import { Button, Input, Form } from '@heroui/react'
import '../../../../styles/globals.css'
export default function Component() {
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    }
    return (
        <div className="flex h-full w-full items-center justify-center pt-16">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
                <div className="flex flex-col gap-3">
                    <h1 className="text-xl font-semibold text-center mb-6"> Account Settings</h1>
                </div>
                <Form className="flex w-full flex-wrap md:flex-nowrap gap-4 flex-col" validationBehavior="native" onSubmit={handleSubmit}>
                <Input isRequired label="Username" name="email" type="email" variant="bordered" />
                    <Input isRequired label="Current Password" name="newpassword" type="password" variant="bordered" />
                    <Input isRequired label="New Password" name="newpassword" type="password" variant="bordered" />
                    <Input isRequired label="Confirm Password" name="newconfirmpassword" type="password" variant="bordered" />
                    <Button className="w-full mt-2 text-medium" color="primary" type="submit">
                       Save Changes
                    </Button>
                     </Form>
            </div>
        </div>
    )
}
