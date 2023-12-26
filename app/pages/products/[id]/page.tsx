import Image from "next/image";
import Link from "next/link";

const ProductDetails = async (data: any) => {
  const { logo, name, category, address, phone, socialLinks, menu } = data;

  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center justify-center">
        <div className="mr-8">
          <Image src={logo} alt={`${name} Logo`} width={200} height={200} />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{name}</h1>
          <p className="text-lg">{category}</p>
          <p className="text-gray-600">{address}</p>
          <p className="text-gray-600">{phone}</p>
          <div className="mt-4">
            {socialLinks?.map((link: URL, index: number) => (
              <Link key={index} href={link}>
                <a
                  className="mr-4 text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`Social Link ${index + 1}`}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu?.map((item: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={320}
                height={320}
              />
              <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
              <p className="text-gray-600">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
