"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { capitalizeFirstLetter } from "@/components/helper";

export type PageActionItem = {
  text: string;
  onClick: (event: MouseEvent<HTMLLIElement>) => void;
  startIcon?: ReactNode;
  disabled?: boolean;
};

export type PageStatusVariant = "success" | "error" | "secondary" | "info" | "default";

export type PageHeaderContextType = {
  pageTitle: string;
  breadcrumbPath: string[];
  pageStatus: string | null;
  pageStatusVariant: PageStatusVariant;
  pageActions: PageActionItem[];
  pageHeaderLoading: boolean;
  setPageHeader: (title: string, breadcrumb: string[]) => void;
  setPageStatus: (status: string | null, variant?: PageStatusVariant) => void;
  setPageActions: (items: PageActionItem[]) => void;
  setHeaderReady: (ready: boolean) => void;
};

const defaultContext: PageHeaderContextType = {
  pageTitle: "",
  breadcrumbPath: [],
  pageStatus: null,
  pageStatusVariant: "default",
  pageActions: [],
  pageHeaderLoading: true,
  setPageHeader: () => {},
  setPageStatus: () => {},
  setPageActions: () => {},
  setHeaderReady: () => {},
};

export const PageHeaderContext = createContext<PageHeaderContextType>(defaultContext);

/** Generic fallback derived from pathname - no hardcoded routes */
const getFallbackFromPathname = (pathname: string): { title: string; breadcrumb: string[] } => {
  const segments = pathname.split("/").filter(Boolean);
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const breadcrumb = segments.flatMap((s, i) => (i > 0 ? [">", s] : [s]));
  const titleSource = [...segments].reverse().find((s) => !uuidRegex.test(s) && !/^\d+$/.test(s)) ?? segments.at(-1) ?? "";
  return { title: capitalizeFirstLetter(titleSource), breadcrumb };
};

export const PageHeaderProvider = ({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) => {
  const [override, setOverride] = useState<{ title: string; breadcrumb: string[] } | null>(null);
  const [pageStatus, setPageStatusState] = useState<string | null>(null);
  const [pageStatusVariant, setPageStatusVariantState] = useState<PageStatusVariant>("default");
  const [pageActions, setPageActionsState] = useState<PageActionItem[]>([]);
  const [pageHeaderLoading, setPageHeaderLoading] = useState(true);

  const fallback = useMemo(() => getFallbackFromPathname(pathname), [pathname]);

  useLayoutEffect(() => {
    setOverride(null);
    setPageStatusState(null);
    setPageStatusVariantState("default");
    setPageActionsState([]);
    setPageHeaderLoading(true);
  }, [pathname]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPageHeaderLoading((prev) => (prev ? false : prev));
    }, 3000);
    return () => clearTimeout(id);
  }, [pathname]);

  const setPageHeader = useCallback((title: string, breadcrumb: string[]) => {
    setOverride({ title, breadcrumb });
  }, []);

  const setHeaderReady = useCallback((ready: boolean) => {
    if (ready) setPageHeaderLoading(false);
  }, []);

  const setPageStatus = useCallback((status: string | null, variant: PageStatusVariant = "default") => {
    setPageStatusState(status);
    setPageStatusVariantState(status ? variant : "default");
  }, []);

  const setPageActions = useCallback((items: PageActionItem[]) => {
    setPageActionsState(items);
  }, []);

  const pageTitle = override?.title ?? fallback.title;
  const breadcrumbPath = override?.breadcrumb ?? fallback.breadcrumb;

  const value = useMemo(
    () => ({ pageTitle, breadcrumbPath, pageStatus, pageStatusVariant, pageActions, pageHeaderLoading, setPageHeader, setPageStatus, setPageActions, setHeaderReady }),
    [pageTitle, breadcrumbPath, pageStatus, pageStatusVariant, pageActions, pageHeaderLoading, setPageHeader, setPageStatus, setPageActions, setHeaderReady]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeader = (): PageHeaderContextType => useContext(PageHeaderContext);

/**
 * Declarative hook - page provides header, status, actions. Clears only on unmount.
 * All header config lives in the page; no need to maintain route map in PageHeaderContext.
 */
export function usePageHeaderOptions(
  title: string,
  breadcrumb: string[],
  options?: { status?: string | null; statusVariant?: PageStatusVariant; actions?: PageActionItem[]; ready?: boolean }
): void {
  const { setPageHeader, setPageStatus, setPageActions, setHeaderReady } = usePageHeader();
  const { status, statusVariant = "default", actions, ready } = options ?? {};

  useLayoutEffect(() => {
    setPageHeader(title, breadcrumb);
    setPageStatus(status ?? null, statusVariant);
    setPageActions(actions ?? []);
    setHeaderReady(ready ?? true);
  }, [title, breadcrumb, status, statusVariant, actions, ready, setPageHeader, setPageStatus, setPageActions, setHeaderReady]);

  useEffect(() => () => {
    setPageHeader("", []);
    setPageStatus(null);
    setPageActions([]);
  }, [setPageHeader, setPageStatus, setPageActions]);
}
