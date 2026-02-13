import { useEffect } from "react";

const useSlide = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".reveal-left, .reveal-right, .reveal-down, .reveal-top"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useSlide;
