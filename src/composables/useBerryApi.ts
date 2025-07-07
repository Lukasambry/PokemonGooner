import { ref, type Ref } from 'vue'
import axios, { type AxiosError } from 'axios'
import { useLanguageStore } from '@/stores/languageStore'

export interface BerryListItem {
  name: string;
  url: string;
}

export interface BerryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BerryListItem[];
}

export interface BerryFlavor {
  flavor: {
    name: string;
    url: string;
  };
  potency: number;
}

export interface BerryDetail {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: {
    name: string;
    url: string;
  };
  flavors: BerryFlavor[];
  item: {
    name: string;
    url: string;
  };
  natural_gift_type: {
    name: string;
    url: string;
  };
}

export interface ItemDetail {
  id: number;
  name: string;
  sprites: {
    default: string;
  };
  names: Array<{
    language: {
      name: string;
      url: string;
    };
    name: string;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
  }>;
}

export function useBerryApi() {
  const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';

  const berries: Ref<BerryListItem[]> = ref([]);
  const berryDetail: Ref<BerryDetail | null> = ref(null);
  const itemDetail: Ref<ItemDetail | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const nextPageUrl: Ref<string | null> = ref(null);

  async function fetchBerries(url?: string): Promise<void> {
    loading.value = true;
    error.value = null;
    const fetchUrl = url || `${POKEAPI_BASE_URL}berry?limit=20&offset=0`;

    try {
      const response = await axios.get<BerryListResponse>(fetchUrl);
      if (url) {
        berries.value.push(...response.data.results);
      } else {
        berries.value = response.data.results;
      }
      nextPageUrl.value = response.data.next;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error("Erreur lors de la récupération des baies:", axiosError);
      error.value = `Impossible de charger la liste des baies. (${axiosError.message})`;
      berries.value = [];
      nextPageUrl.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchBerryDetail(idOrName: string | number): Promise<void> {
    loading.value = true;
    error.value = null;
    berryDetail.value = null;
    itemDetail.value = null;

    try {
      const response = await axios.get<BerryDetail>(`${POKEAPI_BASE_URL}berry/${String(idOrName).toLowerCase()}`);
      berryDetail.value = response.data;

      if (response.data.item) {
        const itemResponse = await axios.get<ItemDetail>(response.data.item.url);
        itemDetail.value = itemResponse.data;
      }
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error(`Erreur lors de la récupération de la baie ${idOrName}:`, axiosError);
      if (axiosError.response && axiosError.response.status === 404) {
        error.value = `Baie "${idOrName}" non trouvée.`;
      } else {
        error.value = `Impossible de charger les détails de la baie. (${axiosError.message})`;
      }
      berryDetail.value = null;
      itemDetail.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function searchBerryByName(name: string): Promise<{berry: BerryDetail | null, item: ItemDetail | null}> {
    if (!name.trim()) return {berry: null, item: null};
    loading.value = true;
    error.value = null;
    try {
      const berryResponse = await axios.get<BerryDetail>(`${POKEAPI_BASE_URL}berry/${name.toLowerCase()}`);

      let itemResponse = null;
      if (berryResponse.data.item) {
        itemResponse = await axios.get<ItemDetail>(berryResponse.data.item.url);
      }

      return {
        berry: berryResponse.data,
        item: itemResponse?.data || null
      };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error(`Erreur de recherche pour ${name}:`, axiosError);
      if (axiosError.response && axiosError.response.status === 404) {
        error.value = `Baie "${name}" non trouvée.`;
      } else {
        error.value = `Erreur lors de la recherche. (${axiosError.message})`;
      }
      return {berry: null, item: null};
    } finally {
      loading.value = false;
    }
  }

  function extractBerryId(url: string): number {
    const parts = url.split('/').filter(part => part);
    return parseInt(parts[parts.length - 1]);
  }

  return {
    berries,
    berryDetail,
    itemDetail,
    loading,
    error,
    nextPageUrl,
    fetchBerries,
    fetchBerryDetail,
    searchBerryByName,
    extractBerryId
  }
}


export async function getTranslatedBerryName(name: string): Promise<string> {
  const languageStore = useLanguageStore();
  const lang = languageStore.currentLanguage;

  try {
    const berryResponse = await axios.get(`https://pokeapi.co/api/v2/berry/${name.toLowerCase()}/`);
    if (!berryResponse.data.item || !berryResponse.data.item.url) {
      return name;
    }

    const itemResponse = await axios.get(berryResponse.data.item.url);

    const names = itemResponse.data.names;
    const translated = names.find((n: { language: { name: string } }) => n.language.name === lang);

    return translated ? translated.name : name;
  } catch (error) {
    console.error("Erreur lors de la récupération du nom traduit de la baie:", error);
    return name;
  }
}
