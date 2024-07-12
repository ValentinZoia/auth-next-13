"use client";

import React, { useState } from "react";
import { Input, SubmitButton } from "./components";

// Tipo para los valores del formulario, donde las claves son los nombres de los campos y los valores son los valores de los campos
type FormValues = Record<string, string>;

//Tipo para el contexto del formulario, que contiene los valores y la función de actualización de los valores del formulario
interface FormContextType {
  formValues: FormValues;
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

interface FormProps{
    title: string;
    description?: string;
    descriptionLink?:string;
    href?:string;
    children: React.ReactNode;
    onSubmit: (values: FormValues) => void;
    
    
}


// Creación del contexto del formulario, donde se especifica que el tipo del contexto es FormContextType o nulo
export const FormContext = React.createContext<FormContextType | null>(null);

export function Form({title, description,descriptionLink,href, children, onSubmit}: FormProps){
    const [formValues, setFormValues] = useState<FormValues>({});
   
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(formValues)

    }

    return (
        <FormContext.Provider value={{formValues, setFormValues}}>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
                <div className="w-full max-w-md bg-gray-900 rounded-lg  p-6">
                    <h2 className="text-2xl font-bold text-gray-200 mb-1">{title}</h2>
                    {description && <p className="text-gray-400 mb-8">{description}{descriptionLink && <a className='text-sm text-blue-500 -200 hover:underline mt-4' href={href}>{descriptionLink}</a>}</p>}
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        {children}
                    </form>
                </div>
            </div>
        </FormContext.Provider>
    )
} 

Form.Input = Input
Form.SubmitButton = SubmitButton