import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserSession, USER_SESSION_EVENT } from "../api/userAuth";

export default function UserAccountLink() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getUserSession()));
  useEffect(() => {
    const update = () => setSignedIn(Boolean(getUserSession()));
    window.addEventListener(USER_SESSION_EVENT, update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener(USER_SESSION_EVENT, update); window.removeEventListener("storage", update); };
  }, []);
  return <Link className="user-account-link" to="/account"><UserRound size={16} /><span>{signedIn ? "My account" : "Sign in"}</span></Link>;
}
