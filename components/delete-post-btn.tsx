'use client'
import React from 'react';
import {deletePostAction} from "@/actions/submitPost";

const DeletePostBtn = ({postId} : {postId: string}) => {
    const handleDelete = async  () => {
       await deletePostAction(postId);
    }
    return (
        <button onClick={handleDelete} >Delete</button>
    );
};

export default DeletePostBtn;