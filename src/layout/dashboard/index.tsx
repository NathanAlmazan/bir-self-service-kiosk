import { useState, useEffect } from "react";

import type { Breakpoint } from "@mui/material/styles";

import { merge } from "es-toolkit";
import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";

import { NavMobile, NavDesktop } from "./nav";
import { layoutClasses } from "../core/classes";
import { dashboardLayoutVars } from "./css-vars";
import { MainSection } from "../core/main-section";
import { MenuButton } from "../components/menu-button";
import { HeaderSection } from "../core/header-section";
import { LayoutSection } from "../core/layout-section";
import { NotificationsPopover } from "../components/notifications-popover";
import { Label } from "src/components/label";

import { signOut } from "src/firebase";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { clearUser } from "src/store/slices/userSlice";

import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import CandlestickChartOutlinedIcon from "@mui/icons-material/CandlestickChartOutlined";

import { UserRole } from "src/store/types";
import type { MainSectionProps } from "../core/main-section";
import type { HeaderSectionProps } from "../core/header-section";
import type { LayoutSectionProps } from "../core/layout-section";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, "sx" | "children" | "cssVars">;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  roles: UserRole[];
};

export default function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "lg",
}: DashboardLayoutProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { role } = useAppSelector((state) => state.user);

  const [navigations, setNavigations] = useState<NavItem[]>([]);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  useEffect(() => {
    setNavigations([
      {
        title: "Dashboard",
        path: "/dashboard/home",
        icon: <CandlestickChartOutlinedIcon />,
        roles: [UserRole.ADMIN, UserRole.OFFICER],
      },
      {
        title: "Queue",
        path: "/dashboard/queue",
        icon: <HorizontalSplitOutlinedIcon />,
        info: (
          <Label color="info" variant="inverted">
            {"+3 New"}
          </Label>
        ),
        roles: [UserRole.OFFICER],
      },
      {
        title: "History",
        path: "/dashboard/history",
        icon: <HorizontalSplitOutlinedIcon />,
        roles: [UserRole.ADMIN, UserRole.OFFICER],
      },
      {
        title: "Charter",
        path: "/dashboard/charter",
        icon: <ClassOutlinedIcon />,
        roles: [UserRole.ADMIN],
      },
    ]);
  }, []);

  const renderHeader = () => {
    const renderSignOut = async () => {
      await signOut();
      dispatch(clearUser());
    };

    const headerSlotProps: HeaderSectionProps["slotProps"] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps["slots"] = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: "none" },
            }}
          />
          <NavMobile
            data={navigations.filter(
              (item) => role && item.roles.includes(role)
            )}
            open={open}
            onClose={onClose}
          />
        </>
      ),
      rightArea: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, sm: 0.75 },
          }}
        >
          {/** @slot Notifications popover */}
          <NotificationsPopover data={[]} />

          <Tooltip title="Sign Out">
            <IconButton onClick={renderSignOut}>
              <LogoutRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop
          data={navigations.filter((item) => role && item.roles.includes(role))}
          layoutQuery={layoutQuery}
        />
      }
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: "var(--layout-nav-vertical-width)",
              transition: theme.transitions.create(["padding-left"], {
                easing: "var(--layout-transition-easing)",
                duration: "var(--layout-transition-duration)",
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
