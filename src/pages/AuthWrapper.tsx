import { useEffect, useState } from 'react'
import { supabase } from '../SupabaseClient'
import SignupForm from '../components/auth/SignupForm'
import LoginForm from '../components/auth/LoginForm'

import type { User } from '@supabase/supabase-js';


const AuthWrapper = () => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    if (!user) {
        return (
            <div>
                <SignupForm />
                <LoginForm />
            </div>
        )
    }

    return (
        <div>
            <p>Привет, {user.email}</p>
            <button onClick={() => supabase.auth.signOut()}>Выйти</button>
        </div>
    )
}

export default AuthWrapper
