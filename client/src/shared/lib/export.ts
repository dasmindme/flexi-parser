import * as XLSX from 'xlsx'

export const exportToExcel = (data: any[], filename = 'api_response.xlsx') => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    XLSX.writeFile(wb, filename)
    return { success: true, message: 'Excel file saved successfully' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const exportToGeoJSON = (data: any[], type: 'Point' | 'Line' = 'Point') => {
  try {
    const features = data
      .map(item => {
        let lat, lon

        if (item.coordinates && Array.isArray(item.coordinates)) {
          ;[lat, lon] = item.coordinates
        } else if (item.lat !== undefined && item.lon !== undefined) {
          lat = item.lat
          lon = item.lon
        } else if (item.latitude !== undefined && item.longitude !== undefined) {
          lat = item.latitude
          lon = item.longitude
        } else if (item.geometry?.coordinates) {
          ;[lon, lat] = item.geometry.coordinates
        }

        if (lat !== undefined && lon !== undefined) {
          const properties = { ...item }
          delete properties.coordinates
          delete properties.lat
          delete properties.lon
          delete properties.latitude
          delete properties.longitude
          delete properties.geometry

          return {
            type: 'Feature',
            geometry: {
              type: type === 'Line' ? 'LineString' : 'Point',
              coordinates:
                type === 'Line'
                  ? [
                      [lon, lat],
                      [item.endLon || lon, item.endLat || lat],
                    ]
                  : [lon, lat],
            },
            properties,
          }
        }
        return null
      })
      .filter(Boolean)

    const geojson = {
      type: 'FeatureCollection',
      features,
    }

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = type === 'Line' ? 'lines.geojson' : 'data.geojson'
    a.click()
    URL.revokeObjectURL(url)

    return { success: true, features: features.length }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  const result: Record<string, any> = {}

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue

    const value = obj[key]
    const newKey = prefix ? `${prefix}_${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === 'object' && v !== null) {
          Object.assign(result, flattenObject(v, `${newKey}_${i}`))
        } else {
          result[`${newKey}_${i}`] = v
        }
      })
    } else {
      result[newKey] = value
    }
  }

  return result
}
