import { scrapeNaverData } from "../scraper";

interface RestaurantData {
  logo: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  result: any; // Update with the actual type
  socialLinks: string[];
  menu: any[]; // Update with the actual type
}

export async function scrapeAndStoreProduct(restaurantUrl: string) {
  if (!restaurantUrl) return;

  try {
    // connectDB();

    const existingData: RestaurantData[] = JSON.parse(
      localStorage.getItem("storedData") || "[]"
    );

    const scrapeData = await scrapeNaverData(restaurantUrl);

    const isExistingData = existingData.find(
      (data) => data.phone.trim() === scrapeData.phone.trim()
    );

    if (!isExistingData) {
      // Add new data to the array
      existingData.push(scrapeData);

      // Save the updated array back to local storage
      localStorage.setItem("storedData", JSON.stringify(existingData));
    } else {
      console.log(`Data for ${scrapeData.name} already exists. Not saving.`);
    }

    // const existingProduct = await Product.findOne({ url: scrapeData.url });

    // if (existingProduct) {
    //   const updatedPriceHistory: any = [
    //     ...existingProduct.priceHistory,

    //   ];

    //   product = {

    //   };
    // }

    // const newProduct = await Product.findOneAndUpdate(

    // );

    // revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

// export async function getProductById(productId: string) {
//   try {
//     connectDB();

//     const product = await Product.findOne({ _id: productId });

//     if (!product) return null;

//     return product;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getAllProducts() {
//   try {
//     connectDB();
//     const products = await Product.find();

//     return products;
//   } catch (error: any) {
//     console.log(error.message);
//   }
// }

// export async function getSimilarProducts(productId: string) {
//   try {
//     connectDB();

//     const currentProduct = await Product.findById(productId);

//     if (!currentProduct) return null;

//     const similarProducts = await Product.find({
//       _id: { $ne: productId },
//     }).limit(3);

//     return similarProducts;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function addUserEmailToProduct(
//   productId: string,
//   userEmail: string
// ) {
//   try {
//     const product = await Product.findById(productId);

//     if (!product) return;

//     const userExists = product.users.some(
//       (user: User) => user.email === userEmail
//     );

//     if (!userExists) {
//       product.users.push({ email: userEmail });

//       await product.save();

//       const emailContent = await generateEmailBody(product, "WELCOME");

//       await sendEmail(emailContent, [userEmail]);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// utils/fetchLocalData.ts
const fetchLocalData = async (phone: any) => {
  const storedData: RestaurantData[] = await JSON.parse(
    localStorage.getItem("storedData") || "[]"
  );
  return storedData.find((data) => data.phone === phone) || null;
};

export default fetchLocalData;
