// src/components/ProtectedRoute.tsx
import { JSX, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../SupabaseClient'

import type { User } from '@supabase/supabase-js';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
            setChecking(false)
        }

        checkUser()
    }, [])

    if (checking) return <p>Проверка авторизации...</p>
    if (!user) return <Navigate to="/auth" />

    return children
}

export default ProtectedRoute
