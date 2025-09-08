import { useState } from "react";

export interface TabHeaderItem {
    key: string;
    label: string;
}

interface TabHeaderProps {
    onChange: (key: string) => void;
    items?: TabHeaderItem[];
    defaultSelect?: string;
}

export default function AppTabHeader({ onChange, items, defaultSelect }: TabHeaderProps) {
    const [selected, setSelected] = useState<string>(defaultSelect ?? items![0]?.key ?? '');
    return <div className="bg-transparent! flex flex-row gap-15">
        {(items ?? []).map(({ key, label }) =>
        (
            <button onClick={() => {
                setSelected(key);
                onChange(key);
            }} className={`transition-none! rounded-none! flex w-fit hover:text-blue-300 bg-inherit! p-0! h-8 hover:outline-none! hover:border-none! focus:outline-none! ${selected == key ? 'border-b-2! border-b-[#4096ff]!' : ''}`}>
                <span className={`text-base font-normal text-inherit ${selected == key ? 'text-[#4096ff]!' : ''}`}>{label}</span>
            </button>
        ))}
    </div>
}