import type { IconButtonProps } from "@mui/material/IconButton";

import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";

import { Scrollbar } from "src/components/scrollbar";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";

// ----------------------------------------------------------------------

export type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  description: string;
  avatarUrl: string | null;
  postedAt: string | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsPopover({
  data = [],
  sx,
  ...other
}: NotificationsPopoverProps) {

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <IconButton
        color={openPopover ? "primary" : "default"}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={data.length} color="error">
          <NotificationsNoneTwoToneIcon />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {`${data.length} ${
                data.length > 1 ? "notifications" : "notification"
              } need your attention.`}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {data.length > 0 ? (
          <Scrollbar
            fillContent
            sx={{ minHeight: 240, maxHeight: { xs: 360, sm: "none" } }}
          >
            <List>
              {data.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </List>
          </Scrollbar>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              No new notifications
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit">
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
}: {
  notification: NotificationItemProps;
}) {
  const { avatarUrl, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px"
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <AccessTimeOutlinedIcon />
            {notification.postedAt &&
              new Date(notification.postedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );

  if (notification.type === "order-placed") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "order-shipped") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "mail") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/icons/notification/ic-notification-mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === "chat-message") {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/icons/notification/ic-notification-chat.svg"
        />
      ),
      title,
    };
  }
  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
