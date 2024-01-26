import { ref } from 'vue'
import { getMenuTypes } from '@/api/menu'

const menuTypes = ref<{ label: string; value: number }[]>([])
export const useMenuTypes = (immediate = true) => {
  const fetchMenuTypes = async () => {
    const { data } = await getMenuTypes()
    menuTypes.value = data.map((item) => ({
      label: item.name,
      value: item.id
    }))

    return menuTypes.value
  }

  if (immediate) {
    fetchMenuTypes()
  }

  return {
    menuTypes,
    fetchMenuTypes
  }
}
