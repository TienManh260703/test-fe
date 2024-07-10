import { get, post, patch, put, del } from '../utils/request'

export const getPageKH = async (page, size) => {
  try {
    const result = await get(`khach-hang?pageNo=0&pageSize=1000`)
    return result
  } catch (error) {
    console.error('Error fetching khach-hang:', error)
    throw error
  }
}
