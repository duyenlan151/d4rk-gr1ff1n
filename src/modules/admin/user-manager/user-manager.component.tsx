import { DataGrid, GridCellParams, GridColDef, GridRenderCellParams, GridRowParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { useTransitionContext } from "@/shared/providers/transition.provider";
import { useUserProvider } from "@/shared/providers/user.provider";
import { forkJoin, tap } from "rxjs";
import { generateUUID } from "@/shared/util.class";
import { PreviewUser } from "@/shared/models/user/user.model";
import { CompactRole } from "@/shared/models/role/role.model";
import { useSignal } from "@preact/signals-react";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Constants } from "@/shared/constants.enum";
import { List, Map } from "immutable";
import { Chip } from "@mui/material";

import UserDetailsPopup from "./components/user-details-popup/user-details-popup..component";
import useRoleProvider from "@/shared/providers/role.provider";
import Loader from "@/shared/components/loader/loader.component";
import usePermissionProvider from "@/shared/providers/permission.provider";

const columns: GridColDef[] = [
  {
    field: 'username',
    headerName: 'Username',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
  },
  {
    field: 'createTime',
    headerName: 'Created Time',
    flex: 1,
    valueFormatter: dateTimeToFormat(Constants.DATE_TIME_FORMAT_FULL),
  },
  {
    field: 'updateTime',
    headerName: 'Updated Time',
    flex: 1,
    valueFormatter: dateTimeToFormat(Constants.DATE_TIME_FORMAT_FULL),
  },
  {
    field: 'roles',
    headerName: 'Roles',
    flex: 1,
    renderCell: RoleCell,
  },
];

function RoleCell({ value }: GridRenderCellParams<List<string>>) {
  const uuidGenerator = generateUUID();
  const roles = [];

  for (const role of value as List<string>) {
    roles.push(<Chip key={uuidGenerator.next().value as string} label={role} />);
  }

  return <div className="flex gap-2">{roles}</div>;
}

function dateTimeToFormat(format?: string) {
  return (data: GridValueFormatterParams<DateTime>) => {
    if (!data.value) {
      return data.value;
    }

    return format ? data.value.toFormat(format) : data.value.toISO();
  };
}

function UserManager() {
  const userList = useSignal<PreviewUser[]>([]);
  const selectedUser = useSignal<PreviewUser | undefined>(undefined);
  const isLoading = useSignal<boolean>(false);
  // const roleMap = useSignal<>

  const { getUsers } = useUserProvider();
  const { getRoles } = useRoleProvider();
  const { getPermissions } = usePermissionProvider();
  const { entered } = useTransitionContext();

  function onRowClick(params: GridRowParams<PreviewUser>) {
    selectedUser.value = params.row;
  }

  useEffect(() => {
    _initData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered.value]);

  function _initData() {
    if (userList.value.length || !entered.value) {
      return;
    }

    isLoading.value = true;

    forkJoin([
      getUsers(),
      getRoles({ compact: true, permissions: true }),
      getPermissions({ full: true }),
    ])
      .pipe(tap(() => (isLoading.value = false)))
      .subscribe(([users, roles]: unknown[]) => {
        const _roleMap = Map<string, CompactRole>().withMutations((map: unknown) => {
          for (const role of roles as unknown[]) {
            map.set(role.id, role);
          }
        });

        userList.value = users.map((user: unknown[]) =>
          user.update('roles', (_roles) => _roles.map((role) => _roleMap.get(role)?.name ?? role))
        );
      });
  }

  function _modifyCellClass(params: GridCellParams) {
    return params.colDef.cellClassName?.toString() ?? 'cursor-pointer focus:!outline-none';
  }

  return (
    <div className="w-full grid grid-cols-1 grid-row-min divide-y">
      <Loader isVisible={isLoading} />
      <div className="pb-2">
        <h1 className="text-3xl font-semibold">User Manager</h1>
        <p>
          Streamline user management and administration for seamless control and personalized
          interactions.
        </p>
      </div>
      <div className="w-full pt-2 grid grid-cols-1 grid-rows-min gap-2">
        <div></div>
        <DataGrid
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          getCellClassName={_modifyCellClass}
          onRowClick={onRowClick}
          rows={userList.value}
          columns={columns}
        />
      </div>
      <UserDetailsPopup user={selectedUser} />
    </div>
  );
}

export default UserManager;
