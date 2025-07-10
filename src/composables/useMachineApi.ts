import { ref, type Ref } from 'vue'
import axios from 'axios'

export interface MachineListItem {
  url: string;
}

export interface MachineDetail {
  id: number;
  item: {
    name: string;
    url: string;
  };
  move: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}

export function useMachineApi() {
  const machines: Ref<MachineDetail[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nextPageUrl = ref<string | null>('https://pokeapi.co/api/v2/machine/?limit=20')

  async function fetchMachines(url: string | null = nextPageUrl.value) {
    if (!url) return
    loading.value = true
    error.value = null
    try {
      const listRes = await axios.get(url)
      const requests = listRes.data.results.map((item: MachineListItem) =>
        axios.get(item.url).then(r => r.data)
      )
      const machinesData: MachineDetail[] = await Promise.all(requests)
      machines.value.push(...machinesData)
      nextPageUrl.value = listRes.data.next
    } catch (e: any) {
      error.value = e.message
    }
    loading.value = false
  }

  async function fetchMachineById(idOrUrl: string | number): Promise<MachineDetail | null> {
    try {
      const { data } = await axios.get(
        typeof idOrUrl === 'string' && idOrUrl.startsWith('http')
          ? idOrUrl
          : `https://pokeapi.co/api/v2/machine/${idOrUrl}/`
      )
      return data
    } catch {
      return null
    }
  }

  return {
    machines,
    loading,
    error,
    nextPageUrl,
    fetchMachines,
    fetchMachineById,
  }
}
