'use client';
import React, { useRef} from 'react';
import {useFormState} from 'react-dom'
import {ActionState, createPost} from "@/actions/submitPost";
import FormSubmit from "@/components/form-submit";


const initialState: ActionState = {}
const PostForm = () => {
    const [state, formAction] = useFormState(createPost, initialState)
    const formRef = useRef<HTMLFormElement>(null)
    return (
        <>
            <h1>Create a new post</h1>
            <form ref={formRef} action={formAction}>
                <p className="form-control">
                    <label htmlFor="title">Titre</label>
                    <input type="text" id="title" name="title" />
                    {state.errors?.title && <p className={"form-errors"}>{state.errors.title}</p>}
                </p>
                <p className="form-control">
                    <label htmlFor="image">Image </label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        id="image"
                        name="image"
                    />
                    {state.errors?.image && <p className={"form-errors"}>{state.errors.image}</p>}
                </p>
                <p className="form-control">
                    <label htmlFor="content">Contenu</label>
                    <textarea id="content" name="content" ></textarea>
                    {state.errors?.content && <p className={"form-errors"}>{state.errors.content}</p>}
                </p>
                <div className={"form-actions"}>

                <FormSubmit/>
                </div>
                {state.message && <p>{state.message}</p>}
            </form>
        </>
    );
};

export default PostForm;