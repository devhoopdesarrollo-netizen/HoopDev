// src/config/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: {
    env: {
        SUPABASE_URL?: string;
        SUPABASE_KEY?: string;
    };
};

 class supabase{
    public client: SupabaseClient; 
    private supabaseUrl: string;
    private supabaseKey: string;

    constructor() {
        this.supabaseUrl = process.env.SUPABASE_URL || '';
        this.supabaseKey = process.env.SUPABASE_KEY || '';

        if (!this.supabaseUrl || !this.supabaseKey) {
            console.warn('⚠️ Advertencia: Credenciales de Supabase no configuradas.');
        }

        this.client = createClient(this.supabaseUrl, this.supabaseKey);
    }
    UserAuntentiked_Token(User_Token:string){
        (this.client as any).rest.headers['Authorization'] = `Bearer ${User_Token}`;

    }
}
const supabaseService = new supabase();
export default supabaseService;
