import { ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "src/firebase";
import { useRouter } from "src/routes/hooks";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { setUser, clearUser } from "src/store/slices/userSlice";
import { UserRole } from "src/store/types";

import Fallback from "src/components/fallback";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const email = user.email || "";

        // Determine role based on email
        let userRole = UserRole.OFFICER;
        if (email.includes("admin")) {
          userRole = UserRole.ADMIN;
        }

        dispatch(
          setUser({
            office: email,
            role: userRole,
          })
        );
      } else {
        // User is signed out
        dispatch(clearUser());
        router.push("/dashboard/signin");
      }
    });

    return () => unsubscribe();
  }, [router, dispatch]);

  if (!isAuthenticated) {
    return <Fallback />;
  }

  return <>{children}</>;
}
