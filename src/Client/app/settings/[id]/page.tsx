"use client";
import React from "react";
import '../../../styles/globals.css'

import { Button ,Link} from "@heroui/react";
import { useParams } from "next/navigation";

const Component: React.FC = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div className="flex items-center justify-center h-[600px]">
      <form className=" p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Account settings : {id}
        </h1>
        <hr/>
        <div className="flex flex-col space-y-2">
          <div className="mt-2 flex items-center">
            <p className=" font-semibold">Username : </p>
            <p className="text-sm ml-3">user-name</p>
          </div>

          <div className="flex items-center">
            <p className=" font-semibold">Email : </p>
            <p className="text-sm ml-3">useremail@gmail.com</p>
          </div>
          <div className="flex items-center">
            <p className=" font-semibold">Password : </p>
            <p className="text-sm ml-3">**********</p>
          </div>
          <div className="flex items-center">
            <p className=" font-semibold">Joined : </p>
            <p className="text-sm ml-3">21 Nov 2024, 10:00PM</p>
          </div>
        </div>
        <Button className="ml-32 mt-5" color="primary"><Link className="text-white" href='/settings/1/change-settings'>Change Settings</Link></Button>
      </form>
    </div>
  );
};
export default Component;