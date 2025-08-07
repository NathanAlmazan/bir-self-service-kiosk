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
        )}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.52)})`,
      }}
      onClick={(event) => handleClick(event, title)}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{title}</Typography>

        <Box sx={{ width: 84, height: 84 }}>
          <img alt={title} src={image} />
        </Box>
      </Box>

      <SvgColor
        src="/bg/shape-square.svg"
        sx={{
          top: 0,
          right: -36,
          width: 512,
          zIndex: -1,
          height: 512,
          opacity: 0.5,
          position: "absolute",
          color: `${color}.main`,
          transform: "scaleX(-1)",
        }}
      />
    </Card>
  );
}
