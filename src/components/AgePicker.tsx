import { useRef } from "react";

const ageOptions = Array.from({ length: 13 }, (_, i) => i + 4);

const getEmoji = (age: number) => {
  if (age <= 6) return "♟";
  if (age <= 10) return "♞";
  if (age <= 13) return "♝";
  return "♛";
};

interface AgePickerProps {
  value: string;
  onChange: (age: string) => void;
}

const AgePicker = ({ value, onChange }: AgePickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <label className="font-body text-[13px] mb-2 block" style={{ color: "#4A5568" }}>
        How old is your child?
      </label>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {ageOptions.map((age) => {
          const selected = value === String(age);
          return (
            <button
              key={age}
              type="button"
              onClick={() => onChange(String(age))}
              className="flex flex-col items-center shrink-0 snap-start transition-all duration-200 cursor-pointer"
              style={{
                borderRadius: 12,
                padding: "10px 14px",
                background: selected ? "#2B7DD4" : "#F0F6FF",
                color: selected ? "#FFFFFF" : "#0D1E3B",
                border: selected ? "none" : "0.5px solid #DBEAFE",
                transform: selected ? "scale(1.1)" : "scale(1)",
                minWidth: 52,
              }}
            >
              <span className="text-lg leading-none mb-1">{getEmoji(age)}</span>
              <span className="font-bold text-base leading-none">{age}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgePicker;
