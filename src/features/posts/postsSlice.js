// TOOLS
import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.date.localeCompare(a.date);
  }
});

const initialState = postAdapter.getInitialState({
  status: 'idle',
  error: null
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const res = await client.get('/fakeapi/posts');
    return res.data;
  }
  catch (err) {
    console.log(err);
  }
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (post) => {
  const res = await client.post('/fakeapi/posts', post);
  return res.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {

    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.entities[id];
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },

    reactionAdded(state, action) {
      const { id, reaction } = action.payload;
      const existingPost = state.entities[id];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    }
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, postAdapter.addOne);
  }
});

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
} = postAdapter.getSelectors(state => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => {
    return posts.filter(post => post.user === userId);
  }
);

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;