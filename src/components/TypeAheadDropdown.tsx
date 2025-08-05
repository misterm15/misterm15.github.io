import { useState, useEffect, useRef } from 'react';
import './TypeAheadDropdown.css';

interface Option {
    id: string;
    label: string;
}

interface TypeAheadDropdownProps<T extends Option> {
    options: T[];
    value: T | null;
    onChange: (value: T | null) => void;
    onSearch: (query: string) => void;
    placeholder?: string;
    id?: string;
    label?: string;
}

export const TypeAheadDropdown = <T extends Option>({
    options,
    value,
    onChange,
    onSearch,
    placeholder = 'Search...',
    id,
    label
}: TypeAheadDropdownProps<T>) => {
    const [searchQuery, setSearchQuery] = useState<string>(value?.label || '');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchQuery(value?.label || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (query: string) => {
        setSearchQuery(query);
        setIsOpen(true);
        if (!query) {
            onChange(null);
        }
        onSearch(query);
    };

    const handleSelectOption = (option: T) => {
        onChange(option);
        setSearchQuery(option.label);
        setIsOpen(false);
    };

    // Filter options based on search query
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="typeahead-container" ref={containerRef}>
            {label && <label htmlFor={id}>{label}</label>}
            <div className="typeahead-input-wrapper">
                <input
                    id={id}
                    type="text"
                    className="typeahead-input"
                    value={searchQuery}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    onFocus={() => setIsOpen(true)}
                />
                {isOpen && (filteredOptions.length > 0 || (!searchQuery && options.length > 0)) && (
                    <div className="typeahead-dropdown">
                        {(searchQuery ? filteredOptions : options).map(option => (
                            <div
                                key={option.id}
                                className="typeahead-option"
                                onClick={() => handleSelectOption(option)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TypeAheadDropdown;