import projectData from "../utils/projectcontent"
import { ArrowRight } from "lucide-react";
const Project = () => {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto items-center justify-center pt-32 pb-32 flex flex-col gap-2">
                <h1 className="text-[20px] text-yellow-700 font-lato font-semibold">PROJECTS</h1>
                <h1 className="text-5xl font-semibold">Selected Work & Case Studies</h1>
                <div className="pt-20 flex flex-col gap-20">
                    {projectData.filter((_,index) => index%2 === 0).map((project,index) => {
                      return(  <div key={index} className="flex gap-10 border bg-white border-yellow-800/20 hover:shadow-lg transition-all justify-between rounded-lg p-5">
                        <div className="relative h-[350px] w-[50%] border border-yellow-800/20 rounded-lg overflow-hidden">
                            <img src={project.image} alt="background"
                             className="h-full w-full object-cover"/>
                            <img src={project.mobileImage} alt="mobile"
                            className="absolute bottom-0 right-4 bg-black/10 p-2 h-[250px] w-[150px] rounded-lg z-10"/>
                        </div>

                        <div className="w-[50%] p-4">
                        <h1 className="text-3xl text-stone-900 font-semibold">{project.title}</h1>
                        <h2 className="border-b-2 border-yellow-800/20 w-[550px] pt-4"></h2>
                        <p className="text-[20px] pt-5 text-stone-600 font-lato">{project.description}</p>
                        <ul className="flex pt-5 gap-6">
                            {project.tags.map((tag,index) => (
                                <li key={index} className="font-lato text-white text-[15px] bg-amber-500 p-1 pl-2 pr-2 rounded-lg flex items-center gap-1">{tag}</li>
                            ))}
                        </ul>
                        <div className="flex gap-16  pt-5">
                            <button className=" text-amber-500 text-[20px] hover:text-amber-400 hover:border-amber-400 font-lato border-b-2 border-amber-500/30 flex items-center gap-2 p-2">View Project <ArrowRight /></button>
                        </div>
                        </div>
                    </div>
                  ); })}
                </div>
                <div className="pt-20 flex flex-col gap-20">
                    {projectData.filter((_,index) => index%2 !== 0).map((project,index) => (
                        <div key={index} className="flex gap-10 border bg-white border-yellow-800/20 hover:shadow-lg transition-all justify-between rounded-lg p-5">
                        <div className="w-[50%] p-4">
                        <h1 className="text-3xl text-stone-900 font-semibold">{project.title}</h1>
                        <h2 className="border-b-2 border-yellow-800/20 w-[550px] pt-4"></h2>
                        <p className="text-[20px] pt-5 text-stone-600 font-lato">{project.description}</p>
                        <ul className="flex pt-5 gap-6">
                            {project.tags.map((tag,index) => (
                                <li key={index} className="font-lato text-white text-[15px] bg-amber-500 p-1 pl-2 pr-2 rounded-lg flex items-center gap-1">{tag}</li>
                            ))}
                        </ul>
                        <div className="flex gap-16  pt-5">
                            <button className=" text-amber-500 text-[20px] hover:text-amber-400 hover:border-amber-400 font-lato border-b-2 border-amber-500/30 flex items-center gap-2 p-2">View Project <ArrowRight /></button>
                        </div>
                        </div>
                        <div className="relative h-[350px] w-[50%] border border-yellow-800/20 rounded-lg overflow-hidden">
                            <img src={project.image} alt="background"
                             className="h-full w-full object-cover"/>
                            <img src={project.mobileImage} alt="mobile"
                            className="absolute bottom-0 right-4 bg-black/10 p-2 h-[250px] w-[150px] rounded-lg z-10"/>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Project;