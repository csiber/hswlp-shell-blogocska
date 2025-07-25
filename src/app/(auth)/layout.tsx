import NavFooterLayout from "@/layouts/NavFooterLayout";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <NavFooterLayout renderFooter={false}>{children}</NavFooterLayout>
    </>
  );
}
