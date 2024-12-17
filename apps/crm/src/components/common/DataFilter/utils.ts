import { FilterCondition, FilterState } from './types';

export const matchesCondition = (value: string, condition: FilterCondition): boolean => {
  const compareValue = value.toLowerCase();
  const filterValue = condition.value.toLowerCase();

  switch (condition.operator) {
    case 'equals':
      return compareValue === filterValue;
    case 'contains':
      return compareValue.includes(filterValue);
    case 'startsWith':
      return compareValue.startsWith(filterValue);
    case 'endsWith':
      return compareValue.endsWith(filterValue);
    default:
      return true;
  }
};

export const getUniqueValues = (data: any[], field: string): Set<string> => {
  const values = new Set<string>();
  data.forEach(item => {
    // Handle special case for contact field that combines email and phone
    if (field === 'contact') {
      if (item.email) values.add(item.email);
      if (item.phone) values.add(item.phone);
    } else {
      const value = item[field];
      if (value) values.add(value);
    }
  });
  return values;
};

export const applyFilters = <T extends Record<string, any>>(
  data: T[],
  conditions: FilterCondition[],
  getFieldValue: (item: T, field: string) => string = (item, field) => item[field]
): T[] => {
  return data.filter(item => {
    return conditions.every(condition => {
      if (!condition.value) return true;
      
      const itemValue = getFieldValue(item, condition.field);
      if (!itemValue) return false;

      return matchesCondition(itemValue, condition);
    });
  });
};

export const loadSavedFilters = (storageKey: string) => {
  try {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map((filter: any) => ({
      ...filter,
      conditions: filter.conditions || [],
    }));
  } catch (error) {
    console.error(`Error loading saved filters for ${storageKey}:`, error);
    return [];
  }
};

export const saveFilters = (storageKey: string, filters: any[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(filters));
  } catch (error) {
    console.error(`Error saving filters for ${storageKey}:`, error);
  }
};

export const convertConditionsToFilterState = (conditions: FilterCondition[]): FilterState => {
  const filterState: FilterState = {};
  conditions.forEach((condition) => {
    if (condition.value) {
      filterState[condition.field] = condition.value;
    }
  });
  return filterState;
};
