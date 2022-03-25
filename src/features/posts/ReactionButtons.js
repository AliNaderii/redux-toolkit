// TOOLS
import { useDispatch } from "react-redux";
// ACTIONS
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
};

export default function ReactionButtons({ post }) {
  const dispatch = useDispatch();
  const postId = post.id;
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={ name }
        type='button'
        className="muted-button reaction-button"
        onClick={ () => dispatch(reactionAdded({ id: postId, reaction: name })) }>
        { emoji } { post.reactions[name] }
      </button>
    );
  });

  return (
    <div>{ reactionButtons }</div>
  );
}