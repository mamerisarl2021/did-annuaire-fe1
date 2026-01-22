import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UsersSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function UsersSearchBar({
    value,
    onChange,
    placeholder = "Search users...",
}: UsersSearchBarProps) {
    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={placeholder}
                className="pl-9"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
