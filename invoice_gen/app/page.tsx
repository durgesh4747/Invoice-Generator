import { auth } from "@clerk/nextjs/server";
import HomepageNotOnLogin from "@/components/NotOnLoginComponents/HomePageNotOnLogin";
import HomepageOnLogin from "@/components/OnLoginComponents/HomePageOnLogin";

export default async function Home() {
  const { userId } = await auth();
  return userId ? <HomepageOnLogin /> : <HomepageNotOnLogin />;
}
