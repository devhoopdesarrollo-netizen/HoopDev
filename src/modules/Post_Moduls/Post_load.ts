import supabaseService from "../../config/supabase.js";
import { iPostResponse, PostLike } from "../../types/types.js";

export default class Post_Load {
    async cargarPost(): Promise<iPostResponse[]> {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("Post")
                .select(`
                    id_post,
                    contenido,
                    img_direccion,
                    fecha_post,
                    User (
                        id_user,
                        nombre
                    )
                `)
                .order("fecha_creacion", { ascending: false });

            if (error) {
                throw error;
            }

            // Consultar conteo consolidado de likes desde la vista v_post_likes
            const { data: likesData, error: likesError } = await client
                .from("v_post_likes")
                .select("id_post, likes_count");

            if (likesError) {
                console.warn("No se pudo cargar v_post_likes:", likesError);
            }

            const likesMap = new Map<string, number>();
            likesData?.forEach((l: any) => {
                likesMap.set(l.id_post, Number(l.likes_count) || 0);
            });

            // Verificar si el usuario actual ya dio like
            let currentUserId: string | null = null;
            try {
                const sessionStr = localStorage.getItem("userSeccion");
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    currentUserId = session.id_user || null;
                }
            } catch {
                currentUserId = null;
            }

            const userLikesSet = new Set<string>();
            if (currentUserId) {
                const { data: userHist } = await client
                    .from("PostHistorial")
                    .select("fk_post")
                    .eq("fk_user", currentUserId)
                    .eq("is_like", true);

                userHist?.forEach((h: any) => {
                    if (h.fk_post) userLikesSet.add(h.fk_post);
                });
            }

            const postsConLikes: iPostResponse[] = (data || []).map((post: any) => ({
                id_post: post.id_post,
                contenido: post.contenido,
                img_direccion: post.img_direccion,
                fecha_post: post.fecha_post,
                User: post.User,
                likes: likesMap.get(post.id_post) || 0,
                user_liked: userLikesSet.has(post.id_post)
            }));

            console.log("Datos de publicaciones cargados con likes:", postsConLikes);
            return postsConLikes;

        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
            throw error;
        }
    }

    async LikeCarga(id: string) {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("v_post_likes")
                .select(`*`)
                .eq("id_post", id);

            if (error) {
                throw error;
            }

            return data;

        } catch (error) {
            throw error;
        }
    }
}
