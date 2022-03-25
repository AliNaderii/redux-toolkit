// TOOLS
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
// COMPONENTS
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
// SELECTORS
import { selectPostById } from "./postsSlice";

export default function SinglePostPage() {
  const id = useParams().id;
  const post = useSelector(state => selectPostById(state, id));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{ post.title }</h2>
        <PostAuthor userId={ post.user } />
        <TimeAgo timestamp={ post.date } />
        <p className='post-content'>{ post.content }</p>
        <ReactionButtons post={ post } />
        <Link to={ `/editPost/${id}` } className='button'>
          Edit Post
        </Link>
      </article>
    </section>
  );
}