import {User, Briefcase,Folder} from "lucide-react"
const About = () => {
    return (
        <div className="w-full bg-white/40">
            <div className="flex flex-col gap-5 max-w-7xl mx-auto items-center p-10 pt-20 pb-20 text-center ">
                <h1 className="text-2xl text-yellow-700 font-lato font-semibold">ABOUT ME</h1>
               <ul className="flex flex-col gap-3 max-w-[90%]">
                <li className="text-3xl text-black text-left font-semibold"> Crafting clean and thoughtful web experiences</li>
                <li className="text-[20px] text-stone-800/70 font-lato text-left">I’m a frontend developer passionate about building responsive, user-friendly web applications using React and JavaScript, with a focus on clean UI and smooth user experience.</li>
                </ul>
                <div className="flex w-[70%] justify-between">
                    <div className="items-start  text-start">
                        <h1 className="">🧩 Frontend Developer</h1>
                        <h1>⚡ Performance</h1>
                        <h1>🎨 UI/UX Designer</h1>
                        <h1>♿ Accessibility</h1>

                    </div>
                    <div>
                        <h1>What I Do</h1>
                        <ul className="flex flex-col gap-3">
                            <li>Build responsive and modern web applications</li>
                            <li>Create clean, intuitive user interfaces</li>
                            <li>Optimize performance for fast load times</li>
                            <li>Ensure accessibility and inclusive design</li>
                            
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default About;