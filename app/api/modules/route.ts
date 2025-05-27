import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const requestData = await request.json()
        const { moduleData, moduleId } = requestData

        const supabase = createRouteHandlerClient<Database>({ cookies })

        // Kullanıcı oturum kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json(
                { error: 'Oturum açmanız gerekiyor' },
                { status: 401 }
            )
        }

        // Admin kontrolü
        const { data: userProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if (!userProfile || userProfile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Bu işlem için admin yetkisi gerekiyor' },
                { status: 403 }
            )
        }

        let result

        if (moduleId) {
            // Güncelleme
            result = await supabase
                .from('modules')
                .update(moduleData)
                .eq('id', moduleId)
                .select()
        } else {
            // Yeni oluşturma
            result = await supabase
                .from('modules')
                .insert(moduleData)
                .select()
        }

        if (result.error) {
            console.error('Modül kaydetme hatası:', result.error)
            return NextResponse.json(
                { error: result.error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: moduleId ? 'Modül güncellendi' : 'Modül oluşturuldu'
        })

    } catch (error: any) {
        console.error('API hatası:', error)
        return NextResponse.json(
            { error: error.message || 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}
