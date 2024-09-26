'use client'
import {useOptimistic} from 'react';
import {formatDate} from '@/lib/format';
import LikeButton from './like-icon';
import {PostType} from "@/@types/Post";
import DeletePostBtn from "@/components/delete-post-btn";
import {togglePostLikesStatus} from "@/actions/submitPost";

function Post({post, action}: { post: PostType, action: (postId: string) => Promise<void> }) {
    console.log(post);
    return (
        <article className="post">
            <div className="post-image">
                <img src={`https://next-foodies.s3.eu-west-3.amazonaws.com/${post.image}`} alt={post.title}/>
            </div>
            <div className="post-content">
                <header>
                    <div>
                        <h2>{post.title}</h2>
                        <p>
                            Shared by {post.userFirstName} on{' '}
                            <time dateTime={post.createdat}>
                                {formatDate(post.createdat)}
                            </time>
                        </p>
                    </div>
                    <div>
                        <form action={action.bind(null, post.id)}
                              className={post.isLiked ? "liked" : undefined}>

                            <LikeButton/>
                        </form>
                    </div>
                </header>
                <p>{post.content}</p>
            </div>
            <DeletePostBtn postId={post.id}/>
        </article>
    );
}

export default function Posts({posts}: { posts: PostType[] }) {

    const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts:PostType[], updatedPostId: string): PostType[]=> {
        const updatedPostIndex = prevPosts.findIndex(post => post.id === updatedPostId);
        if(+updatedPostId === -1) {
            return prevPosts
        }
        const updatedPost = {...prevPosts[updatedPostIndex]}
        updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1)
        updatedPost.isLiked = !updatedPost.isLiked
        const newPosts = [...prevPosts]
        newPosts[updatedPostIndex] = updatedPost
        return newPosts
    } )
    if (!posts || posts.length === 0) {
        return <p>There are no posts yet. Maybe start sharing some?</p>;
    }
    async function updatePost(postId: string){
        updateOptimisticPosts(postId)
        await togglePostLikesStatus(postId)
    }

    return (
        <ul className="posts">
            {optimisticPosts.map((post) => (
                <li key={post.id}>
                    <Post post={post} action={updatePost} />
                </li>
            ))}
        </ul>
    );
}
