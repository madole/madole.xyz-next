import React, { useEffect } from "react";

export const useMultiIntersectionObserver = (
  ref: React.MutableRefObject<IntersectionObserver | undefined>,
  selector: string,
  callback: IntersectionObserverCallback,
) => {
  useEffect(() => {
    ref.current = new IntersectionObserver(callback, {
      threshold: 0.1,
    });
    const sideProjects = document.querySelectorAll(selector);
    sideProjects.forEach((sideProject) => {
      ref.current?.observe(sideProject);
    });
  }, [callback, ref]);
};
