'use client';

import {
    Button,
    DatePicker,
    Input,
    Textarea,
    TimeInput,
    useDisclosure
} from '@heroui/react';

import React, { useState ,FormEvent} from 'react';
import { CalendarDate, parseDate, Time } from "@internationalized/date";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface FormData {
    title: string;
    description: string;
    durationMinutes: number; 
    opensAt: string;
    closesAt: string;
}

function parseTime(time: string): Time | null {
    if (!time) return null;
    const [hour, minute] = time.split(':').map(Number);
    return new Time(hour, minute);
}

export default function Component() {
    const [date, setDate] = useState<CalendarDate | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const handleProblemSolve = () => {
        window.open('/problem-solving-ques', '_blank');
    }
    const handleWrittenQues = () => {
        window.open('/written-ques', '_blank');
    }
    const handleMCQ = () => {
        window.open('/mcq-ques', '_blank');
    }
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        durationMinutes: 0, 
        opensAt: "",
        closesAt: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date: CalendarDate | null) => {
        setDate(date);
    };

    const handleTimeChange = (name: "opensAt" | "closesAt", value: Time | null) => {
        setFormData(prevState => {
            if (value) {
                const updatedFormData = { ...prevState, [name]: value.toString() }; 
                if (updatedFormData.opensAt && updatedFormData.closesAt) {
                    const opensAtTime = parseTime(updatedFormData.opensAt);
                    const closesAtTime = parseTime(updatedFormData.closesAt);

                    if (opensAtTime && closesAtTime) {
                        const startMinutes = opensAtTime.hour * 60 + opensAtTime.minute;
                        const endMinutes = closesAtTime.hour * 60 + closesAtTime.minute;
                        const duration = endMinutes - startMinutes;

                        updatedFormData.durationMinutes = duration > 0 ? duration : 0;
                    }
                    console.log("duration ", updatedFormData.durationMinutes);
                }
                return updatedFormData;
            } else {
                return { ...prevState, [name]: "" };
            }
        });
    };
    const handleCreateExam = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        console.log(formData);

        try {
            const opensAtTime = parseTime(formData.opensAt);
            const closesAtTime = parseTime(formData.closesAt);

            if (!opensAtTime || !closesAtTime || !date) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }
            const dateObj = parseDate(date.toString());
            const opensAtDate = new Date(
                dateObj.year, 
                dateObj.month - 1, 
                dateObj.day, 
                opensAtTime.hour,
                opensAtTime.minute,0,0
            );
            const closesAtDate = new Date(
                dateObj.year, 
                dateObj.month - 1, 
                dateObj.day, 
                closesAtTime.hour,
                closesAtTime.minute, 0, 0
            );

            const formattedOpensAt = opensAtDate.toISOString().replace(/\.000Z$/, ".983Z");
            const formattedClosesAt = closesAtDate.toISOString().replace(/\.000Z$/, ".983Z");

            console.log(formattedOpensAt, " ", formattedClosesAt);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/Exam`, {
                ...formData,
                opensAt: formattedOpensAt,
                closesAt: formattedClosesAt,
            });

            if (response.status === 200) {
                onOpen();
                setFormData({
                    title: '',
                    description: '',
                    durationMinutes: 0,
                    opensAt: '',
                    closesAt: '',
                });
                setDate(null);
            } else {
                toast.error(response.data?.message || 'Failed to create exam.');
            }
        } catch (error) {
            console.error('Error creating exam:', error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Failed to create exam.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
   }
    return (
        <div className='flex flex-col justify-between h-screen mx-auto items-center mt-12'>
            <form className="flex gap-4 flex-wrap flex-col" onSubmit={handleCreateExam}>
                <Input
                    isRequired
                    label="Title"
                    name="title"
                    type="text"
                    variant="bordered"
                    value={formData.title}
                    onChange={handleChange}
                />
                <Textarea
                    isRequired
                    label="Description"
                    name="description"
                    type="text"
                    variant="bordered"
                    value={formData.description}
                    onChange={handleChange}
                />
                <div className="flex gap-5">
                    <DatePicker
                        className="flex-1"
                        isRequired
                        label="Date"
                        name="date"
                        value={date}
                        onChange={handleDateChange}
                    />
                    <Input
                        className="flex-1"
                        isRequired
                        label="Total Points"
                        name="totalpoints"
                        type="text"
                        variant="bordered"
                    />
                </div>
                <div className="flex gap-5">
                    <TimeInput
                        label="Start Time"
                        name="opensAt"
                        value={parseTime(formData.opensAt)}
                        onChange={(value) => handleTimeChange("opensAt", value as Time)}
                        isRequired/>
                    <TimeInput
                        label="End Time"
                        name="closesAt"
                        value={parseTime(formData.closesAt)}
                        onChange={(value) => handleTimeChange("closesAt", value as Time)}
                        isRequired />
                </div>
                <div className="flex-1 mt-2 ml-96 pl-96">
                    <Button color="success">Publish</Button>
                    <Button color="danger" className="mx-3"> Delete</Button>
                    <Button color="primary" type="submit"> Save </Button>
                </div>
            </form>
            <div className="flex gap-3 my-4">
                <Button color="primary" onPress={handleProblemSolve}>Add Problem Solving Question</Button>
                <Button color="primary" onPress={handleWrittenQues}>Add Written Question</Button>
                <Button color="primary" onPress={handleMCQ}>Add MCQ Question</Button>
            </div>
            {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <p>Exam Created Successfully</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal> */}
            <Toaster/>
        </div >
    );
}
