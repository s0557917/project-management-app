import { signOut } from 'next-auth/react';
import { SignOut } from "phosphor-react";

export default function SignOutButton() {
    return (
        <div className="flex items-center justify-center">
            <button
                onClick={() => signOut()}
                className="flex justify-between items-center bg-red-600 hover:bg-red-800 text-white text-sm font-bold my-1 py-1 px-3 rounded-full"
            >
                <SignOut size={16} color="#ffffff" weight="bold"/>
                <p className='pl-2'>Sign Out</p>
            </button>
        </div>
    )
}