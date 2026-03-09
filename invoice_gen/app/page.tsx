import { auth } from "@clerk/nextjs/server";
import HomepageNotOnLogin from "@/components/NotOnLoginComponents/HomePageNotOnLogin";
import HomepageOnLogin from "@/components/OnLoginComponents/HomePageOnLogin";

type HomeProps = {
  searchParams: Promise<{ curr?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { userId } = await auth();

  return userId ? (
    <HomepageOnLogin searchParams={searchParams} />
  ) : (
    <HomepageNotOnLogin />
  );
}
