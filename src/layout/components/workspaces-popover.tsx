import type { ButtonBaseProps } from "@mui/material/ButtonBase";

import { useState, useCallback, useEffect } from "react";
import { varAlpha } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import ButtonBase from "@mui/material/ButtonBase";
import MenuItem, { menuItemClasses } from "@mui/material/MenuItem";

import { offices } from "src/pages/auth/offices";
import { Label } from "src/components/label";
import { UserRole } from "src/store/types";
import { updateOffice } from "src/store/slices/userSlice";
import { useAppSelector, useAppDispatch } from "src/store/hooks";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";

export type Workspace = {
  name: string;
  label: string;
};

export function WorkspacesPopover({ sx, ...other }: ButtonBaseProps) {
  const dispatch = useAppDispatch();
  const { office, role } = useAppSelector((state) => state.user);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(
    null
  );
  const [account, setAccount] = useState<Workspace>({
    name: "",
    label: "",
  });

  useEffect(() => {
    const selected = offices.find((o) => o.name === office);
    if (selected) {
      setAccount({
        name: selected.name,
        label: selected.name.includes("RDO") ? "RDO" : "",
      });
    }
  }, [office]);

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpenPopover(event.currentTarget);
    },
    []
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (newValue: string) => {
      dispatch(updateOffice(newValue));
      handleClosePopover();
    },
    [dispatch, handleClosePopover]
  );

  return (
    <>
      <ButtonBase
        disableRipple
        disabled={role !== UserRole.ADMIN}
        onClick={handleOpenPopover}
        sx={{
          pl: 2,
          py: 3,
          gap: 1.5,
          pr: 1.5,
          width: 1,
          borderRadius: 1.5,
          textAlign: "left",
          justifyContent: "flex-start",
          bgcolor: (theme) =>
            varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
          ...sx,
        }}
        {...other}
      >
        <AccountCircleIcon />

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            typography: "body2",
            fontWeight: "fontWeightSemiBold",
          }}
        >
          {account.name}

          {account.label && <Label color="info">{account.label}</Label>}
        </Box>

        {role === UserRole.ADMIN && (
          <SwapVertOutlinedIcon sx={{ color: "text.disabled" }} />
        )}
      </ButtonBase>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 260,
            display: "flex",
            flexDirection: "column",
            [`& .${menuItemClasses.root}`]: {
              p: 1.5,
              gap: 1.5,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: "action.selected",
                fontWeight: "fontWeightSemiBold",
              },
            },
          }}
        >
          {offices.map((item) => (
            <MenuItem
              key={item.name}
              selected={item.name === account.name}
              onClick={() => handleChangeWorkspace(item.name)}
            >
              <AccountCircleIcon />

              <Box component="span" sx={{ flexGrow: 1 }}>
                {item.name}
              </Box>

              {item.name.includes("RDO") && <Label color="info">RDO</Label>}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
