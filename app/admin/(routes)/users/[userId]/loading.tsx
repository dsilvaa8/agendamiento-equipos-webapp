"use client";

import { Loader } from "@/components/ui/loader";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center fixed top-0 bottom-0 left-0 right-0">
      <Loader />
    </div>
  );
};

export default Loading;
