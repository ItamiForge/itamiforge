export default function AiErpPage() {
  return (
    <div className="main-page-content space-y-8 pb-10">
      <section className="card">
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          AIML ERP for modern brewing operations
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-7">
          This is the initial landing skeleton for the full ERP product. The
          core app is being built in a separate repository. This page will
          evolve into the full marketing and product documentation surface.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h2 className="text-2xl font-semibold">Execution engine</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Live SOP workflows, operator prompts, and validated run logs.
          </p>
        </article>
        <article className="card">
          <h2 className="text-2xl font-semibold">Ops command center</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Single-pane visibility for production, QA, and packaging status.
          </p>
        </article>
      </section>
    </div>
  );
}
