import { useUserContext } from "../../../shared/providers/user.provider";

function Profile() {
  const { user } = useUserContext();

  return <p>Hello, {user.value?.username}!</p>;
}

export default Profile;
