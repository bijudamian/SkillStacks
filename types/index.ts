export interface IProduct {
  _id?: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  whatYouLearn: string[];
  tools: string[];
  mistakesToAvoid: string[];
  price: number;
  currency: "usd" | "inr";
  pdfUrl: string;
  coverImage: string;
  contentSnippet?: string;
  category: "investing" | "fitness" | "productivity" | "youtube";
  featured: boolean;
  createdAt?: Date;
}
