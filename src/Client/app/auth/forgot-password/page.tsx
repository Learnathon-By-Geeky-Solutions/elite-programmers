"use client";
import React, { useState } from "react";
import '../../../styles/globals.css'
import { InputOtp } from "@heroui/input-otp";
import { Button } from "@heroui/react";
import Link from "next/link";
const ForgotPasswordPage: React.FC = () => {
    const [contactInfo, setContactInfo] = useState("");
    // const [mail, setEmail] = useState("");
    // const [message, setMessage] = useState("");
    // const [isEmailSent, setIsEmailSent] = useState(false);
    // const [isEmailVerified, setIsEmailVerified] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(true);

    // const validateContactInfo = (info: string): boolean => {
    //     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return re.test(info);
    // };
    // const handleGenerateEmail = async () => {
    //     if (!contactInfo) {
    //         toast.error("Email Address is required");
    //         // setIsSuccess(false);
    //         return;
    //     }
    //     if (!validateContactInfo(contactInfo)) {
    //         toast.error("Invalid email format");
    //         // setIsSuccess(false);
    //         return;
    //     }
    // };
    const [value, setValue] = React.useState("");
    return (
        <div className="flex items-center justify-center h-[600px]">
            <form className=" p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    Password Recovery
                </h1>
                <>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded mb-4" />
                    <div className="flex  items-center gap-2">
                        <div className="text-small text-default-500">
                           Enter OTP code : 
                        </div>
                        <InputOtp length={4} value={value} onValueChange={setValue} />
                    </div>
                   <Button className="my-4 w-full" color="primary"><Link href="/auth/forgot-password/reset-password">Reset Password</Link></Button>
                   <p>Want to create a new account? <Link className="text-blue-500 ml-2" href="/auth/registration">Sign Up</Link></p>
                </>
            </form>
        </div>
    );
};
export default ForgotPasswordPage;