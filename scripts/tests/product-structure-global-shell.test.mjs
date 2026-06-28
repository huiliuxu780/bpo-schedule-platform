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

test("sidebar follows dashboard baseline with flat workbench navigation", async () => {
  const source = await readFile(appSidebarPath, "utf8");

  assert.match(
    source,
    /const primaryNav[\s\S]+?title: "经营总览",\s+href: "\/dashboard",\s+icon: LayoutDashboard,\s+activeMatch: "exact"/,
    "dashboard should stay the first primary workbench entry",
  );
  assert.match(source, /collapsible="offcanvas"/);
  assert.match(source, /SidebarGroupLabel>主数据/);
  assert.match(source, /icon: Users/);
  assert.match(source, /icon: Network/);
  assert.match(source, /icon: MapPin/);
  assert.match(source, /icon: Handshake/);
  assert.match(source, /icon: Wrench/);
  assert.match(
    source,
    /href="\/schedule-plans\/new"/,
    "sidebar should expose a dashboard-01 style quick-create entry",
  );
  assert.equal(source.includes("CollapsibleTrigger"), false);
  assert.equal(source.includes("CollapsibleContent"), false);
  assert.equal(source.includes("SidebarMenuSub"), false);
  assert.equal(source.includes("SidebarGroupLabel>运营数据"), true);
});

test("global shell uses shadcn sidebar and header breadcrumb primitives", async () => {
  await access(uiAlertPath);
  await access(uiAvatarPath);
  await access(uiBreadcrumbPath);
  await access(uiDialogPath);

  const shellSource = await readFile(appShellPath, "utf8");
  const sidebarSource = await readFile(appSidebarPath, "utf8");
  const headerSource = await readFile(siteHeaderPath, "utf8");

  assert.equal(shellSource.includes("SidebarProvider"), true);
  assert.equal(shellSource.includes("SidebarInset"), true);
  assert.equal(shellSource.includes("sidebarCollapsed"), false);
  assert.equal(sidebarSource.includes("@/components/ui/sidebar"), true);
  assert.equal(sidebarSource.includes("<Sidebar"), true);
  assert.equal(sidebarSource.includes("CollapsibleTrigger"), false);
  assert.equal(sidebarSource.includes("CollapsibleContent"), false);
  assert.equal(sidebarSource.includes("SidebarMenuSub"), false);
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
  assert.equal(sidebarSource.includes("AvatarImage"), false);
  assert.equal(sidebarSource.includes("/shadcn-avatar.jpg"), false);
  assert.equal(sidebarSource.includes("<AvatarFallback"), true);
  assert.equal(sidebarSource.includes("DropdownMenu"), true);
  assert.equal(sidebarSource.includes("切换为"), true);
  assert.equal(sidebarSource.includes("退出登录"), false);
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
