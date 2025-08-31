import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

type ReviewFormProps = {
  handleSubmitRating: (rating: number) => void;
};

export default function KioskReviewForm({
  handleSubmitRating,
}: ReviewFormProps) {
  return (
    <Stack
      direction="column"
      spacing={5}
      justifyContent="center"
      alignItems="center"
    >
      <Box>
        <Typography variant="h4" align="center">
          {"Thank you for using the BIR Self-Service Kiosk!"}
        </Typography>
        <Typography variant="h6" align="center">
          {
            "We'd love to hear your feedback — please take a moment to rate your experience."
          }
        </Typography>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">1</Typography>

          <IconButton
            onClick={() => handleSubmitRating(1)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
            }}
          >
            <img alt="very-bad" src="/emoji/very-bad.svg" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{"Lubos na 'Di Nasiyahan"}</Typography>
            <Typography variant="body2">{"(Very Dissatisfied)"}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">2</Typography>

          <IconButton
            onClick={() => handleSubmitRating(2)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
            }}
          >
            <img alt="bad" src="/emoji/bad.svg" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{"'Di Nasiyahan"}</Typography>
            <Typography variant="body2">{"(Dissatisfied)"}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">3</Typography>

          <IconButton
            onClick={() => handleSubmitRating(3)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
            }}
          >
            <img alt="satisfactory" src="/emoji/satisfactory.svg" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{"'Di Makapagdesisyon"}</Typography>
            <Typography variant="body2">{"(Neither Satisfied"}</Typography>
            <Typography variant="body2">{"nor Dissatisfied)"}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">4</Typography>

          <IconButton
            onClick={() => handleSubmitRating(4)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
            }}
          >
            <img alt="good" src="/emoji/good.svg" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{"Nasiyahan"}</Typography>
            <Typography variant="body2">{"(Satisfied)"}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">5</Typography>

          <IconButton
            onClick={() => handleSubmitRating(5)}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
            }}
          >
            <img alt="very-good" src="/emoji/very-good.svg" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{"Lubos na Nasiyahan"}</Typography>
            <Typography variant="body2">{"(Very Satisfied)"}</Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
