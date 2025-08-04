import type { CSSObject, Breakpoint } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { merge } from "es-toolkit";

import Box from "@mui/material/Box";

import { Logo } from "../components/logo";

import { MainSection } from "./core/main-section";
import { LayoutSection } from "./core/layout-section";
import { HeaderSection } from "./core/header-section";

import type { MainSectionProps } from "./core/main-section";
import type { HeaderSectionProps } from "./core/header-section";
import type { LayoutSectionProps } from "./core/layout-section";

import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, "sx" | "children" | "cssVars">;

export type LayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export default function Layout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps["slotProps"] = {
      container: { maxWidth: false },
    };

    const headerSlots: HeaderSectionProps["slots"] = {
      leftArea: <Logo isSingle={isMobile} />,
      rightArea: (
        <Box
          sx={{
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {/** @slot Help link */}
          <Typography
            variant="subtitle2"
            component="div"
            color="inherit"
          >
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }).format(new Date())}
          </Typography>
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
        sx={[
          { position: { [layoutQuery]: "fixed" } },
          ...(Array.isArray(slotProps?.header?.sx)
            ? slotProps?.header?.sx ?? []
            : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          p: theme.spacing(5, 2, 5, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            p: theme.spacing(12, 0, 10, 0),
          },
        }),
        ...(Array.isArray(slotProps?.main?.sx)
          ? slotProps?.main?.sx ?? []
          : [slotProps?.main?.sx]),
      ]}
    >
      {children}
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ "--layout-auth-content-width": "420px", ...cssVars }}
      sx={[
        () => ({
          position: "relative",
          "&::before": backgroundStyles(),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (): CSSObject => ({
  zIndex: 1,
  opacity: 0.24,
  width: "100%",
  height: "100%",
  content: "''",
  position: "absolute",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundImage: 'url("/bg/overlay.jpg")',
});
