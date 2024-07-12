'use client';

import { useContext } from "react";
import { FormContext } from "..";


interface InputProps {
    type: 'text' | 'password' | 'email';
    name: string;
    maxLength?: number;
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export function Input({
    type,
    name,
    placeholder,
    required,
    maxLength,
    className
}: InputProps)  {
    const {formValues, setFormValues} = useContext(FormContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [event.target.name]: value,
        }));
    };

    return(
        <input
            type={type}
            name={name}
            maxLength={maxLength}
            placeholder={placeholder}
            required={required}
            className= {className + " bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"}
            onChange={handleChange}
        />
    ); 
        
    
}
