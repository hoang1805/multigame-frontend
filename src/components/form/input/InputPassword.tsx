import { useState, type ChangeEvent } from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

interface PasswordProps {
    name: string;
    label?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
export default function InputPassword({ name, label, required, value, onChange }: PasswordProps) {
    const [currentValue, setValue] = useState<string>(value ?? '');
    const [visible, setVisible] = useState<boolean>(false);
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
            <input id={name} type={visible ? "text" : "password"} name={name} required={required} value={currentValue}
                onChange={onValueChange} className="block w-full rounded-md bg-white px-3 py-1.5 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setVisible((v) => !v)}
            >
                {visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>
        </div>
    </div>
}