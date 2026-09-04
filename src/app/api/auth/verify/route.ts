import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pin, action } = await request.json();

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: profile, error: dbError } = await supabaseAdmin.from('family_profile').select('*').single();

    if (action === 'setup') {
      if (profile) return NextResponse.json({ error: 'PIN sudah pernah diatur' }, { status: 400 });
      
      const hash = await bcrypt.hash(pin, 10);
      await supabaseAdmin.from('family_profile').insert({ pin_hash: hash });
      return NextResponse.json({ success: true, message: 'PIN berhasil diatur. Silakan login.' });
    }

    if (!profile) return NextResponse.json({ error: 'needs_setup' }, { status: 404 });

    const isValid = await bcrypt.compare(pin, profile.pin_hash);
    if (!isValid) return NextResponse.json({ error: 'PIN salah' }, { status: 401 });

    // Karena di Next.js 15 createClient sekarang async, tambahkan await
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.SYSTEM_EMAIL!,
      password: process.env.SYSTEM_PASSWORD!,
    });

    if (authError) {
      // Kita kembalikan pesan asli dari Supabase agar mudah di-debug
      console.error("Supabase Auth Error:", authError.message);
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Route Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}