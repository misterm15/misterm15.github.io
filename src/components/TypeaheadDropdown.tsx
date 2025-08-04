import React, { useState, useRef, useEffect, useCallback } from 'react';
import './TypeaheadDropdown.css';

export interface TypeaheadOption {
  value: string;
  label: string;
  data?: unknown; // Additional data that can be attached to each option
}

export interface TypeaheadDropdownProps {
  options: TypeaheadOption[];
  value?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDisplayedOptions?: number;
  filterMode?: 'starts-with' | 'contains' | 'custom';
  customFilter?: (option: TypeaheadOption, inputValue: string) => boolean;
  onChange?: (selectedOption: TypeaheadOption | null) => void;
  onInputChange?: (inputValue: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  clearable?: boolean;
  allowCustomValue?: boolean;
  noOptionsMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
}

const TypeaheadDropdown: React.FC<TypeaheadDropdownProps> = ({
  options = [],
  value = '',
  placeholder = 'Type to search...',
  className = '',
  disabled = false,
  maxDisplayedOptions = 10,
  filterMode = 'contains',
  customFilter,
  onChange,
  onInputChange,
  onFocus,
  onBlur,
  clearable = true,
  allowCustomValue = false,
  noOptionsMessage = 'No options found',
  loadingMessage = 'Loading...',
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState<TypeaheadOption[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter options based on input value
  const filterOptions = useCallback((searchValue: string): TypeaheadOption[] => {
    if (!searchValue.trim()) {
      return options;
    }

    const lowercaseSearch = searchValue.toLowerCase();
    
    return options.filter(option => {
      if (customFilter) {
        return customFilter(option, searchValue);
      }
      
      const lowercaseLabel = option.label.toLowerCase();
      
      switch (filterMode) {
        case 'starts-with':
          return lowercaseLabel.startsWith(lowercaseSearch);
        case 'contains':
        default:
          return lowercaseLabel.includes(lowercaseSearch);
      }
    }).slice(0, maxDisplayedOptions);
  }, [options, filterMode, customFilter, maxDisplayedOptions]);

  // Update filtered options when input value or options change
  useEffect(() => {
    const filtered = filterOptions(inputValue);
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [inputValue, options, filterOptions]);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onInputChange?.(newValue);

    // If custom values are not allowed, clear selection when input doesn't match any option
    if (!allowCustomValue) {
      const exactMatch = options.find(option => option.label === newValue);
      if (!exactMatch) {
        onChange?.(null);
      }
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: TypeaheadOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange?.(option);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    onFocus?.();
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding dropdown to allow option clicks
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        onBlur?.();

        // If custom values are allowed and input has value, create a custom option
        if (allowCustomValue && inputValue.trim()) {
          const exactMatch = options.find(option => option.label === inputValue);
          if (!exactMatch) {
            const customOption: TypeaheadOption = {
              value: inputValue,
              label: inputValue
            };
            onChange?.(customOption);
          }
        }
      }
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (allowCustomValue && inputValue.trim()) {
          const customOption: TypeaheadOption = {
            value: inputValue,
            label: inputValue
          };
          handleOptionSelect(customOption);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
      
      case 'Tab':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange?.(null);
    onInputChange?.('');
    inputRef.current?.focus();
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isOpen && !disabled;
  const hasFilteredOptions = filteredOptions.length > 0;
  const showClearButton = clearable && inputValue && !disabled;

  return (
    <div className={`typeahead-container ${className}`}>
      <div className="typeahead-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          className={`typeahead-input ${showDropdown ? 'typeahead-input--open' : ''}`}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-activedescendant={
            highlightedIndex >= 0 ? `typeahead-option-${highlightedIndex}` : undefined
          }
        />
        
        {showClearButton && (
          <button
            type="button"
            className="typeahead-clear-btn"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
        
        <div className="typeahead-arrow">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={showDropdown ? 'typeahead-arrow--up' : ''}
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="typeahead-dropdown"
          role="listbox"
        >
          {isLoading ? (
            <div className="typeahead-message">
              {loadingMessage}
            </div>
          ) : hasFilteredOptions ? (
            filteredOptions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                ref={el => { optionRefs.current[index] = el; }}
                id={`typeahead-option-${index}`}
                className={`typeahead-option ${
                  index === highlightedIndex ? 'typeahead-option--highlighted' : ''
                }`}
                role="option"
                aria-selected={index === highlightedIndex}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="typeahead-message">
              {noOptionsMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TypeaheadDropdown;
