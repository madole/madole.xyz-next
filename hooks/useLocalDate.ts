import { useEffect, useState } from "react";

function isInvalidDate(d: Date | string) {
  return d === "Invalid Date";
}

const dateStringOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export const useLocalDate = (dateString: string) => {
  const [localDate, setLocalDate] = useState("");
  useEffect(() => {
    if (isInvalidDate(dateString)) {
      setLocalDate("Invalid Date");
    } else {
      setLocalDate(
        new Date(dateString).toLocaleDateString(undefined, dateStringOptions),
      );
    }
  }, [dateString]);

  return localDate;
};
