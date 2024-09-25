import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import {PostType} from "@/@types/Post";
import DeletePostBtn from "@/components/delete-post-btn";

function Post({ post } : {post: PostType}) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={`https://next-foodies.s3.eu-west-3.amazonaws.com${post.image}`} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <LikeButton />
          </div>
        </header>
        <p>{post.content}</p>
      </div>
      <DeletePostBtn postId={post.id}/>
    </article>
  );
}

export default function Posts({ posts } : {posts : PostType[]}) {
  if (!posts || posts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}
