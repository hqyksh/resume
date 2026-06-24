"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
     {
      theme == "light" ? (
        <SunIcon size={22} className="hover:bg-gray-200 dark:hover:bg-gray-800 px-2 w-10 h-10 rounded-md" onClick={() => {
          setTheme("dark");
        }}/>
      ) : (
        <MoonIcon size={22} className="hover:bg-gray-200 dark:hover:bg-gray-800 px-2 w-10 h-10 rounded-md" onClick={() => {
          setTheme("light");
        }}/>
      )
    }
    </>
    // <DropdownMenu>
    //   <DropdownMenuTrigger
    //     asChild
    //     className="focus-visible:ring-0 focus-visible:ring-offset-0"
    //   >
    //      {theme == "system" ? (
    //       <SunIcon size={22}/>
    //     ) : theme == "dark" ? (
    //       <MoonIcon size={22}/>
    //     ) : (
    //       <SunIcon size={22}/>
    //     )}
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent>
    //     {/* <DropdownMenuLabel>Apperence</DropdownMenuLabel>
    //     <DropdownMenuSeparator></DropdownMenuSeparator>
    //     <DropdownMenuCheckboxItem
    //       checked={theme == "system"}
    //       onClick={() => {
    //         setTheme("system");
    //       }}
    //     >System</DropdownMenuCheckboxItem> */}
    //     <DropdownMenuCheckboxItem
    //       checked={theme == "dark"}
    //       onClick={() => {
    //         setTheme("dark");
    //       }}
    //     >Dark</DropdownMenuCheckboxItem>
    //     <DropdownMenuCheckboxItem
    //       checked={theme == "light"}
    //       onClick={() => {
    //         setTheme("light");
    //       }}
    //     >Light</DropdownMenuCheckboxItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default ModeToggle;
