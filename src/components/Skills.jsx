import Skillimage from "../utils/skillimage";

const Skill = () => {
  return (
    <div className="w-full pb-32 bg-white/90">
      <div className="max-w-7xl mx-auto pt-32 flex flex-col gap-5">
        
        <h1 className="text-[20px] text-yellow-700 font-lato font-semibold text-center">
          SKILLS
        </h1>

        <h1 className="text-5xl font-semibold text-stone-900/80 text-center">
          Technologies I use to build the web
        </h1>

        <div className="relative overflow-hidden w-full mt-10">
          {/* LEFT SHADOW */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-5 
                          bg-gradient-to-r from-white to-transparent z-10" />

          {/* RIGHT SHADOW */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-5 
                          bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex gap-16 animate-slideLeft whitespace-nowrap">
            {Skillimage.map((item, index) => (
              <div
                key={index}
                className="w-[200px] h-[200px] flex-shrink-0 flex items-center justify-center bg-white border border-gray-200 rounded-lg"
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
