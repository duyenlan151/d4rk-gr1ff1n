import { useUserContext } from "../../../shared/contexts/user.context";

function Profile() {
  const { user } = useUserContext();

  return <p>Hello, {user.value?.username}!</p>;
}

export default Profile;
