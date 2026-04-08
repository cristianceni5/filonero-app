import { Redirect } from "expo-router";
import { useAuthSession } from "@/src/hooks/useAuthSession";

export default function Index() {
  const { isHydrating, isAuthenticated } = useAuthSession();

  if (isHydrating) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/(private)/(tabs)/messages" : "/(auth)/admin"} />;
}
