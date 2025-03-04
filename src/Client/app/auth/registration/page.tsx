"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { Button, Input, Checkbox, Link, useDisclosure, Modal, ModalContent, ModalBody, InputOtp } from "@heroui/react";
import { Icon } from "@iconify/react";
import '../../../styles/globals.css';
import { useRouter } from 'next/navigation';
import toast,{Toaster} from "react-hot-toast";
import { Controller, SubmitHandler, useForm } from "react-hook-form";


interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

export default function Signup() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user,setUser]=useState("");
    const [pass,setPassword]=useState("");
    const [emailError, setEmailError] = useState<string>("");
    const [userError, setUserError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
    const [contactInfo, setContactInfo] = useState("");
    const router = useRouter();

    const {
        handleSubmit: handleFormSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>();

    interface FormValues {
        otp: string;
        email: string;
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (!data.otp) {
                toast.error("Email and OTP are required.");
                return;
            }
            const verifyResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_AUTH_URL}/IsValidOtp`,
                { email: contactInfo, otp: data.otp },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("OTP Verification Response:", verifyResponse.data);
            if (verifyResponse.data.isValidOtp) {
                toast.success("OTP verified successfully!");
                console.log("enter 1");
                const registerResponse = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/Register`,
                    {
                        username: user,
                        email: contactInfo,
                        password: pass,
                        otp: data.otp
                    }
                );
                console.log("Register Response:", registerResponse.data);
                toast.success("Signup successful!");  
                router.push("/auth/login");
            } else {
                toast.error(verifyResponse.data?.message || "Invalid OTP. Please try again.");
                console.log("invalid otp")
                router.push('/registration')
            }
        } catch (error) {
            // console.error("Error verifying OTP:", error.response?.data?.errors || error.message);
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.errors) {
                    Object.values(error.response?.data?.errors).forEach((errorMessages) => {
                        if (Array.isArray(errorMessages)) {
                            errorMessages.forEach((message) => {
                                if (message.includes('Password')) setPasswordError(message);
                            });
                        } else if (typeof errorMessages === "string") {
                            toast.error(errorMessages);
                        }
                    });
                }
            }
        }
    };
    const isValidPassword = (password: string): boolean => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
            [name]: type === "checkbox"? checked: value,
        }));

        if (name === "email") {
            setEmailError("");
        }else if (name === "username") {
            setUserError("");
        } else if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
            setMessage(""); 
        }
    };

    useEffect(() => {
        const checkEmailUnique = async () => {
            if (!formData.username) return;
            setCheckingEmail(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/IsUserUnique`,
               { username: formData.username, email: "" });

                if (!response.data.isUnique) {
                    setUserError("username is already taken.");
                } else {
                    setUserError("");
                }
            }
            catch (error) {
                // console.error("Error checking uniqueness:", error.response?.data?.errors || error.message);
                if (axios.isAxiosError(error)) {
                    if (error.response?.data?.errors) {
                        Object.values(error.response?.data?.errors).forEach((errorMessages) => {
                            if (Array.isArray(errorMessages)) {
                                errorMessages.forEach((message) => {
                                    if (message.includes('Username')) setUserError(message);
                                });
                            } else if (typeof errorMessages === "string") {
                                toast.error(errorMessages);
                            }
                        });
                    }
                }
            }
            finally {
                setCheckingEmail(false);
            }
        };

        checkEmailUnique();
    }, [formData.username]); 
    
    useEffect(() => {
        const checkEmailUnique = async () => {
            if (!formData.email) return;
            setCheckingEmail(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/IsUserUnique`,
               { username: "", email: formData.email });

                if (!response.data.isUnique) {
                    setEmailError("Email is already taken.");
                } else {
                    setEmailError("");
                }
            }
            catch (error) {
                // console.error("Error checking uniqueness:", error.response?.data?.errors || error.message);
                if (axios.isAxiosError(error)) {
                    if (error.response?.data?.errors) {
                        Object.values(error.response?.data?.errors).forEach((errorMessages) => {
                            if (Array.isArray(errorMessages)) {
                                errorMessages.forEach((message) => {
                                  if (message.includes('Email')) setEmailError(message);
                                });
                            } else if (typeof errorMessages === "string") {
                                toast.error(errorMessages);
                            }
                        });
                    }
                }
            }
            finally {
                setCheckingEmail(false);
            }
        };

        checkEmailUnique();
    }, [formData.email]); 
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        if (!formData.agreeTerms) {
            setMessage("You must agree to the terms.");
            return;
        }
        if (formData.password!== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        if (!isValidPassword(formData.password)) {
            setPasswordError("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.");
            return;
        }
        if (emailError) {
            setEmailError("Please use a unique email.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/SendOtp`,
                JSON.stringify({ email: formData.email }), {
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.status === 200) {
                toast.success("OTP sent to your email. Please check your inbox.");
                onOpen();
                setContactInfo(formData.email); 
                setUser(formData.username);
                setPassword(formData.password);
            } else {
                toast.error(response.data?.message || "Failed to send OTP.");
            }
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to send OTP.");
            } else {
                toast.error("An unexpected error occurred while sending OTP.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-[600px] bg-gray-100">
            <div className="flex h-full w-full items-center justify-center">
                <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 shadow-small">
                    <p className="pb-4 text-center text-3xl font-semibold">Sign Up</p>

                    {message && <p className="text-center text-sm text-red-500">{message}</p>}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <Input
                            isRequired
                            label="Username"
                            name="username"
                            type="text"
                            variant="bordered"
                            value={formData.username}
                            onChange={handleChange}
                        />
                           {userError && (
                                <p className="text-sm text-red-500 mt-1">{userError}</p>
                            )}
                        <div className="relative">
                            <Input
                                isRequired
                                label="Email"
                                name="email"
                                type="email"
                                variant="bordered"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {checkingEmail && (
                                <p className="text-sm text-gray-500 mt-1">Checking email...</p>
                            )}
                            {emailError && (
                                <p className="text-sm text-red-500 mt-1">{emailError}</p>
                            )}
                        </div>
                        <Input
                            isRequired
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    <Icon className="text-2xl text-default-400" icon={isVisible? "solar:eye-closed-linear": "solar:eye-bold"} />
                                </button>
                            }
                            label="Password"
                            name="password"
                            type={isVisible? "text": "password"}
                            variant="bordered"
                            value={formData.password}
                            onChange={handleChange}
                        />
                         {passwordError && <p className="text-center text-sm text-red-500">{passwordError}</p>}
                        <Input
                            isRequired
                            endContent={
                                <button type="button" onClick={toggleConfirmVisibility}>
                                    <Icon className="text-2xl text-default-400" icon={isConfirmVisible? "solar:eye-closed-linear": "solar:eye-bold"} />
                                </button>
                            }
                            label="Confirm Password"
                            name="confirmPassword"
                            type={isConfirmVisible? "text": "password"}
                            variant="bordered"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <Checkbox
                            isRequired
                            className="py-4"
                            size="sm"
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                        >
                            I agree with the &nbsp;
                            <Link href="#" size="sm">Terms</Link>&nbsp; and &nbsp;
                            <Link href="#" size="sm">Privacy Policy</Link>
                        </Checkbox>
                        <Button color="primary" type="submit" isDisabled={loading ||!!emailError}>
                            {loading? "Signing Up...": "Sign Up"}
                        </Button>
                    </form>

                    <p className="text-center text-small">
                        Already have an account?
                        <Link className='ml-2' href="/auth/login" size="sm">Log In</Link>
                    </p>
                </div>
            </div>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalBody>
                                <form className="flex flex-col gap-6 ml-10 p-10" onSubmit={handleFormSubmit(onSubmit)}>
                                    <Controller
                                        control={control}
                                        name="otp"
                                        render={({ field }) => (
                                            <InputOtp
                                                classNames={{
                                                    segmentWrapper: "gap-x-5",
                                                    segment: [
                                                        "relative",
                                                        "h-12",
                                                        "w-12",
                                                        "border-y",
                                                        "border-r",
                                                        "first:rounded-l-md",
                                                        "first:border-l",
                                                        "last:rounded-r-md",
                                                        "border-default-200",
                                                        "data-[active=true]:border",
                                                        "data-[active=true]:z-20",
                                                        "data-[active=true]:ring-2",
                                                        "data-[active=true]:ring-offset-2",
                                                        "data-[active=true]:ring-offset-background",
                                                        "data-[active=true]:ring-foreground",
                                                    ],
                                                }}
                                                {...field}
                                                errorMessage={errors.otp?.message}
                                                isInvalid={!!errors.otp}
                                                length={4}
                                            />
                                        )}
                                        rules={{
                                            required: "OTP is required",
                                            minLength: {
                                                value: 4,
                                                message: "Please enter a valid OTP",
                                            },
                                        }}
                                    />
                                    <Button
                                        color="primary"
                                        className="max-w-fit ml-20"
                                        type="submit"
                                        variant="solid"
                                    >
                                        Verify OTP
                                    </Button>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Toaster />
        </div>
    );
}