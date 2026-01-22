

export default function AuthLayout({
  visual,
  form,
}: {
  visual: React.ReactNode;
  form: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side – Branding / Visual */}
      <section className="hidden lg:flex items-center justify-center bg-zinc-900 text-white">
        {visual}
      </section>

      {/* Right side – Auth Form */}
      <section className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">{form}</div>
      </section>
    </div>
  );
}
