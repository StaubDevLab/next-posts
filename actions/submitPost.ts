'use server'

import { z } from 'zod'
import {redirect} from "next/navigation";

const PostSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
    content: z.string().min(10, 'Le contenu doit avoir au moins 10 caractères'),
    image: z.instanceof(File).refine((file)=>{
        return file && file.size <= 5 * 1024 * 1024
    },'L\'image doit-être inféireure à 5 Mb').refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), 'Format d\'image non supporté')
})

export type ActionState = {
    errors?: {
        title?: string[]
        content?: string[]
        image?: string[]
    }
    message?: string
}

export async function createPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const validatedFields = PostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        image: formData.get('image'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Échec de la validation. Veuillez corriger les erreurs.',
        }
    }

    redirect('/')
    return {
        message: 'Post créé avec succès !',
    }
}