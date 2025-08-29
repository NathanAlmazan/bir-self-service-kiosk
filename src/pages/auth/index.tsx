import { useState, useCallback, FormEvent } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

import { useRouter } from "src/routes/hooks";
import { signIn } from "src/firebase";
import { useAppDispatch } from "src/store/hooks";
import { setUser } from "src/store/slices/userSlice";
import { UserRole } from "src/store/types";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import AuthLayout from "src/layout/auth";

// ----------------------------------------------------------------------

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!selectedOffice) {
        setError("Please select an office");
        return;
      }

      if (!password) {
        setError("Password is required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Sign in with email (office ID) and password
        await signIn(selectedOffice, password);

        // Determine role based on email
        let role = UserRole.OFFICER;
        if (selectedOffice.includes("admin")) {
          role = UserRole.ADMIN;
        }

        // Set user data in Redux
        dispatch(
          setUser({
            office: offices.find((o) => o.id === selectedOffice)?.name || "",
            role: role,
          })
        );

        // Navigate to dashboard
        router.push("/dashboard/home");
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Invalid credentials. Please check your office and password.");
      } finally {
        setLoading(false);
      }
    },
    [selectedOffice, password, dispatch, router]
  );

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
      </Box>
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Office"
          name="office"
          fullWidth
          select
          required
          value={selectedOffice}
          onChange={(e) => setSelectedOffice(e.target.value)}
        >
          {offices.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          required
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <VisibilityRoundedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </Box>
    </AuthLayout>
  );
}

const offices = [
  {
    id: "rr6manila.admin@yopmail.com",
    name: "Administrator",
    area: "",
  },
  {
    id: "rr6manila.rdo29@yopmail.com",
    name: "RDO No. 29",
    area: "Tondo - San Nicolas",
  },
  {
    id: "rr6manila.rdo30@yopmail.com",
    name: "RDO No. 30",
    area: "Binondo",
  },
  {
    id: "rr6manila.rdo31@yopmail.com",
    name: "RDO No. 31",
    area: "Sta. Cruz",
  },
  {
    id: "rr6manila.rdo32@yopmail.com",
    name: "RDO No. 32",
    area: "Quiapo-Sampaloc-San Miguel-Sta. Mesa",
  },
  {
    id: "rr6manila.rdo33@yopmail.com",
    name: "RDO No. 33",
    area: "Ermita-Intramuros-Malate",
  },
  {
    id: "rr6manila.rdo34@yopmail.com",
    name: "RDO No. 34",
    area: "Paco-Pandacan-Sta. Ana-San Andres",
  },
  {
    id: "rr6manila.rdo36@yopmail.com",
    name: "RDO No. 36",
    area: "Puerto Princesa City, Palawan",
  },
];
