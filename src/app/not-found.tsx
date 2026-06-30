import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.4em] text-brand-orange uppercase">404</p>
      <h1 className="editorial-heading mt-4 text-5xl text-brand-white md:text-7xl">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-md text-sm text-brand-grey">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-10">
        <Button href="/" variant="primary">
          Return Home
        </Button>
      </div>
    </section>
  );
}
