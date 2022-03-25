// TOOLS
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications', async (_, { getState }) => {
    try {
      const allNotifications = selectAllNotifications(getState());
      const [latestNotifications] = allNotifications;
      const latestTimestamp = latestNotifications ? latestNotifications.date : '';
      const res = await client.get(
        `/fakeapi/notifications?since=${latestTimestamp}`
      );
      return res.data;
    }
    catch (err) {
      console.log(err);
    }
  }
);

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    return b.date.localeCompare(a.date);
  }
});

const initialState = notificationsAdapter.getInitialState();

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true;
      });
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        notificationsAdapter.upsertMany(state, action.payload);
        Object.values(state.entities).forEach(notification => {
          // Any notifications we've read are no longer new
          notification.isNew = !notification.read;
        });
      });
  }
});

// SELECTORS
export const { selectAll: selectAllNotifications } = notificationsAdapter.getSelectors(state => state.notifications);

export const { allNotificationsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;