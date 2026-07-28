#ifndef PRODUCT_H
#define PRODUCT_H

#include <string>
#include <set>


class Product{
private:
    std::string productId;
public:
    explicit Product(const std::string& id);
    const std::string& getId() const;
};

#endif