import { Github, Linkedin, Mail } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
const Contact = () => {
  const formfill = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_r1xh88c",
        "template_70x7bvp",
        formfill.current,
        "7kJO_Ti7wXMAOe7KK",
      )
      .then(
        () => {
          alert("Message sent successfully!");
        },
        (error) => {
          console.log(error);
          alert("Failed to send message.");
        },
      );

    e.target.reset();
  };

  return (
    <div id="contact" className="w-full h-screen ">
      <div className="lg:max-w-7xl mx-auto items-center justify-center flex flex-col gap-5 pb-20 pt-20">
        <h1 className="text-[20px] font-lato text-orange-800 font-semibold">
          CONTACT
        </h1>
        <div className="flex lg:flex-row flex-col pt-20 gap-32">
          <div className="flex flex-col gap-14">
            <h1 className="text-5xl font-semibold text-stone-700">
              Let's Connect
            </h1>
            <p className="text-[20px] font-lato text-yellow-700">
              I'd like to hear from you!
            </p>
            <p className="text-[20px] font-lato text-stone-700">
              I’m currently open to frontend opportunities and would love to
              connect about roles, projects, or collaborations.
            </p>
            <div className="flex flex-col items-start justify-start gap-8">
              <h1 className="text-[18px] flex items-center gap-2 bg-white/30 border border-yellow-800/20 rounded-lg p-2 font-lato text-yellow-700">
                email me diretly at:
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com"
                  className="text-[16px] font-lato text-black"
                >
                  priyanshuvwork@gmail.com
                </a>
              </h1>
              <div className="flex gap-5">
                <a
                  href="https://github.com/priyanshusingh89790-crypto"
                  className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full "
                >
                  <Github />
                </a>
                <a
                  href="https://www.linkedin.com/in/priyanshu-singh-668b53328/"
                  className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full "
                >
                  <Linkedin />
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com"
                  className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full "
                >
                  <Mail />
                </a>
              </div>
            </div>
          </div>

          <div className="flex w-auto flex-col bg-white/30 border border-yellow-800/20 shadow-lg justify-between rounded-lg p-10 items-center gap-5">
            <form
              ref={formfill}
              onSubmit={sendEmail}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col lg:w-[500px] w-auto gap-5">
                <h1 className="text-[18px] font-lato text-yellow-700">
                  {" "}
                  Name
                  <input
                    name="name"
                    type="text"
                    placeholder="YOUR NAME"
                    required
                    className="p-2 rounded-lg w-full border placeholder:text-stone-700 border-orange-800/20 text-black placeholder:text-[16px]"
                  />
                </h1>
                <h1 className="text-[18px] font-lato text-yellow-700">
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="YOUR EMAIL"
                    required
                    className="p-2 rounded-lg w-full border placeholder:text-stone-700 border-orange-800/20 placeholder:text-[16px]"
                  />
                </h1>
              </div>
              <h1 className="text-[18px] font-lato text-yellow-700">Message</h1>
              <textarea
                name="message"
                placeholder="YOUR MESSAGE"
                required
                className="p-2 h-[150px] rounded-lg font-lato w-full border placeholder:text-stone-700 border-orange-800/20 placeholder:text-[16px]"
              ></textarea>
              <button
                type="submit"
                className="bg-yellow-700 text-white justify-self-end self-end w-20 p-2 rounded-lg font-lato font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
