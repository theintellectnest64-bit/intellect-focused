import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { countries, flagOf } from "@/data/countries";
import { cn } from "@/lib/utils";

interface CountrySelectProps {
  /** Selected ISO 3166-1 alpha-2 code, or "" when nothing is selected. */
  value: string;
  onChange: (iso2: string) => void;
  placeholder?: string;
  /** Show the calling code next to each country (used by the phone selector). */
  showDial?: boolean;
  className?: string;
  id?: string;
}

const CountrySelect = ({
  value,
  onChange,
  placeholder = "Select country",
  showDial = false,
  className,
  id,
}: CountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = countries.find((c) => c.iso2 === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-body font-normal bg-white border-sky-border",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selected
              ? `${flagOf(selected.iso2)} ${selected.name}${showDial ? ` ${selected.dial}` : ""}`
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[260px] p-0" align="start">
        <Command
          filter={(itemValue, search) => {
            const q = search.trim().toLowerCase().replace(/\s+/g, "");
            if (!q) return 1;
            return itemValue.toLowerCase().replace(/\s+/g, "").includes(q) ? 1 : 0;
          }}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search country, code or +dial..."
              className="h-10 border-0 p-0 focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[260px]">
            <CommandEmpty className="py-6 text-center font-body text-sm text-muted-foreground">
              No country found.
            </CommandEmpty>
            <CommandGroup>
              {countries.map((c) => (
                <CommandItem
                  key={c.iso2}
                  // searchable by name, ISO code and dial code (with/without +)
                  value={`${c.name} ${c.iso2} ${c.dial} ${c.dial.replace("+", "")}`}
                  onSelect={() => {
                    onChange(c.iso2);
                    setOpen(false);
                  }}
                  className="font-body text-sm"
                >
                  <span className="mr-2">{flagOf(c.iso2)}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {c.iso2} {c.dial}
                  </span>
                  {value === c.iso2 && <Check className="ml-2 h-4 w-4 text-sky" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelect;
