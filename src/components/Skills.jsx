import Skillimage from "../utils/skillimage";

const Skill = () => {
  return (
    <div id="skills" className="w-full pb-32 bg-white/90 dark:bg-neutral-950">
      <div className="lg:max-w-[80%] md:w-[90%] mx-auto pt-32 flex flex-col gap-5">
        
        <h1 className="lg:text-[20px] md:text-[18px] text-[16px] dark:text-yellow-600 text-yellow-700 font-lato font-semibold text-center">
          SKILLS
        </h1>

        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-stone-700 dark:text-stone-200 text-center">
          Technologies I use to build the web
        </h1>

        <div className="relative overflow-hidden w-full mt-10">
          {/* LEFT SHADOW */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-5 
                          bg-gradient-to-r dark:from-neutral-950 from-white to-transparent z-10" />

          {/* RIGHT SHADOW */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-5 
                          bg-gradient-to-l dark:from-neutral-950 from-white to-transparent z-10" />

          <div className="flex lg:gap-16 gap-10 animate-slideLeft reveal-top duration-100 whitespace-nowrap">
            {Skillimage.map((item, index) => (
              <div
                key={index}
                className="lg:w-[200px] lg:h-[200px] md:w-[180px] md:h-[180px] w-[120px] h-[120px] flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-900 dark:border-stone-700/80 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.icon}
                  alt="skill"
                  className="lg:w-24 lg:h-24 w-16 h-16 object-contain"
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
