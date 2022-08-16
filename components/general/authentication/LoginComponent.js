import { useState } from 'react'
import { supabase } from '../../../utils/supabaseClient'
import { TextInput, Button } from '@mantine/core'
import { showNotification } from '@mantine/notifications';

export default function LoginComponent() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (email) => {
        try {
            setIsLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error
            showNotification({
                title: 'Check your email for the login link!',
                color: 'green',
            })
        } catch (error) {
            showNotification({
                title: 'Error!',
                description: error.error_description || error.message,
                color: 'red',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full rounded-md p-3 bg-black">
          <div>
            <h1 className='my-10'>Login</h1>
            <p className=''>
              Sign-in via magic link with your E-Mail below!
            </p>
            <div className='my-5'>
                <TextInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <button
                    className='bg-cyan-500 hover:bg-cyan-700 text-white font-bold p-5 rounded-md'
                    onClick={(e) => {
                        e.preventDefault()
                        handleLogin(email)
                    }}
                >
                    <span>{isLoading ? 'Loading...' : 'Send magic link!'}</span>
                </button>
            </div>
            <button 
                onClick={() =>
                    showNotification({
                        title: 'Default notification',
                        message: 'Hey there, your code is awesome! 🤥',
                    })
                }> 
                Test
            </button>
          </div>
        </div>
    )
}