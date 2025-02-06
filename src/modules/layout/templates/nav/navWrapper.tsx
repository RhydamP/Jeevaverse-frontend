import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import Nav from "./index"
import { StoreProductCategory, StoreRegion } from "@medusajs/types"

const NavWrapper = async() => {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const productCategories = await listCategories().then(
    (categories: StoreProductCategory[]) => categories
  );
  return <Nav regions={regions} productCategories={productCategories} />
}

export default NavWrapper;
