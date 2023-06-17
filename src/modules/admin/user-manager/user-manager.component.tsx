import { DataGrid, GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { GenericRole, GenericUser, useUserProvider } from "../../../shared/providers/user.provider";
import { useSignal } from "@preact/signals-react";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Constants } from "../../../shared/constants.enum";
import { List } from "immutable";
import { Chip } from "@mui/material";
import { useTransitionContext } from "../../../shared/providers/transition.provider";

const columns: GridColDef[] = [
  { 
    field: "username", 
    headerName: "Username", 
    flex: 1, 
  },
  { 
    field: "email", 
    headerName: "Email", 
    flex: 1 ,
  },
  {
    field: "createTime",
    headerName: "Created Time",
    flex: 1,
    valueFormatter: dateTimeToFormat(Constants.DATE_TIME_FORMAT_FULL),
  },
  {
    field: "updateTime",
    headerName: "Updated Time",
    flex: 1,
    valueFormatter: dateTimeToFormat(Constants.DATE_TIME_FORMAT_FULL),
  },
  { 
    field: "roles", 
    headerName: "Roles", 
    flex: 1, 
    renderCell: RoleCell 
  },
];

function RoleCell({ value }: GridRenderCellParams<List<GenericRole>>) {
  const roles = [];

  for (const role of value as List<GenericRole>) {
    roles.push(
      <Chip
        key={role.id}
        label={role.name}
        className={`opacity-${role.enabled ? "100" : "50"}`}
      />
    );
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
  const userList = useSignal<GenericUser[]>([]);

  const { getAllUser } = useUserProvider();
  const { entered } = useTransitionContext();

  useEffect(() => {
    _populateUserList();
  }, [entered.value]);

  function _populateUserList() {
    if (userList.value.length || !entered.value) {
      return;
    }

    getAllUser().subscribe((data) => {
      userList.value = data;
    });
  }

  return (
    <div className="w-full grid grid-cols-1 grid-row-min divide-y">
      <div className="pb-2">
        <h1 className="text-3xl font-semibold">User Manager</h1>
        <p>Streamline user management and administration for seamless control and personalized interactions.</p>
      </div>
      <div className="w-full pt-2 grid grid-cols-1 grid-rows-min gap-2">
        <div>
        </div>
        <DataGrid checkboxSelection disableRowSelectionOnClick rows={userList.value} columns={columns}/>
      </div>
    </div>
  );
}

export default UserManager;
