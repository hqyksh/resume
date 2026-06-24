import React from "react";
import NavLink from "./NavLink";
import Language from "./language";

const MenuOverlay = ({pathName, lang,  links, onToggleMenu }) => {
  return (<div>
      <ul className="flex flex-col py-4 text-xl items-center lg:hidden">
        {links.map((link, index) => (
          <li key={index} onClick={(e) => {
            e.preventDefault();
            onToggleMenu();
          }}>
            <NavLink active={pathName == '/' + lang + (link.path === '/' ? '' : link.path)} href={link.path} title={link.title}  />
          </li>
        ))}
      </ul>
      <div className="flex justify-end m-4 mt-0"><Language /></div>
    </div>
  );
};

export default MenuOverlay;
