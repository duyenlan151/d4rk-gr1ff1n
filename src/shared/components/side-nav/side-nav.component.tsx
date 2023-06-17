import "./side-nav.component.scss";

import { Dashboard, People, Groups } from "@mui/icons-material";
import { useUserContext } from "../../providers/user.provider";
import { AppPermission } from "../../constants.enum";
import { NavLink } from "react-router-dom";

interface INavItem {
  path: string;
  displayName: string;
  icon: JSX.Element;
  permissions: AppPermission[];
}

const nav: Partial<INavItem>[] = [
  {
    path: "/admin/dashboard",
    displayName: "Dashboard",
    icon: <Dashboard />,
  },
  {
    path: "/admin/user-manager",
    displayName: "User Manager",
    icon: <People />,
    permissions: [AppPermission.USER_READ],
  },
  {
    path: "/admin/role-manager",
    displayName: "Role Manager",
    icon: <Groups />,
    permissions: [AppPermission.ROLE_READ],
  },
];

function* generateUUID() {
  while (true) {
    yield "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (character) {
        const randomDigit = (Math.random() * 16) | 0;
        const hexDigit =
          character === "x" ? randomDigit : (randomDigit & 0x3) | 0x8;
        return hexDigit.toString(16);
      }
    );
  }
}

function NavItem(props: Partial<INavItem>) {
  const Icon = () => props.icon;

  return (
    <NavLink to={props.path as string} className={({ isActive, isPending }) => `${isPending ? "pending" : isActive ? "active" : ""} nav-item`}>
      <div className="item-content px-4 flex gap-2 h-10 items-center hover:bg-green-200">
        {props.icon ? <Icon /> : undefined} 
        <div>{props.displayName}</div>
      </div>
    </NavLink>
  );
}

function SideNav() {
  const { user } = useUserContext();
  const uuidGenerator = generateUUID();
  const userNav = nav.filter(({ permissions }) =>
    permissions
      ? permissions?.every((permission) =>
          user.value?.permissions?.includes(permission)
        )
      : true
  );

  return (
    <div className="side-nav-container w-52 py-2 bg-white rounded-lg shadow-md shadow-grey-500 mt-[52px] h-[50vh] grid grid-cols-1 auto-rows-min divide-y">
      {userNav.map((item) => (
        <NavItem key={uuidGenerator.next().value as string} {...item} />
      ))}
    </div>
  );
}

export default SideNav;
