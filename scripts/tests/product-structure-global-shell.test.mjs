import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const appShellPath = new URL("../../components/app-shell.tsx", import.meta.url);
const siteHeaderPath = new URL("../../components/site-header.tsx", import.meta.url);
const uiAlertPath = new URL("../../components/ui/alert.tsx", import.meta.url);
const uiAvatarPath = new URL("../../components/ui/avatar.tsx", import.meta.url);
const uiBreadcrumbPath = new URL("../../components/ui/breadcrumb.tsx", import.meta.url);
const uiCollapsiblePath = new URL("../../components/ui/collapsible.tsx", import.meta.url);
const uiDialogPath = new URL("../../components/ui/dialog.tsx", import.meta.url);

async function collectSourceFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(entry.name, directoryUrl);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(new URL(`${entry.name}/`, directoryUrl)));
      continue;
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const entryStat = await stat(entryUrl);
      if (entryStat.isFile()) {
        files.push(entryUrl);
      }
    }
  }

  return files;
}

test("sidebar expands all groups by default and inherits master data detail state", async () => {
  const source = await readFile(appSidebarPath, "utf8");

  assert.equal(
    source.includes("new Set(nav.map((group) => group.title))"),
    true,
    "sidebar should default all nav groups to expanded",
  );
  assert.match(
    source,
    /title: "职场",\s+href: "\/master-data\/sites",\s+activeMatch: "prefix"/,
    "workplace detail routes should inherit the workplace nav item",
  );
  assert.match(
    source,
    /title: "供应商",\s+href: "\/master-data\/vendors",\s+activeMatch: "prefix"/,
    "vendor detail routes should inherit the vendor nav item",
  );
});

test("global shell uses shadcn sidebar and header breadcrumb primitives", async () => {
  await access(uiAlertPath);
  await access(uiAvatarPath);
  await access(uiBreadcrumbPath);
  await access(uiCollapsiblePath);
  await access(uiDialogPath);

  const shellSource = await readFile(appShellPath, "utf8");
  const sidebarSource = await readFile(appSidebarPath, "utf8");
  const headerSource = await readFile(siteHeaderPath, "utf8");

  assert.equal(shellSource.includes("SidebarProvider"), true);
  assert.equal(shellSource.includes("SidebarInset"), true);
  assert.equal(shellSource.includes("sidebarCollapsed"), false);
  assert.equal(sidebarSource.includes("@/components/ui/sidebar"), true);
  assert.equal(sidebarSource.includes("@/components/ui/collapsible"), true);
  assert.equal(sidebarSource.includes("<Sidebar"), true);
  assert.equal(sidebarSource.includes("CollapsibleTrigger"), true);
  assert.equal(sidebarSource.includes("CollapsibleContent"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSub"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSubButton"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSubItem"), true);
  assert.equal(sidebarSource.includes("<aside"), false);
  assert.equal(sidebarSource.includes("collapsed"), false);
  assert.equal(sidebarSource.includes("SidebarGroupLabel asChild"), false);
  assert.equal(sidebarSource.includes('className="pl-7"'), false);
  assert.equal(headerSource.includes("SidebarTrigger"), true);
  assert.equal(headerSource.includes("Breadcrumb"), true);
  assert.equal(headerSource.includes("breadcrumbItems"), true);
  assert.equal(headerSource.includes("parentBreadcrumbItems"), false);
  assert.equal(headerSource.includes("breadcrumbItems.slice(0, -1)"), false);
  assert.equal(headerSource.includes('className="sr-only"'), true);
  assert.equal(headerSource.includes('className="truncate text-base font-medium"'), false);
  assert.equal(headerSource.includes("actions"), true);
  assert.equal(headerSource.includes("Search"), false);
  assert.equal(headerSource.includes("CalendarRange"), false);
  assert.equal(headerSource.includes("Bell"), false);
  assert.equal(headerSource.includes("ThemeToggle"), false);
  assert.equal(sidebarSource.includes("SidebarFooter"), true);
  assert.equal(sidebarSource.includes("@/components/ui/avatar"), true);
  assert.equal(sidebarSource.includes("AvatarImage"), true);
  assert.equal(sidebarSource.includes("/shadcn-avatar.jpg"), true);
  assert.equal(sidebarSource.includes("<AvatarFallback"), true);
  assert.equal(sidebarSource.includes("DropdownMenu"), true);
  assert.equal(sidebarSource.includes("切换为"), true);
  assert.equal(sidebarSource.includes("退出登录"), true);
});

test("global header shell does not retain the removed search placeholder API", async () => {
  const shellSource = await readFile(appShellPath, "utf8");
  const headerSource = await readFile(siteHeaderPath, "utf8");
  const pageSources = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];

  assert.equal(shellSource.includes("searchPlaceholder"), false, "AppShell API");
  assert.equal(headerSource.includes("searchPlaceholder"), false, "SiteHeader API");

  for (const fileUrl of pageSources) {
    const source = await readFile(fileUrl, "utf8");

    assert.equal(source.includes("searchPlaceholder"), false, fileUrl.pathname);
  }
});
