import { useAppState } from '@/contexts/AppStateContext';
import { LocalFoodPage } from '@/features/food/LocalFoodPage';
import { TravelerFoodPage } from '@/features/food/TravelerFoodPage';

export function FoodPage() {
  const { experienceMode } = useAppState();

  if (experienceMode === 'traveler') {
    return <TravelerFoodPage />;
  }

  return <LocalFoodPage />;
}
