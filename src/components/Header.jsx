import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LOGO } from "../utils/constant";
import UseDarkmodebutton from "./hooks/usedarkmodebutton";
import useDarkMode from "./hooks/usedarkmode";
const Header = () => {
  const [open, setOpen] = useState(false);
 const {theme,toggleTheme} = useDarkMode();
  const navItems = ["Home", "About", "Skills", "Projects", "Contact"];
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };
  
  return (
    <header id="header-root"
      className={
        theme === "dark"
          ? "bg-neutral-900 fixed inset-x-0 top-0 z-[999] h-20"
          : "bg-orange-950 fixed inset-x-0 top-0 z-[999] h-20"
      }
    >
<div className="flex items-center justify-between h-full w-full px-4 md:w-[90%] lg:px-0 lg:max-w-[80%] mx-auto">

        <h1 className="font-bold text-white flex-shrink-0">{LOGO}</h1>
        <ul className="hidden md:flex items-center lg:gap-10 gap-8 text-white">
         <UseDarkmodebutton theme={theme} toggleTheme={toggleTheme} className="cursor-pointer"/>  

          {navItems.map((item) => (
            <li
              key={item}
              onClick={() => handleScroll(item.toLowerCase())}
              className="cursor-pointer hover:text-yellow-400 font-lato transition"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="flex gap-4 items-center md:hidden">
          <UseDarkmodebutton theme={theme} toggleTheme={toggleTheme} className=""/>
        <button className=" text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
        </div>
      </div>

      {open && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-[998]"
      onClick={() => setOpen(false)}
    ></div>

    {/* Mobile Menu */}
    <div className="fixed top-20 left-0 right-0 z-[999] md:hidden dark:bg-neutral-950 bg-orange-950 border-t border-white/10">
      <ul className="flex flex-col items-start p-4 gap-6 py-6 text-white">
        {navItems.map((item) => (
          <li
            key={item}
            onClick={() => {
              handleScroll(item.toLowerCase());
              setOpen(false);
            }}
            className="cursor-pointer hover:text-yellow-400 font-lato text-lg"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  </>
)}

    </header>
  );
};

export default Header;
