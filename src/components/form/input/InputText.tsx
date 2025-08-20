import { useState, type ChangeEvent } from "react";

interface TextProps {
    name: string;
    label?: string;
    required?: boolean;
    value?: string;
    type?: string;
    readonly?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default function InputText({ name, label, type, required, readonly, value, onChange }: TextProps) {
    const [currentValue, setValue] = useState<string>(value ?? '');
    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (onChange)
            onChange(e);
    }
    return <div>
        <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
            {label ?? name}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="mt-2 relative">
            <input id={name} type={type ?? "text"} name={name} required={required} value={currentValue} readOnly={readonly} disabled={readonly}
                onChange={onValueChange} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            {readonly && <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-md cursor-not-allowed"></div>}
        </div>
    </div>  
}