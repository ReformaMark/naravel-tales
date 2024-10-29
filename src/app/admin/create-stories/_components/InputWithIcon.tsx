import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

export const InputWithIcon = ({
    id,
    label,
    icon,
    type = "text",
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
}: {
    id: string;
    label: string;
    icon: JSX.Element;
    type?: string;
    placeholder: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-primary">
                {label}
            </Label>
            <div className="relative">
                <div  className="absolute left-3 top-1/3 h-4 w-4 -translate-y-1/2 text-primary">{icon}</div>
                <Input
                    id={id}
                    type={type}
                    name={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="pl-10 border-primary bg-primary/50 focus:ring-primary"
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};