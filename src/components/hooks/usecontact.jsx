import emailjs from "@emailjs/browser";
import { useRef } from "react";

const useContact = () => {
  const formfill = useRef(null);

  const sendEmail = (e) => {
    e.preventDefault();

    const button = e.target.querySelector("button");
    button.disabled = true;
    button.innerHTML = "Sending...";

    emailjs
      .sendForm(
        "service_r1xh88c",
        "template_70x7bvp",
        formfill.current,
        "7kJO_Ti7wXMAOe7KK"
      )
      .then(() => {
        const message = document.getElementById("form-message");
        message.style.color = "green";
        message.innerHTML = "✓ Message sent successfully!";

        e.target.reset();
      })
      .catch((error) => {
        console.log(error);
        const message = document.getElementById("form-message");
        message.style.color = "red";
        message.innerHTML = "❌ Failed to send message.";
      })
      .finally(() => {
        button.disabled = false;
        button.innerHTML = "Send";
      });
  };

  return { formfill, sendEmail };
};

export default useContact;
