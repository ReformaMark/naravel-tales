"use client";
import {
  useActiveusers,
  useAllUsers,
} from "@/features/auth/api/use-all-user-count";
import { useCountStories } from "@/features/story/api/use-count-stories";
import { Book, Loader2Icon, User, UserCheck } from "lucide-react";

export default function NumberOfUsers() {
  const numberOfUsers = useAllUsers();
  const numberOfStories = useCountStories();
  const activeUsers = useActiveusers();

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-5 px-3 lg:px-0 mb-3">
      <div className="text-center bg-[#4A4A4A] text-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-100 ">
        <div className="grid grid-cols-3 items-center space-x-2 text-gray-600 mb-2">
          <div className="col-span-2">
            <h1 className="text-base text-white sm:text-lg font-semibold">
              All Users
            </h1>
            {numberOfUsers.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2Icon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
              </div>
            ) : (
              <h2 className="sm:text-4xl font-extrabold text-white text-3xl text-pretty mt-2">
                {numberOfUsers.data?.length}
              </h2>
            )}
          </div>
          <div className="flex justify-end">
            <User className="text-gray-300/50 self-end size-16 lg:size-20 " />
          </div>
        </div>

        {/* <div className="flex justify-end text-white">
          <Link
            href={"/admin/overview/teachers"}
            className="text-sm flex gap-x-1 text-gray-50  items-center"
          >
            More details
            <CaretRightIcon className="text-gray-50  size-7" />
          </Link>
        </div> */}
      </div>
      <div className="text-center bg-[#4B0082] text-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-100 ">
        <div className="grid grid-cols-3 items-center space-x-2 text-gray-600 mb-2">
          <div className="col-span-2">
            <h1 className="text-base text-white sm:text-lg font-semibold">
              Active Users
            </h1>
            {numberOfUsers.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2Icon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
              </div>
            ) : (
              <h2 className="sm:text-4xl font-extrabold text-white text-3xl text-pretty mt-2">
                {activeUsers.data?.length}
              </h2>
            )}
          </div>
          <div className="flex justify-end">
            <UserCheck className="text-gray-300/50 self-end size-16 lg:size-20 " />
          </div>
        </div>

        {/* <div className="flex justify-end text-white">
          <Link
            href={"/admin/overview/teachers"}
            className="text-sm flex gap-x-1 text-gray-50  items-center"
          >
            More details
            <CaretRightIcon className="text-gray-50  size-7" />
          </Link>
        </div> */}
      </div>
      <div className="text-center bg-[#0B3D0B] text-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-100 ">
        <div className="grid grid-cols-3 items-center space-x-2 text-gray-600 mb-2">
          <div className="col-span-2">
            <h1 className="text-base text-white sm:text-lg font-semibold">
              Stories
            </h1>
            {numberOfStories.isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2Icon className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
              </div>
            ) : (
              <h2 className="sm:text-4xl font-extrabold text-white text-3xl text-pretty mt-2">
                {numberOfStories.count}
              </h2>
            )}
          </div>
          <div className="flex justify-end">
            <Book className="text-gray-300/50 self-end size-16 lg:size-20 " />
          </div>
        </div>

        {/* <div className="flex justify-end text-white">
          <Link
            href={"/admin/overview/teachers"}
            className="text-sm flex gap-x-1 text-gray-50  items-center"
          >
            More details
            <CaretRightIcon className="text-gray-50  size-7" />
          </Link>
        </div> */}
      </div>
    </div>
  );
}
