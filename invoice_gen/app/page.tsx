import { auth } from "@clerk/nextjs/server";
import HomepageOnLogin from "@/components/HomePageNotOnLogin";
import HomepageNotOnLogin from "@/components/HomePageNotOnLogin";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    return <HomepageOnLogin />;
  }
  return <HomepageNotOnLogin />;
}