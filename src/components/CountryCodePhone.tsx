import { Input } from "@/components/ui/input";

const countryCodes = [
  { flag: "🇺🇸", code: "+1", label: "US" },
  { flag: "🇬🇧", code: "+44", label: "UK" },
  { flag: "🇦🇪", code: "+971", label: "AE" },
  { flag: "🇮🇳", code: "+91", label: "IN" },
  { flag: "🇳🇿", code: "+64", label: "NZ" },
  { flag: "🇸🇬", code: "+65", label: "SG" },
  { flag: "🇩🇪", code: "+49", label: "DE" },
  { flag: "🇫🇷", code: "+33", label: "FR" },
  { flag: "🇪🇸", code: "+34", label: "ES" },
  { flag: "🇦🇺", code: "+61", label: "AU" },
  { flag: "🇨🇦", code: "+1", label: "CA" },
];

interface CountryCodePhoneProps {
  value: string;
  onChange: (val: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

const CountryCodePhone = ({ value, onChange, countryCode, onCountryCodeChange }: CountryCodePhoneProps) => {
  return (
    <div className="flex">
      <select
        value={countryCode}
        onChange={(e) => onCountryCodeChange(e.target.value)}
        className="font-body text-sm px-2 py-2 bg-white border-y border-l appearance-none cursor-pointer shrink-0"
        style={{
          borderColor: "#DBEAFE",
          borderWidth: "0.5px",
          borderRadius: "6px 0 0 6px",
          minWidth: 80,
          outline: "none",
        }}
      >
        {countryCodes.map((c) => (
          <option key={`${c.code}-${c.label}`} value={`${c.code}|${c.label}`}>
            {c.flag} {c.code}{c.label === "CA" ? " CA" : ""}
          </option>
        ))}
      </select>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="(555) 000-0000"
        className="rounded-l-none border-l-0"
        style={{ borderRadius: "0 6px 6px 0" }}
      />
    </div>
  );
};

export default CountryCodePhone;
