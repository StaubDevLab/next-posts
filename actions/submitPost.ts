'use server'

import { z } from 'zod'
import {redirect} from "next/navigation";
import { S3 } from '@aws-sdk/client-s3';
import {deletePost, storePost} from "@/lib/posts";
const s3 = new S3({ region: 'eu-west-3' });
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
    const {title, content,image} = validatedFields.data
    const extension = image.name.split(".").pop()
    const fileName = `${title}.${extension}`

    const bufferedImage = await image.arrayBuffer()

    s3.putObject({
        Bucket: 'next-foodies',
        Key: `images/${fileName}`,
        Body: Buffer.from(bufferedImage),
        ContentType: image.type,
    });
    await storePost({
        title: title,
        content: content,
        imageUrl:`/images/${fileName}`,
        userId:1
    })

    redirect('/')
    return {
        message: 'Post créé avec succès !',
    }
}

export async function deletePostAction(postID : string): Promise<ActionState> {
    await deletePost(postID)
    redirect('/')
}