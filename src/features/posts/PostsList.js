// TOOLS
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// COMPONENTS
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Spinner } from '../../components/Spinner';
// SELECTORS && THUNKS
import { fetchPosts, selectPostById, selectPostIds } from "./postsSlice";

// COMPONENT TO RENDER THE POST
const PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId));

  return (
    <article key={ post.id } className='post-excerpt'>
      <h3>{ post.title }</h3>
      <PostAuthor userId={ post.user } />
      <TimeAgo timestamp={ post.date } />
      <p className='post-content'>{ post.content.substring(0, 100) } ...</p>
      <Link to={ `/posts/${post.id}` } className='button muted-button'>
        View Post
      </Link>
      <ReactionButtons post={ post } />
    </article>
  );
};

export default function PostsList() {
  const dispatch = useDispatch();
  const status = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);
  const orderedPostIds = useSelector(selectPostIds);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  // DIFFERENT STATES OF THE APP AND RENDERING UI BASED ON IT
  let content;

  if (status === 'loading') {
    content = (
      <Spinner text="loading..." />
    );

  } else if (status === 'succeeded') {

    content = orderedPostIds.map(id => (
      <PostExcerpt key={ id } postId={ id } />
    ));

  } else if (status === 'failed') {
    content = <div>{ error }</div>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      { content }
    </section>
  );
}