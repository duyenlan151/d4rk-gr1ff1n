/* eslint-disable react-hooks/exhaustive-deps */
import "./side-nav.component.scss";

import { BehaviorSubject, Subject, debounceTime, takeUntil } from "rxjs";
import { Dashboard, People, Groups } from "@mui/icons-material";
import { useEffect, useRef } from "react";
import { useUserContext } from "../../providers/user.provider";
import { AppPermission } from "../../constants.enum";
import { useSignal } from "@preact/signals-react";
import { NavLink } from "react-router-dom";
import { Set } from "immutable";

interface INavItem {
  path: string;
  displayName: string;
  icon: JSX.Element;
  permissions: AppPermission[];
}

interface IWatchedNavItem extends INavItem {
  id: string;
  activeItem: BehaviorSubject<string>;
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
  const pattern = 'x4xx-yxxx-xxxxxxxxxxxx';

  while (true) {
    yield pattern.replace(/[xy]/g, function(char) {
      const randomHexDigit = Math.random() * 16 | 0;
      const hexDigit = char === 'x' ? randomHexDigit : (randomHexDigit & 0x3 | 0x8);
      return "a" + hexDigit.toString(16);
    });
  }
}

function NavItem(props: Partial<IWatchedNavItem>) {
  const Icon = () => props.icon;
  
  function className({ isActive }: Record<string, boolean>): string {
    if (isActive && props.activeItem) {
      props.activeItem.next(props.id as string);
    }

    return "nav-item relative z-10";
  }

  return (
    <NavLink id={props.id} to={props.path as string} className={className}>
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
  const activeItemId = useSignal(new BehaviorSubject<string | undefined>(undefined));
  const activeItemTop = useSignal(0);
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDestroy$ = new Subject<void>();

    activeItemId.value
      .pipe(takeUntil(onDestroy$), debounceTime(100))
      .subscribe((id) => {
        const containerEl = containerRef.current ;
        const el = document.querySelector<HTMLElement>(`#${id}`);

        el?.classList.add("active")

        const containerTop = containerEl?.getBoundingClientRect().top ?? 0;
        const elTop = el?.getBoundingClientRect().top ?? 0;
        
        activeItemTop.value = elTop - containerTop;
      });

    return () => onDestroy$.next();
  }, [activeItemId.value]);

  if (!user.value) {
    return <></>;
  }

  const navItems = [];

  let _permissions = Set<string>();

  for (const { permissions } of user.value.roles) {
    for (const permission of permissions) {
      _permissions = _permissions.add(permission);
    }
  }

  for (const navItem of nav) {
    if (navItem.permissions && !navItem.permissions?.every((permission) => _permissions.has(permission))) {
      continue;
    }

    const id = uuidGenerator.next().value as string;

    navItems.push(<NavItem id={id} key={id} {...navItem} activeItem={activeItemId.value as BehaviorSubject<string>} />);
  }

  return (
    <div ref={containerRef} className="side-nav-container w-52 py-2 bg-white rounded-lg shadow-md shadow-grey-500 mt-[52px] h-[50vh] grid grid-cols-1 auto-rows-min divide-y relative">
      <div className="active-background w-full h-10 absolute left-0 z-0" style={{ top: `${activeItemTop.value}px` }}></div>
      {navItems}
    </div>
  );
}

export default SideNav;
