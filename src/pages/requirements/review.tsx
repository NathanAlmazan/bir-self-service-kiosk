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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          <Typography variant="h6" sx={{ pt: 2 }}>1</Typography>
        </IconButton>
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
          <Typography variant="h6" sx={{ pt: 2 }}>2</Typography>
        </IconButton>
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
          <Typography variant="h6" sx={{ pt: 2 }}>3</Typography>
        </IconButton>
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
          <Typography variant="h6" sx={{ pt: 2 }}>4</Typography>
        </IconButton>
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
          <Typography variant="h6" sx={{ pt: 2 }}>5</Typography>
        </IconButton>
      </Box>
    </Stack>
  );
}
