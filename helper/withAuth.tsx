import { WithAuthProps } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

function withAuth(Component: React.ComponentType<WithAuthProps>) {
  return function AuthenticatedComponent(props: WithAuthProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/");
      }
    }, [status, router]);

    // if (status === "loading") {
    //   return <p>Loading...</p>;
    // }

    return session ? <Component {...props} /> : null;
  };
}

export default withAuth;
