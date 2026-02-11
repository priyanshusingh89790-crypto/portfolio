import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LOGO } from "../utils/constant";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-orange-950 fixed top-0 left-0 right-0 z-[999] h-20">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-4">
        
        <h1 className="font-bold text-white text-4xl">{LOGO}</h1>

        <ul className="hidden md:flex items-center gap-10 text-white">
          {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
            <li
              key={item}
              className="cursor-pointer hover:text-yellow-400 font-lato transition"
            >
              {item}
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-orange-950 border-t border-white/10">
          <ul className="flex flex-col items-center gap-6 py-6 text-white">
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <li
                key={item}
                className="cursor-pointer hover:text-yellow-400 font-lato text-lg"
                onClick={() => setOpen(false)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
