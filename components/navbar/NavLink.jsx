import LocaleLink from '@/components/LocaleLink';

const NavLink = ({active, href, title }) => {
  return (
    <LocaleLink
      href={href}
      className={`block py-2 px-2 lg:px-4 text-lg rounded md:px-4 bg-transparent! ${active ? "text-blue-700 "  : "dark:text-[#ADB7BE] text-gray-800 hover:text-gray-500 dark:hover:text-gray-100"}`}
    >
      {title}
    </LocaleLink>
  );
};

export default NavLink;
