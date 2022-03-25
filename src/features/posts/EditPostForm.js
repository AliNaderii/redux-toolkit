// TOOLS
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
// ACTIONS
import { postUpdated } from './postsSlice';
// SELECTORS
import { selectPostById } from './postsSlice';

export default function EditPostForm() {
  const history = useHistory();
  const id = useParams().id;
  const post = useSelector(state => selectPostById(state, id));
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const dispatch = useDispatch();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({
        id,
        title,
        content
      }));

      history.push(`/posts/${id}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={ title }
          onChange={ onTitleChanged }
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={ content }
          onChange={ onContentChanged }
        />
      </form>
      <button type="button" onClick={ onSavePostClicked }>
        Save Post
      </button>
    </section>
  );
}