export interface NavLink {
  path: string;
  title: string;
}

export interface BlogContent {
  subTitle: string;
  [key: string]: any;
}

export interface Dictionary {
  navLink: NavLink[];
  blog: BlogContent;
  [key: string]: any;
}

export type Locale = 'en' | 'zh';

export interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export interface LayoutProps {
  children: React.ReactNode;
  modal?: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}
