import { useSession } from "next-auth/react";
import { Menu } from "@mantine/core"
import { useEffect } from "react";
import { useState } from "react";

export default function UserInformation() {
    const { data: session } = useSession();

    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    
    useEffect(() => {
        if(session) {
            setUserName(session.user.name);
            setUserEmail(session.user.email);
        }
    }, [session])

    return (
        <>
            <Menu.Item>
                <div className="flex">
                    Username: 
                    <p className="mx-1 font-semibold text-md">{userName}</p>
                </div>
            </Menu.Item>
            <Menu.Item>
                <div className="flex">
                    Email: 
                    <p className="mx-1 font-semibold">{userEmail}</p>
                </div>
            </Menu.Item>
        </>
    )
}