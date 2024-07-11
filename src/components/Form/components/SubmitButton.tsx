'use strict'

interface SubmitButtonProps {
    text: string
}

export function SubmitButton({text}: SubmitButtonProps) {
    return (
        <button
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
            type="submit"
        >
            {text}
        </button>
    )
}