import React, { Suspense } from "react";

import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/Heading";
import { ClientSearch } from "./client-search";

const BlogPage = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const params = await searchParams;
  const page = Number(params.page || 1);
  
  return (
    <div className='text-white mx-auto lg:w-2/3 px-8 lg:px-0 mb-20'>
      <div className="h-full w-full relative flex flex-col items-start gap-5 overflow-hidden">
        <div className="flex flex-col gap-3">
          <Heading>Blog</Heading>
          <FramerWrapper y={0} x={200}>
            <p className=" font-poppins text-lg w-full max-sm:text-base">
              I love to Build Cool Projects. Here, you&#x27;ll find a curated
              collection of my creative endeavors and technical projects. Each
              piece represents a journey of innovation, problem-solving, and
              continuous learning. Feel free to explore this showcase of my
              passion and expertise in action.
            </p>
          </FramerWrapper>
        </div>
      </div>

      <Suspense>
        <ClientSearch />
      </Suspense>
    </div>
  );
};

export default BlogPage;