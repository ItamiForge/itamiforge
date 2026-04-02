import type { Folder, Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { docsSource } from "@/lib/source";

function attachLandingPages(tree: Root): Root {
  const folderToLandingUrl = new Map<string, string>();
  const projectsPage = docsSource.getPage(["projects"]);
  const notesPage = docsSource.getPage(["notes"]);

  if (projectsPage) {
    folderToLandingUrl.set("Projects", projectsPage.url);
  }
  if (notesPage) {
    folderToLandingUrl.set("Notes", notesPage.url);
  }

  const children = tree.children.map((node) => {
    if ("folder" !== node.type) {
      return node;
    }

    const landingUrl = folderToLandingUrl.get(String(node.name));
    if (!landingUrl) {
      return node;
    }

    const folder: Folder = {
      ...node,
      index: {
        type: "page",
        name: node.name,
        url: landingUrl,
      },
    };

    return folder;
  });

  return { ...tree, children };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tree = attachLandingPages(docsSource.getPageTree());

  return (
    <DocsLayout tree={tree} {...baseOptions()} links={[]}>
      {children}
    </DocsLayout>
  );
}
