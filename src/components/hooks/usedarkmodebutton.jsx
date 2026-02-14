import { Moon, Sun } from "lucide-react";
const UseDarkmodebutton = ({theme,toggleTheme}) => {
    return (
 <div
            onClick={toggleTheme}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300
  ${theme === "dark" ? "bg-white" : "bg-amber-200"}`}
          >
            <div className="absolute inset-0 flex justify-between items-center px-2">
              <Moon size={14} className="text-black" />
              <Sun size={14} className="text-yellow-600" />
            </div>
            <div
              className={`absolute top-1 w-5 h-5 dark:bg-black bg-white rounded-full shadow-md transition-transform duration-300
    ${theme === "dark" ? "translate-x-7" : "translate-x-1"}`}
            />
          </div>
    )
}
    export default UseDarkmodebutton;