"use client";

import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";
import { Menu, X } from 'lucide-react';
import MenuOverlay from "./MenuOverlay";
import { usePathname, useParams} from "next/navigation";
import ModeToggle from "./mode-toggle";
import Language from "./language";
import LocaleLink from '@/components/LocaleLink';

import { Dictionary } from '@/types';

const Navbar = ({dict}: {dict: Dictionary}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const pathName = usePathname();
  const params   = useParams(); 
  const navLinks = dict?.navLink;
  
  const toggleMenu = () => {
    setNavbarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setNavbarOpen(false);
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <nav className="fixed mx-auto border-b dark:border-[#33353F] border-gray-200 top-0 left-0 right-0 bg-gray-100 dark:bg-[#121212] bg-opacity-100 z-20">
      <div className="flex min-h-14 lg:min-h-[76px] flex-wrap items-center justify-between mx-auto px-8 pr-4 max-w-645">
        <LocaleLink
          href="/"
          className="text-3xl dark:text-white text-gray-800 font-semibold logo-name"
        >
          Evan Zhou
        </LocaleLink>
        
        <div className="menu hidden lg:block lg:w-auto" id="navbar">
          <ul className="flex p-4 lg:p-0 lg:flex-row mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink active={pathName == '/' + params.lang + (link.path === '/' ? '' : link.path)} href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-end">
            <div className="pr-1 cursor-pointer"><ModeToggle /></div>
            <div className="pr-1 hidden lg:block"><Language /></div>
            <div className="mobile-menu lg:hidden hover:bg-gray-200 dark:hover:bg-gray-800 w-10 h-10 rounded-md flex items-center justify-center">
              {!navbarOpen ? (
                <button
                  onClick={() => setNavbarOpen(true)}
                  className="flex items-center"
                >
                  <Menu size={22}/>
                </button>
              ) : (
                <button
                  onClick={() => setNavbarOpen(false)}
                  className="flex items-center"
                >
                  <X size={22}/>
                </button>
              )}
            </div>
        </div>
      </div>
      {navbarOpen ? <MenuOverlay pathName={pathName} lang={params.lang} links={navLinks} onToggleMenu={toggleMenu} /> : null}
    </nav>
  );
};

export default Navbar;
