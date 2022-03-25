// TOOLS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeapi' }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ id }) => ({ type: 'Post', id }))
      ]
    }),

    getSinglePost: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
    }),

    addNewPost: builder.mutation({
      query: initialPost => ({
        method: 'POST',
        url: '/posts',
        body: initialPost
      }),
      invalidatesTags: ['Post']
    }),

    editPost: builder.mutation({
      query: post => ({
        method: 'PATCH',
        url: `/posts/${post.id}`,
        body: post
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
    }),

    getUsers: builder.query({
      query: () => '/users'
    })
  })
});

export const { useGetPostsQuery, useGetSinglePostQuery, useAddNewPostMutation, useEditPostMutation, useGetUsersQuery } = apiSlice; 