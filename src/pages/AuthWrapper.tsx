import { useEffect, useState } from 'react'
import { supabase } from '../SupabaseClient'
import SignupForm from '../components/auth/SignupForm'

import type { User } from '@supabase/supabase-js';

import { useNavigate } from 'react-router-dom';

const AuthWrapper = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
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
            </div>
        )
    }

    const handleCreateTree = () => {
        navigate('/tree');
    };
    return (
        <div>
            <p>Привет, {user.email}</p>
            <button className="rounded-pill"
                style={{ backgroundColor: "#4a8d56", borderColor: "#4a8d56" }} onClick={() => supabase.auth.signOut()}>Выйти
            </button>
            <button className='rounded-pill'
                onClick={handleCreateTree}>
                Cоздать древо
            </button>
        </div>
    )
}

export default AuthWrapper
