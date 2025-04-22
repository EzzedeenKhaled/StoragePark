import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "CELINE LOOSE HOODIE",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8aG9vZGllfHx8fHx8MTcwOTQxMzk3OQ&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: 2,
    name: "Adicolor Classics Trefoil",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8aG9vZGllfHx8fHx8MTcwOTQxNDAwOQ&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: 3,
    name: "Green Park Missouri Urban",
    price: 38.99,
    image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8aG9vZGllfHx8fHx8MTcwOTQxNDAzMQ&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: 4,
    name: "Sacred Heart Sweatshirt",
    price: 48.19,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8aG9vZGllfHx8fHx8MTcwOTQxNDA1MQ&ixlib=rb-4.0.3&q=80&w=1080",
  },
];

const RelatedProducts = () => {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">Related Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-orange-500">
                  {product.name}
                </h3>
                <p className="text-gray-600">{product.price.toFixed(2)} $</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;