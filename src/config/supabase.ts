    // src/config/supabase.ts
    import { createClient, SupabaseClient } from '@supabase/supabase-js';

    declare const process: {
        env: {
            SUPABASE_URL?: string;
            SUPABASE_KEY?: string;
        };
    };

    class supabase {
        public client: SupabaseClient;
        private supabaseUrl: string;
        private supabaseKey: string;
        private authClient: SupabaseClient | null = null;
        private authClientToken: string | null = null;

        constructor() {
            this.supabaseUrl = process.env.SUPABASE_URL || '';
            this.supabaseKey = process.env.SUPABASE_KEY || '';

            if (!this.supabaseUrl || !this.supabaseKey) {
                console.warn('⚠️ Advertencia: Credenciales de Supabase no configuradas.');
            }

            this.client = createClient(this.supabaseUrl, this.supabaseKey);
        }
        UserAuntentiked_Token(User_Token: string): SupabaseClient {
            if (this.authClient && this.authClientToken === User_Token) {
                return this.authClient;
            }
            
            this.authClientToken = User_Token;
            this.authClient = createClient(this.supabaseUrl, this.supabaseKey,{
                global: {
                    headers: {
                        
                        Authorization: `Bearer ${User_Token}`
                    }
                    
                },
                auth:{
                    persistSession:false,
                    autoRefreshToken:false,
                    detectSessionInUrl:false
                }
            });

            return this.authClient;
        }
    }
    const supabaseService = new supabase();
    export default supabaseService;
