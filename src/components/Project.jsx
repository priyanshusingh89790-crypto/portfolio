import projectData from "../utils/projectcontent";
import { ArrowRight } from "lucide-react";

const Project = () => {
  return (
    <div id="projects" className="w-full p-20 overflow-x-hidden">
      <div className="max-w-7xl bg-white rounded-lg mx-auto px-4 items-center justify-center pt-32 pb-32 flex flex-col gap-5">
        
        <h1 className="text-[20px] text-yellow-700 font-lato font-semibold">
          PROJECTS
        </h1>

        <h1 className="text-5xl font-semibold text-stone-700 text-center lg:text-left">
          Selected Work & Case Studies
        </h1>

        <div className="pt-20 flex flex-col gap-32">
          {projectData.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col h-auto lg:flex-row gap-20  
                transition-all 
                rounded-lg ${
                  !isEven ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Section */}
                <div className="relative w-full lg:w-[50%] h-[220px] lg:h-[500px] border border-yellow-800/20 rounded-lg overflow-hidden">
                  <img
                    src={project.image}
                    alt="background"
                    className="h-full w-full object-cover"
                  />

                  <img
                    src={project.mobileImage}
                    alt="mobile"
                    className="absolute bottom-3 right-3 bg-black/10 p-2 
                    h-[180px] w-[110px] lg:h-[250px] lg:w-[150px] 
                    rounded-lg z-10"
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-[50%] p-2 lg:p-4 lg:mt-10">
                  <h1 className="text-3xl text-stone-700 font-semibold">
                    {project.title}
                  </h1>

                  <div className="border-b-2 border-yellow-800/20 w-full lg:max-w-[550px] pt-8" />

                  <p className="text-[18px] lg:text-[20px] pt-10 text-stone-600 font-lato">
                    {project.description}
                  </p>

                  <ul className="flex flex-wrap pt-10 gap-3">
                    {project.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="font-lato text-white text-[14px] bg-amber-500 px-3 py-1 rounded-lg"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => window.open(project.link, "_blank")}
                    className="mt-10 text-amber-500 text-[18px] lg:text-[20px] 
                    hover:text-amber-400 border-b-2 border-amber-500/30 
                    flex items-center gap-2 p-2"
                  >
                    View Project <ArrowRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Project;
