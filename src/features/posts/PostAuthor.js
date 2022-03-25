// TOOLS
import { useSelector } from "react-redux";
// SELECTORS
import { selectUserById } from "../users/usersSlice";

export default function PostAuthor({ userId }) {
  const author = useSelector(state => selectUserById(state, userId));

  return (
    <span>by { author ? author.name : 'Unknown Author' }</span>
  );
}