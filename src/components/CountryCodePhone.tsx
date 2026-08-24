import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { countries, flagOf } from "@/data/countries";

interface CountryCodePhoneProps {
  value: string;
  onChange: (val: string) => void;
  /** Format: "+91|IN" — dial code and ISO country of the phone number. */
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
}

const CountryCodePhone = ({ value, onChange, countryCode, onCountryCodeChange }: CountryCodePhoneProps) => {
  const [open, setOpen] = useState(false);
  const iso = countryCode.split("|")[1] || "";
  const selected = countries.find((c) => c.iso2 === iso);

  return (
    <div className="flex">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Phone country code"
            className="flex items-center gap-1 font-body text-sm px-2 py-2 bg-white border-y border-l shrink-0"
            style={{
              borderColor: "#DBEAFE",
              borderWidth: "0.5px",
              borderRadius: "6px 0 0 6px",
              minWidth: 96,
              outline: "none",
            }}
          >
            {selected ? (
              <>
                <span>{flagOf(selected.iso2)}</span>
                <span className="text-navy">{selected.iso2}</span>
                <span className="text-secondary">{selected.dial}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Code</span>
            )}
            <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command
            filter={(itemValue, search) => {
              const q = search.trim().toLowerCase().replace(/\s+/g, "");
              if (!q) return 1;
              return itemValue.toLowerCase().replace(/\s+/g, "").includes(q) ? 1 : 0;
            }}
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput placeholder="Search country or +code..." className="h-10 border-0 p-0 focus:ring-0" />
            </div>
            <CommandList className="max-h-[260px]">
              <CommandEmpty className="py-6 text-center font-body text-sm text-muted-foreground">
                No country found.
              </CommandEmpty>
              <CommandGroup>
                {countries.map((c) => (
                  <CommandItem
                    key={c.iso2}
                    value={`${c.name} ${c.iso2} ${c.dial} ${c.dial.replace("+", "")}`}
                    onSelect={() => {
                      onCountryCodeChange(`${c.dial}|${c.iso2}`);
                      setOpen(false);
                    }}
                    className="font-body text-sm"
                  >
                    <span className="mr-2">{flagOf(c.iso2)}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {c.iso2} {c.dial}
                    </span>
                    {iso === c.iso2 && <Check className="ml-2 h-4 w-4 text-sky" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
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
