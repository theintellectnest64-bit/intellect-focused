import { useState } from "react";

const timeZones = [
  { tz: "IST", hours: "9:00 AM – 7:00 PM", flag: "🇮🇳", city: "India" },
  { tz: "GST", hours: "7:30 AM – 5:30 PM", flag: "🇦🇪", city: "Dubai / UAE" },
  { tz: "GMT", hours: "3:30 AM – 1:30 PM", flag: "🇬🇧", city: "London" },
  { tz: "EST", hours: "10:30 PM – 8:30 AM", flag: "🇺🇸", city: "New York" },
  { tz: "CST", hours: "9:30 PM – 7:30 AM", flag: "🇺🇸", city: "Chicago" },
  { tz: "SGT", hours: "11:30 AM – 9:30 PM", flag: "🇸🇬", city: "Singapore" },
  { tz: "NZST", hours: "4:30 PM – 2:30 AM", flag: "🇳🇿", city: "Auckland / Hamilton" },
];

interface SupportHoursProps {
  variant?: "light" | "dark";
}

const SupportHours = ({ variant = "light" }: SupportHoursProps) => {
  const [expanded, setExpanded] = useState(false);
  const textColor = variant === "dark" ? "#93C5FD" : "#4A5568";
  const labelColor = variant === "dark" ? "#FFFFFF" : "#0D1E3B";

  return (
    <div>
      <p className="font-body text-sm" style={{ color: labelColor }}>
        Mon–Sat: 9:00 AM – 7:00 PM IST
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="font-body text-sm mt-1 cursor-pointer hover:underline"
        style={{ color: "#2B7DD4" }}
      >
        {expanded ? "Hide time zones ↑" : "See all time zones →"}
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? 300 : 0 }}
      >
        <div className="mt-3 space-y-1.5">
          {timeZones.map((tz) => (
            <div key={tz.tz} className="font-body text-xs flex gap-2" style={{ color: textColor }}>
              <span>{tz.flag}</span>
              <span className="font-semibold w-10">{tz.tz}</span>
              <span>{tz.hours}</span>
              <span className="opacity-70">— {tz.city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportHours;
