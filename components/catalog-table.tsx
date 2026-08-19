import type { CatalogExcluded, CatalogProject } from "@/lib/catalog/schema";
import { PROJECTS, excludedRepos, publicProjects } from "@/lib/projects";

const reasonLabel: Record<CatalogExcluded["reason"], string> = {
  denylist: "hub denylist",
  fork: "fork",
  invalid_contract: "invalid contract",
  opted_out: "repo opted out",
  no_contract: "no contract",
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toISOString().slice(0, 10);
}

function RepoLink({ project }: { project: CatalogProject }) {
  if (!project.github) {
    return <span>{project.repo}</span>;
  }

  return (
    <a href={project.github} rel="noreferrer" target="_blank">
      {project.repo}
    </a>
  );
}

export function CatalogTable() {
  const listed = PROJECTS;
  const publicCount = publicProjects.length;

  return (
    <div className="catalog">
      <p className="catalog__lede">
        {listed.length} listed · {publicCount} public · {listed.length - publicCount} stub
      </p>

      <div className="catalog-table-wrap">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Category</th>
              <th>Visibility</th>
              <th>Language</th>
              <th>Source</th>
              <th>Pushed</th>
            </tr>
          </thead>
          <tbody>
            {listed.map((project) => (
              <tr id={project.slug} key={project.slug}>
                <td>
                  <div className="catalog-table__title">{project.title}</div>
                  <p className="catalog-table__summary">{project.summary}</p>
                  {project.live ? (
                    <a href={project.live} rel="noreferrer" target="_blank">
                      live
                    </a>
                  ) : null}
                </td>
                <td>{project.status}</td>
                <td>{project.category}</td>
                <td>{project.public ? "public" : "stub"}</td>
                <td>{project.language ?? "—"}</td>
                <td>
                  <RepoLink project={project} />
                  <div className="catalog-table__reason">{project.reason}</div>
                </td>
                <td>{formatDate(project.pushedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="catalog__subhead">Seen, not listed</h2>
      <p className="catalog__lede">
        Public repos the sync discovered and skipped. Private skips are omitted.
      </p>

      <div className="catalog-table-wrap">
        <table className="catalog-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {excludedRepos.map((row) => (
              <tr key={row.repo}>
                <td>
                  <a href={`https://github.com/${row.repo}`} rel="noreferrer" target="_blank">
                    {row.repo}
                  </a>
                </td>
                <td>
                  {reasonLabel[row.reason]}
                  {row.detail ? ` — ${row.detail}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
