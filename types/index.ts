export type PriceHistoryItem = {
  price: number;
};

export type UserType = {
  email: string;
  phoneNumber: string;
  name: string;
  password: string;
  recommendCode?: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: Boolean;
  users?: UserType[];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

export interface RestaurantCardProps {
  logo: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  socialLinks: string[];
  menu: {
    name: string;
    price: string;
    imageUrl: string;
  }[];
}
