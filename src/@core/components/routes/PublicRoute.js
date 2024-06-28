// ** React Imports
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData();

    const restrictedRoute = route.meta && !route.meta.restricted;

    console.log("hey");
    if (user && restrictedRoute) {
      console.log("Coming here");
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />;
    }
  }
  console.log("kdfj");
  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;