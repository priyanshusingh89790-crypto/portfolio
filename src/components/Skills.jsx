import Skillimage from "../utils/skillimage";

const Skill = () => {
  return (
    <div id="skills" className="w-full pb-32 bg-white/90 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto pt-32 flex flex-col gap-5">
        
        <h1 className="text-[20px] dark:text-yellow-600 text-yellow-700 font-lato font-semibold text-center">
          SKILLS
        </h1>

        <h1 className="text-5xl font-semibold text-stone-700 dark:text-stone-200 text-center">
          Technologies I use to build the web
        </h1>

        <div className="relative overflow-hidden w-full mt-10">
          {/* LEFT SHADOW */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-5 
                          bg-gradient-to-r dark:from-neutral-950 from-white to-transparent z-10" />

          {/* RIGHT SHADOW */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-5 
                          bg-gradient-to-l dark:from-neutral-950 from-white to-transparent z-10" />

          <div className="flex gap-16 animate-slideLeft reveal-top duration-100 whitespace-nowrap">
            {Skillimage.map((item, index) => (
              <div
                key={index}
                className="w-[200px] h-[200px] flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-900 dark:border-stone-700/80 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.icon}
                  alt="skill"
                  className="w-24 h-24 object-contain"
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Skill;
