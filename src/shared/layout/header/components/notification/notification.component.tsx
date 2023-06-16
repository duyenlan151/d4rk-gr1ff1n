import { NotificationsOutlined } from "@mui/icons-material";
import { Badge } from "@mui/material";

function NotificationButton() {
  return (
    <Badge badgeContent={4} color="error">
      <NotificationsOutlined />
    </Badge>
  );
}

export default NotificationButton;
