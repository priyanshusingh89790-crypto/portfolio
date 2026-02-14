import { Github, Linkedin, Mail,} from "lucide-react";
import useContact  from "./hooks/usecontact";
const Contact = () => {
  const {formfill, sendEmail} = useContact();
  return (
    <div id="contact" className="w-full dark:bg-neutral-950 lg:h-screen ">
      <div className="lg:max-w-[80%] md:w-[90%] lg:p-0 p-4 mx-auto items-center justify-center flex flex-col gap-5 pb-20 pt-20">
        <h1 className="lg:text-[20px] md:text-[18px] text-[16px] font-lato text-orange-800 dark:text-yellow-600 font-semibold">
          CONTACT
        </h1>
        <div className="flex lg:flex-row flex-col pt-20 lg:gap-32 gap-20">
          <div className="flex flex-col gap-14 reveal-left">
            <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-stone-700 dark:text-stone-200">
              Let's Connect
            </h1>
            <p className="lg:text-[20px] md:text-[18px] text-[16px] font-lato text-yellow-700 dark:text-yellow-600">
              I'd like to hear from you!
            </p>
            <p className="lg:text-[20px] md:text-[18px] text-[16px] font-lato text-stone-700 dark:text-stone-200">
              I’m currently open to frontend opportunities and would love to
              connect about roles, projects, or collaborations.
            </p>
            <div className="flex flex-col items-start justify-start gap-8">
              <h1 className="lg:text-[18px] md:text-[16px] text-[14px] flex items-center gap-2 bg-white/30 border dark:border-yellow-600/30 dark:bg-stone-900 border-yellow-800/20 rounded-lg p-2 font-lato text-yellow-700 dark:text-yellow-500">
                email me diretly at:
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com"
                  className="lg:text-[16px] md:text-[15px] text-[14px] font-lato text-black dark:text-white"
                >
                  priyanshuvwork@gmail.com
                </a>
              </h1>
              <div className="flex gap-5">
                <a
                  href="https://github.com/priyanshusingh89790-crypto"
                  className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full "
                >
                  <Github />
                </a>
                <a
                  href="https://www.linkedin.com/in/priyanshu-singh-668b53328/"
                  className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full "
                >
                  <Linkedin />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com"
                  className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full "
                >
                  <Mail />
                </a>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col reveal-right bg-white/30 dark:bg-stone-900 border dark:border-yellow-600/30 border-yellow-800/20 shadow-lg justify-between rounded-lg lg:p-10 p-5 md:p-8 lg:items-center items-stretch gap-5">
            <form
              ref={formfill}
              onSubmit={sendEmail}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col lg:w-[550px] w-full gap-5">
                <label className="lg:text-[18px] text-[16px] font-lato dark:text-yellow-600 text-yellow-700">
                  {" "}
                  Name
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                    className="p-2 rounded-lg w-full border focus:border-yellow-600 focus:outline-none placeholder:text-stone-700 border-orange-800/20 dark:bg-stone-700 dark:text-white dark:placeholder:text-stone-200 text-black placeholder:text-[15px]"
                  />
                </label>
                <label className="lg:text-[18px] text-[16px] font-lato dark:text-yellow-600 text-yellow-700">
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="p-2 rounded-lg w-full border focus:border-yellow-600 focus:outline-none placeholder:text-stone-700 border-orange-800/20 dark:bg-stone-700 dark:text-white dark:placeholder:text-stone-200 text-black placeholder:text-[15px]"
                  />
                </label>
              </div>
              <label className="lg:text-[18px] text-[16px] font-lato dark:text-yellow-600 text-yellow-700">Message
              <textarea
                name="message"
                placeholder="Enter your message"
                required
                className="p-2 h-[150px] rounded-lg font-lato w-full border focus:border-yellow-600 focus:outline-none placeholder:text-stone-700 border-orange-800/20 dark:bg-stone-700 dark:placeholder:text-stone-200 text-black dark:text-white placeholder:text-[15px]"
              ></textarea>
              </label>
              <button
                type="submit"
                className="bg-yellow-700 hover:bg-yellow-500 dark:hover:bg-yellow-500 dark:bg-yellow-600 text-white justify-self-end self-end w-20 p-2 rounded-lg font-lato font-semibold"
              >
                Send
              </button>
              <p id="form-message" className="lg:text-[15px] text-[13px] font-lato"></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
