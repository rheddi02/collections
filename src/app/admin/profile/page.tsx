"use client";
import { CameraIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const Profile = () => {
  const { data: session } = useSession();
  return (
    <div className="">
      <div className="relative flex h-80 items-center justify-center bg-gray-200">
        {session?.user.cover ? (
          <Image
            src={session?.user.cover || ""}
            alt="cover"
            fill
            className="object-cover"
          />
        ) : (
          <CameraIcon className="h-10 w-10" />
        )}
      </div>
      <div className="flex gap-5">
        <div className="-mt-28 w-1/4">
          <div className="relative ml-auto flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-300">
            {session?.user.profile ? (
              <Image
                src={session?.user.profile || ""}
                alt="profile"
                fill
                className="object-cover"
              />
            ) : (
              <CameraIcon className="h-10 w-10" />
            )}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-2xl font-bold uppercase">{session?.user.name}</p>
          <p>
            {session?.user.email}
          </p>
          <div className="mt-2 flex gap-5">
            <span> <strong>1000</strong> Links</span>
            <span> <strong>100</strong> Categories</span>
          </div>
        </div>
      </div>
      <div className=" mx-auto mt-10 w-3/4">
        <form>
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Profile Settings</p>
            <Button type="button" onClick={() => alert('TBA')}>Update</Button>
          </div>
          <div className="mt-5 flex flex-col gap-5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Update your name"
              value={session?.user.name}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Change password"
              type="password"
            />
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              placeholder="Confirm password"
              type="password"
            />
          </div>
        </form>
        <p className="mt-5 text-center text-sm text-gray-600">
          Manage your profile settings and preferences here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
