import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";
import { varAlpha } from "minimal-shared/utils";
import { SvgColor } from "../../components/svg-color";
import type { PaletteColorKey } from "../../theme/core";

type ServiceCardProps = {
  title: string;
  image: string;
  color: PaletteColorKey;
  handleClick: (
    event: React.MouseEvent<HTMLDivElement>,
    service: string
  ) => void;
};

export default function ServiceCard({
  title,
  image,
  color,
  handleClick,
}: ServiceCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        cursor: "pointer",
        boxShadow: "none",
        position: "relative",
        color: `${color}.darker`,
        backgroundColor: "common.white",
        backgroundImage: `linear-gradient(135deg, ${varAlpha(
          theme.vars.palette[color].lighterChannel,
          0.48
        )}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
      }}
      onClick={(event) => handleClick(event, title)}
    >
      <Box sx={{ width: 54, height: 54, mb: 3 }}>
        <img alt={title} src={image} />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Typography variant="h5">{title}</Typography>
        </Box>
      </Box>

      <SvgColor
        src="/bg/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: "absolute",
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
