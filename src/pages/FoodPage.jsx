import { useAppState } from '@/contexts/AppStateContext';
import { LocalFoodPage } from '@/features/food/LocalFoodPage';
import { TravelerFoodPage } from '@/features/food/TravelerFoodPage';
import { getTravelerExperience } from '@/data/travelerExperiences';
import { getTravelerFood } from '@/data/travelerFoods';

/** Map legacy food ids from Home to experience ids */
const FOOD_TO_EXPERIENCE = {
  sushi: 'classic-popular',
  ramen: 'classic-popular',
  izakaya: 'izakaya-night',
  'hidden-local': 'hidden-gem',
  matcha: 'japanese-culture',
  traditional: 'japanese-culture',
  'street-food': 'market-walk',
};

function resolveTravelerInitialId(id) {
  if (!id) return null;
  if (getTravelerExperience(id)) return id;
  if (FOOD_TO_EXPERIENCE[id]) return FOOD_TO_EXPERIENCE[id];
  if (getTravelerFood(id)) return FOOD_TO_EXPERIENCE[id] ?? 'classic-popular';
  return null;
}

export function FoodPage({ initialFoodId, onInitialFoodConsumed }) {
  const { experienceMode } = useAppState();

  if (experienceMode === 'traveler') {
    return (
      <TravelerFoodPage
        initialExperienceId={resolveTravelerInitialId(initialFoodId)}
        onInitialConsumed={onInitialFoodConsumed}
      />
    );
  }

  return (
    <LocalFoodPage
      initialMoodId={initialFoodId}
      onInitialMoodConsumed={onInitialFoodConsumed}
    />
  );
}
