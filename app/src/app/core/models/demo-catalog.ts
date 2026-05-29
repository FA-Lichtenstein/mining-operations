export type DemoStatus = 'live' | 'comingSoon';
export type PresentationMode = 'workbench' | 'notebook';

export interface DemoCatalogEntry {
  id: string;
  title: string;
  description: string;
  themeTags: string[];
  presentationMode: PresentationMode;
  route: string;
  status: DemoStatus;
}
