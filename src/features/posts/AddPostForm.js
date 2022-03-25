// TOOLS
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// SELECTORS
import { selectAllUsers } from "../users/usersSlice";
// THUNKS
import { addNewPost } from "./postsSlice";

export default function AddPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChange = (e) => setUserId(e.target.value);
  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        await dispatch(addNewPost({ title, content, user: userId })).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setAddRequestStatus('idle');
      }
    }
  };

  const usersOptions = users.map(user => (
    <option key={ user.id } value={ user.id }>
      { user.name }
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={ title }
          onChange={ onTitleChanged }
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id='postAuthor' value={ userId } onChange={ onAuthorChange }>
          <option value=''></option>
          { usersOptions }
        </select>

        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={ content }
          onChange={ onContentChanged }
        />

        <button type="button" onClick={ onSavePostClicked }>Save Post</button>
      </form>
    </section>
  );
}