import { useEffect, useRef, useState } from "react";

function useOnClickOutside() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (
      ref.current &&
      !ref.current.contains(event.target as Node | null) &&
      !buttonRef.current?.contains(event.target as Node | null)
    ) {
      setIsComponentVisible(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, buttonRef, isComponentVisible, setIsComponentVisible };
}

export default useOnClickOutside;
