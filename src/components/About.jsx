import { servicesData } from "../utils/aboutservice";
const About = () => {
  return (
    <div id="about" className="w-full dark:bg-neutral-900 h-auto lg:pt-20 md:pt-10 lg:pb-20 ">
      <div className="flex flex-col gap-5 dark:bg-neutral-950 bg-white lg:max-w-[80%] md:w-[90%] mx-auto items-center pt-32 pb-16 lg:p-10 p-4 rounded-t-lg text-center ">
        <h1 className="lg:text-[20px] md:text-[18px] text-[16px] text-yellow-700 dark:text-yellow-600 font-lato font-semibold">
          ABOUT ME
        </h1>
        <ul className="gap-3">
          <li className="lg:text-[20px] md:text-[18px] text-[16px] flex flex-col gap-5 dark:text-stone-200 text-stone-800/70 pt-5 pb-5 font-lato text-left">
            <p className="font-lato">
              I create modern web experiences that focus on usability
              accessibility and performance. My goal is to build interfaces that
              are intuitive, well-structured, and seamless across devices.
            </p>

            <p className="font-lato">
              My work emphasizes clean, reusable code and modern frontend
              practices, while focusing on UI/UX design to deliver visually
              balanced and user-friendly layouts. I enjoy turning ideas and
              designs into scalable, responsive solutions that provide
              meaningful experiences for users. Check my work below, or feel
              free to reach out at{" "}
              <a href="mailto:priyanshuvwork@gmail.com">
                {" "}
                <b className="text-yellow-600 dark:text-yellow-600 font-medium font-lato">email</b>
              </a>{" "}
              or +91-8273552253.
            </p>
          </li>
        </ul>
      </div>
      <div className="bg-white dark:bg-neutral-950 lg:max-w-[80%] md:w-[90%] mx-auto md:mb-20 lg:pb-20  lg:mb-0 rounded-b-lg gap-5">
        <div className="flex flex-row gap-2 items-center ml-8">
          <b className="text-yellow-500 mb-2">→</b>
          <h1 className="lg:text-[20px] md:text-[18px] text-[16px] font-lato text-yellow-500 dark:text-yellow-600 font-bold">
            SERVICES
          </h1>
        </div>

        <h1 className="lg:text-5xl md:text-4xl text-3xl text-stone-700/60 dark:text-stone-500 font-bold mb-10 mt-5 m-[4.6%]">
          What I Can Do For You
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 m-[4.6%]">
          {servicesData.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="flex reveal-top flex-col gap-5 bg-amber-50/5 hover:shadow-lg border
                 dark:border-amber-300/20 dark:hover:border-amber-200/60 dark:bg-stone-800/70 border-amber-500/20 hover:border-amber-200 rounded-lg p-10 h-[250px]"
              >
                <div className="bg-yellow-500/20 dark:bg-yellow-100/20 dark:text-amber-500 p-2 rounded-lg text-yellow-600 w-[50px] h-[50px] flex items-center justify-center">
                  {service.icon}
                </div>

                <h2 className="text-xl font-lato dark:text-stone-200 text-stone-700">
                  {service.title}
                </h2>

                <p className="font-lato dark:text-stone-200 text-stone-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default About;
