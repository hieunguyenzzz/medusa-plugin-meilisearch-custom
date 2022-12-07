const variantKeys = [
  "sku",
  "title",
  "upc",
  "ean",
  "mid_code",
  "hs_code",
  "options",
  "metadata"
]
const prefix = `variant`

export const transformProduct = (product) => {
  const initialObj = variantKeys.reduce((obj, key) => {
    obj[`${prefix}_${key}`] = [];
    obj[`${prefix}_metadata_color`] = [];
    obj[`${prefix}_metadata_material`] = [];
    return obj
  }, {})
  initialObj[`${prefix}_options_value`] = []

  const flattenedVariantFields = product.variants.reduce((obj, variant) => {
    variantKeys.forEach((k) => {
      if (k === "options" && variant[k]) {
        const values = variant[k].map((option) => option.value)
        obj[`${prefix}_options_value`] =
          obj[`${prefix}_options_value`].concat(values)
        return
      }

      if (k === 'metadata' && variant[k] && variant[k]['color']) {
        obj[`${prefix}_metadata_color`].push(variant[k]['color'])
        return
      }
      if (k === 'metadata' && variant[k] && variant[k]['material']) {
        obj[`${prefix}_metadata_material`].push(variant[k]['material'])
        return
      }
      
      return variant[k] && obj[`${prefix}_${k}`].push(variant[k])
    })
    return obj
  }, initialObj)

  product.type_value = product.type && product.type.value
  product.collection_title = product.collection && product.collection.title
  product.collection_handle = product.collection && product.collection.handle
  product.tags_value = product.tags ? product.tags.map((t) => t.value.toLowerCase().replace(/ /g, '-')) : []

  return {
    ...product,
    ...flattenedVariantFields,
  }
}
