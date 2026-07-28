#include "Product.h"

Product::Product(const std::string& id) : productId(id) {}

const std::string& Product::getId() const{
    return productId;
}