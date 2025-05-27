import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

// Bu API endpoint'i tüm admin dashboard kaydetme işlemleri için genel bir çözüm sağlar
export async function POST(request: Request) {
    try {
        const requestData = await request.json()
        const { table, data, id, action } = requestData

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

        switch (action) {
            case 'update':
                result = await supabase
                    .from(table)
                    .update(data)
                    .eq('id', id)
                    .select()
                break

            case 'insert':
                result = await supabase
                    .from(table)
                    .insert(data)
                    .select()
                break

            case 'delete':
                result = await supabase
                    .from(table)
                    .delete()
                    .eq('id', id)
                break

            default:
                return NextResponse.json(
                    { error: 'Geçersiz işlem' },
                    { status: 400 }
                )
        }

        if (result.error) {
            console.error('Veri işleme hatası:', result.error)
            return NextResponse.json(
                { error: result.error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: `${table} tablosunda ${action} işlemi başarılı`
        })

    } catch (error: any) {
        console.error('API hatası:', error)
        return NextResponse.json(
            { error: error.message || 'Bir hata oluştu' },
            { status: 500 }
        )
    }
}
