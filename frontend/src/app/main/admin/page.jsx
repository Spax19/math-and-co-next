"use client";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
function Page() {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/");
  }, [user]);

  return <h1>Only logged in users can view this page</h1>;
}

export default Page;
